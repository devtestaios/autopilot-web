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
  Sparkles,
  Pentagon,
  Star,
  Triangle,
  Hexagon,
  ArrowUp,
  Heart,
  Zap,
  Cloud,
  Sun,
  Moon,
  Droplets,
  Flower,
  Scissors,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Group,
  Ungroup,
  BringToFront,
  SendToBack,
  Maximize,
  Minimize,
  CornerDownLeft,
  CornerDownRight,
  FileImage,
  Upload,
  RefreshCw,
  Settings,
  Brush,
  Eraser,
  Pipette,
  Ruler,
  Navigation,
  MessageSquare,
  Bot,
  Wand2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { chatWithAI } from '@/lib/ai-api';

// Enhanced Types for Professional Design
export type CanvasElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon' | 'line' | 'arrow' | 'path' | 'group';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  // Professional transformation properties
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  anchorX?: number; // 0-1
  anchorY?: number; // 0-1
  // Advanced styling
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion';
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    hueRotate?: number;
    saturate?: number;
    sepia?: number;
    invert?: boolean;
    grayscale?: number;
    dropShadow?: { x: number; y: number; blur: number; color: string };
  };
  // Text specific - Enhanced
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: { x: number; y: number; blur: number; color: string };
  // Gradient support
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    stops: Array<{ position: number; color: string }>;
    angle?: number; // for linear
    centerX?: number; // for radial/conic
    centerY?: number; // for radial/conic
  };
  // Image specific - Enhanced
  src?: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  imageFilters?: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    hue?: number;
    blur?: number;
  };
  // Shape specific - Enhanced
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDashArray?: string;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeLineJoin?: 'miter' | 'round' | 'bevel';
  // Shape types
  shapeType?: 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'pentagon' | 'hexagon' | 'star' | 'heart' | 'arrow' | 'diamond' | 'polygon';
  // Path data for custom shapes
  pathData?: string;
  // Masking
  mask?: string; // CSS mask property
  clipPath?: string; // CSS clip-path property
  // Animation properties
  animation?: {
    type: 'fade' | 'slide' | 'rotate' | 'scale' | 'bounce' | 'pulse';
    duration: number;
    delay?: number;
    easing?: string;
    loop?: boolean;
  };
  // Layer effects
  effects?: {
    innerShadow?: { x: number; y: number; blur: number; spread: number; color: string };
    outerShadow?: { x: number; y: number; blur: number; spread: number; color: string };
    stroke?: { width: number; color: string; position: 'inside' | 'outside' | 'center' };
    glow?: { blur: number; color: string; spread: number };
  };
  // Group specific
  groupChildren?: string[]; // Array of child element IDs
  // Constraints for responsive design
  constraints?: {
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
    centerX?: boolean;
    centerY?: boolean;
    width?: boolean;
    height?: boolean;
  };
};

export type DesignTemplate = {
  id: string;
  name: string;
  category: 'social' | 'print' | 'web' | 'presentation' | 'branding' | 'marketing';
  subcategory?: string;
  thumbnail: string;
  width: number;
  height: number;
  elements: CanvasElement[];
  tags: string[];
  isPremium?: boolean;
  aiGenerated?: boolean;
};

export interface DesignStudioProps {
  templates: DesignTemplate[];
  onSave: (design: { elements: CanvasElement[]; template?: DesignTemplate; metadata?: any }) => void;
  onExport: (format: 'png' | 'jpg' | 'svg' | 'pdf' | 'webp', quality?: number) => void;
  className?: string;
}

// Professional Tool Types
type Tool = 
  | 'select' 
  | 'direct-select'
  | 'text' 
  | 'rectangle' 
  | 'circle' 
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'star'
  | 'line'
  | 'arrow'
  | 'pen'
  | 'brush'
  | 'eraser'
  | 'image' 
  | 'hand' 
  | 'zoom'
  | 'crop'
  | 'eyedropper'
  | 'gradient'
  | 'mask';

// Color Palette Component
function ColorPalette({ 
  selectedColor, 
  onColorChange,
  colors = []
}: {
  selectedColor: string;
  onColorChange: (color: string) => void;
  colors?: string[];
}) {
  const defaultColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#808080', '#C0C0C0', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  const colorPalette = colors.length > 0 ? colors : defaultColors;

  return (
    <div className="grid grid-cols-6 gap-1 p-2">
      {colorPalette.map((color, index) => (
        <button
          key={index}
          className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
            selectedColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          title={color}
        />
      ))}
    </div>
  );
}

// Gradient Editor Component
function GradientEditor({
  gradient,
  onGradientChange
}: {
  gradient?: CanvasElement['gradient'];
  onGradientChange: (gradient: CanvasElement['gradient']) => void;
}) {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>(gradient?.type || 'linear');
  const [stops, setStops] = useState(gradient?.stops || [
    { position: 0, color: '#FF0000' },
    { position: 1, color: '#0000FF' }
  ]);

  const updateGradient = (updates: Partial<NonNullable<CanvasElement['gradient']>>) => {
    const newGradient = {
      type: gradientType,
      stops,
      ...updates
    };
    onGradientChange(newGradient);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Gradient Type</Label>
        <Select value={gradientType} onValueChange={(value: string) => {
          setGradientType(value as 'linear' | 'radial' | 'conic');
          updateGradient({ type: value as 'linear' | 'radial' | 'conic' });
        }}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
            <SelectItem value="conic">Conic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Color Stops</Label>
        {stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <Input
              type="color"
              value={stop.color}
              onChange={(e) => {
                const newStops = [...stops];
                newStops[index].color = e.target.value;
                setStops(newStops);
                updateGradient({ stops: newStops });
              }}
              className="w-12 h-8 p-0 border-0"
            />
            <Slider
              value={[stop.position * 100]}
              onValueChange={([value]) => {
                const newStops = [...stops];
                newStops[index].position = value / 100;
                setStops(newStops);
                updateGradient({ stops: newStops });
              }}
              max={100}
              step={1}
              className="flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newStops = stops.filter((_, i) => i !== index);
                setStops(newStops);
                updateGradient({ stops: newStops });
              }}
              disabled={stops.length <= 2}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newStops = [...stops, { position: 0.5, color: '#808080' }];
            setStops(newStops);
            updateGradient({ stops: newStops });
          }}
          className="mt-2"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Stop
        </Button>
      </div>
    </div>
  );
}

// AI Design Assistant Component
function AIDesignAssistant({
  elements,
  onElementsUpdate,
  canvasSize,
  onAutoSuggestion
}: {
  elements: CanvasElement[];
  onElementsUpdate: (elements: CanvasElement[]) => void;
  canvasSize: { width: number; height: number };
  onAutoSuggestion: (suggestion: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Design Assistant. I can help you create designs, suggest improvements, generate content, apply effects, and much more. What would you like to work on?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Create context about the current design
      const designContext = {
        canvasSize,
        elementCount: elements.length,
        elementTypes: elements.reduce((acc, el) => {
          acc[el.type] = (acc[el.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        hasText: elements.some(el => el.type === 'text'),
        hasImages: elements.some(el => el.type === 'image'),
        hasShapes: elements.some(el => el.type === 'shape'),
        colors: elements.map(el => el.color || el.fill).filter(Boolean)
      };

      const contextPrompt = `
You are an expert AI Design Assistant working in a professional design studio. Current design context:
- Canvas size: ${canvasSize.width}x${canvasSize.height}px
- Elements: ${designContext.elementCount} total (${Object.entries(designContext.elementTypes).map(([type, count]) => `${count} ${type}`).join(', ')})
- Colors used: ${designContext.colors.join(', ') || 'None'}

User request: ${userMessage}

Provide helpful design advice, suggestions, or offer to perform actions like:
- Creating new elements (text, shapes, images)
- Adjusting colors, fonts, and layouts
- Applying design principles (alignment, contrast, hierarchy)
- Generating content ideas
- Suggesting improvements
- Creating color palettes
- Layout optimization

Be specific and actionable in your responses.`;

      const response = await chatWithAI({ message: contextPrompt });
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);

      // Check if the AI suggested specific actions
      if (response.response.toLowerCase().includes('would you like me to') || 
          response.response.toLowerCase().includes('i can create') ||
          response.response.toLowerCase().includes('shall i add')) {
        onAutoSuggestion(response.response);
      }

    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or rephrase your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'Create title text', action: 'Create a bold title text for my design' },
    { label: 'Add background', action: 'Add a beautiful background to my design' },
    { label: 'Improve layout', action: 'How can I improve the layout and composition?' },
    { label: 'Color suggestions', action: 'Suggest a color palette for this design' },
    { label: 'Add shapes', action: 'Add some decorative shapes to enhance the design' },
    { label: 'Design tips', action: 'Give me design tips to make this more professional' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">AI Design Assistant</h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <Minimize className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1 mb-2">
                {quickActions.slice(0, 3).map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      setMessage(action.action);
                      sendMessage();
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your design..."
                  className="flex-1 min-h-[40px] max-h-[80px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  className="self-end"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
      >
        {isOpen ? (
          <MessageSquare className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </Button>
    </div>
  );
}

// Canvas Toolbar Component
function CanvasToolbar({ 
  selectedTool, 
  onToolChange, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  zoom,
  onZoomChange,
  onGridToggle,
  showGrid,
  onRulerToggle,
  showRuler
}: {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onGridToggle: () => void;
  showGrid: boolean;
  onRulerToggle: () => void;
  showRuler: boolean;
}) {
  const toolGroups = [
    {
      name: 'Selection',
      tools: [
        { id: 'select' as Tool, icon: <MousePointer className="w-4 h-4" />, label: 'Select' },
        { id: 'direct-select' as Tool, icon: <Navigation className="w-4 h-4" />, label: 'Direct Select' },
        { id: 'hand' as Tool, icon: <Hand className="w-4 h-4" />, label: 'Pan' },
        { id: 'zoom' as Tool, icon: <ZoomIn className="w-4 h-4" />, label: 'Zoom' },
      ]
    },
    {
      name: 'Drawing',
      tools: [
        { id: 'pen' as Tool, icon: <PenTool className="w-4 h-4" />, label: 'Pen' },
        { id: 'brush' as Tool, icon: <Brush className="w-4 h-4" />, label: 'Brush' },
        { id: 'line' as Tool, icon: <Minus className="w-4 h-4" />, label: 'Line' },
        { id: 'arrow' as Tool, icon: <ArrowUp className="w-4 h-4" />, label: 'Arrow' },
      ]
    },
    {
      name: 'Shapes',
      tools: [
        { id: 'rectangle' as Tool, icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
        { id: 'circle' as Tool, icon: <Circle className="w-4 h-4" />, label: 'Circle' },
        { id: 'ellipse' as Tool, icon: <Circle className="w-4 h-4" />, label: 'Ellipse' },
        { id: 'triangle' as Tool, icon: <Triangle className="w-4 h-4" />, label: 'Triangle' },
        { id: 'polygon' as Tool, icon: <Hexagon className="w-4 h-4" />, label: 'Polygon' },
        { id: 'star' as Tool, icon: <Star className="w-4 h-4" />, label: 'Star' },
      ]
    },
    {
      name: 'Content',
      tools: [
        { id: 'text' as Tool, icon: <Type className="w-4 h-4" />, label: 'Text' },
        { id: 'image' as Tool, icon: <ImageIcon className="w-4 h-4" />, label: 'Image' },
      ]
    },
    {
      name: 'Tools',
      tools: [
        { id: 'crop' as Tool, icon: <Crop className="w-4 h-4" />, label: 'Crop' },
        { id: 'eyedropper' as Tool, icon: <Pipette className="w-4 h-4" />, label: 'Eyedropper' },
        { id: 'eraser' as Tool, icon: <Eraser className="w-4 h-4" />, label: 'Eraser' },
        { id: 'gradient' as Tool, icon: <Palette className="w-4 h-4" />, label: 'Gradient' },
      ]
    }
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {/* History Controls */}
      <div className="flex items-center gap-1 mr-4">
        <Button
          size="sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Tool Groups */}
      {toolGroups.map((group, groupIndex) => (
        <div key={group.name} className="flex items-center gap-1">
          {group.tools.map((tool) => (
            <Button
              key={tool.id}
              size="sm"
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
              className="w-8 h-8 p-0"
            >
              {tool.icon}
            </Button>
          ))}
          {groupIndex < toolGroups.length - 1 && (
            <Separator orientation="vertical" className="h-6 ml-2 mr-2" />
          )}
        </div>
      ))}

      <Separator orientation="vertical" className="h-6" />

      {/* View Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant={showGrid ? 'default' : 'outline'}
          onClick={onGridToggle}
          title="Toggle Grid"
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={showRuler ? 'default' : 'outline'}
          onClick={onRulerToggle}
          title="Toggle Ruler"
        >
          <Ruler className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="w-20 text-center text-sm font-medium">
          {Math.round(zoom * 100)}%
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.min(5, zoom + 0.1))}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(1)}
          title="Fit to Screen"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Enhanced Properties Panel Component
function EnhancedPropertiesPanel({ 
  selectedElement, 
  onElementUpdate 
}: {
  selectedElement: CanvasElement | null;
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  const [activeTab, setActiveTab] = useState('basic');
  
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center text-gray-500 py-8">
          <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select an element to edit properties</p>
          <div className="mt-4 space-y-2">
            <Button size="sm" variant="outline" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggestions
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Palette className="w-4 h-4 mr-2" />
              Color Themes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Element Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold capitalize">{selectedElement.type} Element</h3>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onElementUpdate(selectedElement.id, { 
                visible: !selectedElement.visible 
              })}
              title={selectedElement.visible ? 'Hide' : 'Show'}
            >
              {selectedElement.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onElementUpdate(selectedElement.id, { 
                locked: !selectedElement.locked 
              })}
              title={selectedElement.locked ? 'Unlock' : 'Lock'}
            >
              {selectedElement.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Property Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
          <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
          <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="p-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
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
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
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

// Main Enhanced Design Studio Component
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
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
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