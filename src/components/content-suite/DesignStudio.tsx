'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Move,
  RotateCw,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Layers,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Minus,
  Plus,
  Copy,
  Trash2,
  Save,
  Download,
  Share2,
  Undo,
  Redo,
  Grid,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Hand,
  Crop,
  Filter,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// Types
export type CanvasElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  textDecoration?: 'none' | 'underline';
  color?: string;
  // Image specific
  src?: string;
  // Shape specific
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Icon specific
  iconName?: string;
};

export type CanvasTemplate = {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  width: number;
  height: number;
  elements: CanvasElement[];
};

export interface DesignStudioProps {
  templates: CanvasTemplate[];
  onSave: (design: { elements: CanvasElement[]; template?: CanvasTemplate }) => void;
  onExport: (format: 'png' | 'jpg' | 'svg' | 'pdf') => void;
  className?: string;
}

// Tool Types
type Tool = 'select' | 'text' | 'rectangle' | 'circle' | 'image' | 'hand' | 'crop';

// Canvas Toolbar Component
function CanvasToolbar({ 
  selectedTool, 
  onToolChange, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  zoom,
  onZoomChange
}: {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}) {
  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer className="w-4 h-4" />, label: 'Select' },
    { id: 'hand', icon: <Hand className="w-4 h-4" />, label: 'Pan' },
    { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
    { id: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle className="w-4 h-4" />, label: 'Circle' },
    { id: 'image', icon: <ImageIcon className="w-4 h-4" />, label: 'Image' },
    { id: 'crop', icon: <Crop className="w-4 h-4" />, label: 'Crop' },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* History Controls */}
      <div className="flex items-center gap-1 mr-4">
        <Button
          size="sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Tools */}
      <div className="flex items-center gap-1 mr-4">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            variant={selectedTool === tool.id ? 'default' : 'outline'}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </Button>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Properties Panel Component
function PropertiesPanel({ 
  selectedElement, 
  onElementUpdate 
}: {
  selectedElement: CanvasElement | null;
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center text-gray-500 py-8">
          <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Properties</h3>
      
      <div className="space-y-4">
        {/* Basic Properties */}
        <div>
          <label className="text-sm font-medium block mb-2">Position & Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">X</label>
              <Input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) => onElementUpdate(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Y</label>
              <Input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) => onElementUpdate(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Width</label>
              <Input
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => onElementUpdate(selectedElement.id, { width: parseInt(e.target.value) || 1 })}
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Height</label>
              <Input
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => onElementUpdate(selectedElement.id, { height: parseInt(e.target.value) || 1 })}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Rotation & Opacity */}
        <div>
          <label className="text-sm font-medium block mb-2">Transform</label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Rotation</label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedElement.rotation]}
                  onValueChange={([value]) => onElementUpdate(selectedElement.id, { rotation: value })}
                  min={0}
                  max={360}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-8">{selectedElement.rotation}°</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Opacity</label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedElement.opacity * 100]}
                  onValueChange={([value]) => onElementUpdate(selectedElement.id, { opacity: value / 100 })}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-8">{Math.round(selectedElement.opacity * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <div>
            <label className="text-sm font-medium block mb-2">Text</label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Content</label>
                <Input
                  value={selectedElement.text || ''}
                  onChange={(e) => onElementUpdate(selectedElement.id, { text: e.target.value })}
                  placeholder="Enter text..."
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Font Size</label>
                <Input
                  type="number"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => onElementUpdate(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Color</label>
                <Input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => onElementUpdate(selectedElement.id, { color: e.target.value })}
                  className="h-8"
                />
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'}
                  onClick={() => onElementUpdate(selectedElement.id, { 
                    fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                >
                  <Bold className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                  onClick={() => onElementUpdate(selectedElement.id, { 
                    fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                >
                  <Italic className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                  onClick={() => onElementUpdate(selectedElement.id, { 
                    textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' 
                  })}
                >
                  <Underline className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                  onClick={() => onElementUpdate(selectedElement.id, { textAlign: 'left' })}
                >
                  <AlignLeft className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                  onClick={() => onElementUpdate(selectedElement.id, { textAlign: 'center' })}
                >
                  <AlignCenter className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                  onClick={() => onElementUpdate(selectedElement.id, { textAlign: 'right' })}
                >
                  <AlignRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Shape Properties */}
        {selectedElement.type === 'shape' && (
          <div>
            <label className="text-sm font-medium block mb-2">Appearance</label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Fill Color</label>
                <Input
                  type="color"
                  value={selectedElement.fill || '#000000'}
                  onChange={(e) => onElementUpdate(selectedElement.id, { fill: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Stroke Color</label>
                <Input
                  type="color"
                  value={selectedElement.stroke || '#000000'}
                  onChange={(e) => onElementUpdate(selectedElement.id, { stroke: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Stroke Width</label>
                <Input
                  type="number"
                  value={selectedElement.strokeWidth || 1}
                  onChange={(e) => onElementUpdate(selectedElement.id, { strokeWidth: parseInt(e.target.value) || 1 })}
                  className="h-8"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Layer Controls */}
        <div>
          <label className="text-sm font-medium block mb-2">Layer</label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onElementUpdate(selectedElement.id, { 
                visible: !selectedElement.visible 
              })}
              className="flex-1"
            >
              {selectedElement.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {selectedElement.visible ? 'Hide' : 'Show'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onElementUpdate(selectedElement.id, { 
                locked: !selectedElement.locked 
              })}
              className="flex-1"
            >
              {selectedElement.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {selectedElement.locked ? 'Unlock' : 'Lock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Canvas Element Component
function CanvasElementComponent({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdate,
  zoom 
}: {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  zoom: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.locked) return;
    
    e.stopPropagation();
    onSelect(element.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX - element.x * zoom, y: e.clientY - element.y * zoom });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = (e.clientX - dragStart.x) / zoom;
    const newY = (e.clientY - dragStart.y) / zoom;
    
    onUpdate(element.id, { x: newX, y: newY });
  }, [isDragging, dragStart, element.id, onUpdate, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!element.visible) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.x * zoom,
    top: element.y * zoom,
    width: element.width * zoom,
    height: element.height * zoom,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    zIndex: element.zIndex,
    cursor: element.locked ? 'default' : 'move',
    border: isSelected ? '2px solid #3b82f6' : 'none',
    borderRadius: '2px'
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: (element.fontSize || 16) * zoom,
              fontFamily: element.fontFamily || 'inherit',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textAlign: element.textAlign || 'left',
              textDecoration: element.textDecoration || 'none',
              color: element.color || '#000000',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.textAlign === 'center' ? 'center' : 
                             element.textAlign === 'right' ? 'flex-end' : 'flex-start'
            }}
          >
            {element.text || 'Text'}
          </div>
        );
      
      case 'image':
        return (
          <img
            src={element.src || '/placeholder-image.jpg'}
            alt="Canvas element"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            draggable={false}
          />
        );
      
      case 'shape':
        if (element.iconName === 'rectangle') {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: element.fill || 'transparent',
                border: `${element.strokeWidth || 1}px solid ${element.stroke || '#000000'}`
              }}
            />
          );
        } else if (element.iconName === 'circle') {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: element.fill || 'transparent',
                border: `${element.strokeWidth || 1}px solid ${element.stroke || '#000000'}`,
                borderRadius: '50%'
              }}
            />
          );
        }
        break;
      
      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      className={isSelected ? 'ring-2 ring-blue-500' : ''}
    >
      {renderContent()}
    </div>
  );
}

// Main Design Studio Component
export default function DesignStudio({ 
  templates, 
  onSave, 
  onExport, 
  className = '' 
}: DesignStudioProps) {
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [canvasSize] = useState({ width: 1080, height: 1080 }); // Instagram square
  const canvasRef = useRef<HTMLDivElement>(null);

  // Save state to history
  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Update elements and save to history
  const updateElements = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
    saveToHistory(newElements);
  }, [saveToHistory]);

  // Add element to canvas
  const addElement = useCallback((type: CanvasElement['type'], position?: { x: number; y: number }) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type,
      x: position?.x || 100,
      y: position?.y || 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: elements.length,
      // Default properties based on type
      ...(type === 'text' && {
        text: 'New Text',
        fontSize: 24,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        textDecoration: 'none',
        color: '#000000'
      }),
      ...(type === 'shape' && {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        iconName: 'rectangle'
      })
    };

    const newElements = [...elements, newElement];
    updateElements(newElements);
    setSelectedElementId(newElement.id);
  }, [elements, updateElements]);

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
  }, [elements]);

  // Canvas click handler
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      setSelectedElementId(null);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (selectedTool === 'text') {
      addElement('text', { x, y });
    } else if (selectedTool === 'rectangle') {
      addElement('shape', { x, y });
    } else if (selectedTool === 'circle') {
      const circleElement: CanvasElement = {
        id: `element-${Date.now()}`,
        type: 'shape',
        x,
        y,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: elements.length,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        iconName: 'circle'
      };
      updateElements([...elements, circleElement]);
      setSelectedElementId(circleElement.id);
    }
  }, [selectedTool, zoom, addElement, elements, updateElements]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const selectedElement = selectedElementId ? elements.find(el => el.id === selectedElementId) : null;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold">Design Studio</h2>
          <p className="text-gray-600 dark:text-gray-400">Create stunning visuals with AI-powered tools</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onSave({ elements })}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={() => onExport('png')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <CanvasToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-auto">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg"
            style={{
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
              cursor: selectedTool === 'hand' ? 'grab' : 'default'
            }}
            onClick={handleCanvasClick}
          >
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`
              }}
            />
            
            {/* Elements */}
            {elements.map((element) => (
              <CanvasElementComponent
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={setSelectedElementId}
                onUpdate={updateElement}
                zoom={zoom}
              />
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onElementUpdate={updateElement}
        />
      </div>
    </div>
  );
}