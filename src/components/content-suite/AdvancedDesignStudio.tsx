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
  Wand2,
  PenTool
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
import { 
  AIDesignCommand as ImportedAIDesignCommand, 
  parseDesignCommands, 
  generateEnhancedFallbackResponse, 
  executeAICommands 
} from './ai-design-commands';

// AI Design Command Interface (Golden Compass Domain 1: Design Systems)
export interface AIDesignCommand {
  type: 'create_element' | 'modify_element' | 'create_layout' | 'apply_style' | 'create_palette' | 'create_vision_board';
  element?: Partial<CanvasElement>;
  elements?: Partial<CanvasElement>[];
  layout?: 'grid' | 'centered' | 'asymmetric' | 'rule_of_thirds' | 'vision_board';
  style?: 'retro' | 'modern' | 'natural' | 'moody' | 'professional' | 'restaurant';
  colors?: string[];
  theme?: string;
  instructions?: string;
  autoExecute?: boolean;
}

export interface AIDesignResponse {
  message: string;
  commands?: AIDesignCommand[];
  preview?: string;
}

// Design Style Definitions
export const DESIGN_STYLES = {
  retro: {
    colors: ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#CD853F'],
    fonts: ['Georgia, serif', 'Times New Roman, serif'],
    elements: ['vintage', 'warm', 'textured']
  },
  natural: {
    colors: ['#8FBC8F', '#F5F5DC', '#D2B48C', '#A0522D', '#228B22'],
    fonts: ['Inter, sans-serif', 'Helvetica, Arial, sans-serif'],
    elements: ['organic', 'earth-tones', 'minimal']
  },
  moody: {
    colors: ['#2F4F4F', '#696969', '#708090', '#A9A9A9', '#D3D3D3'],
    fonts: ['Georgia, serif', 'Inter, sans-serif'],
    elements: ['dark', 'sophisticated', 'shadowed']
  },
  restaurant: {
    colors: ['#8B4513', '#8FBC8F', '#F5F5DC', '#D2691E', '#2F4F4F'],
    fonts: ['Georgia, serif', 'Times New Roman, serif'],
    elements: ['elegant', 'warm', 'inviting']
  }
};

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
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
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
    angle?: number;
    centerX?: number;
    centerY?: number;
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
  shapeType?: 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'pentagon' | 'hexagon' | 'star' | 'heart' | 'arrow' | 'diamond' | 'polygon';
  pathData?: string;
  // Layer effects
  effects?: {
    innerShadow?: { x: number; y: number; blur: number; spread: number; color: string };
    outerShadow?: { x: number; y: number; blur: number; spread: number; color: string };
    stroke?: { width: number; color: string; position: 'inside' | 'outside' | 'center' };
    glow?: { blur: number; color: string; spread: number };
  };
  // Group specific
  groupChildren?: string[];
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

export interface AdvancedDesignStudioProps {
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
      content: 'Hi! I\'m your AI Design Assistant. I can actually create designs for you! Try asking me to "create a vision board for a retro restaurant" or "generate a natural color palette" and I\'ll build it automatically.'
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
        colors: elements.map(el => el.color || el.fill).filter(Boolean),
        availableTools: ['text', 'shapes', 'images', 'backgrounds', 'colors'],
        capabilities: {
          canCreateElements: true,
          canModifyLayout: true,
          canApplyStyles: true,
          canGeneratePalettes: true,
          supportedElements: ['text', 'shapes', 'images', 'backgrounds'],
          supportedStyles: ['retro', 'modern', 'natural', 'moody', 'professional', 'restaurant']
        }
      };

      // Enhanced AI context for design creation
      const enhancedContext = {
        designContext,
        canvasSize,
        elementCount: designContext.elementCount,
        page: 'design-studio',
        instructions: `You are an AI Design Assistant that can actually create designs programmatically. 
        When users request designs, you can:
        1. Create text elements with appropriate fonts and colors
        2. Add shapes and backgrounds with proper styling
        3. Apply color palettes based on requested themes
        4. Create complete layouts like vision boards
        5. Auto-execute design commands
        
        For style requests like 'retro restaurant' or 'natural moody', create appropriate design elements automatically.`
      };

      // Try the API first, but have enhanced fallback
      let assistantMessage = '';
      let aiCommands: AIDesignCommand[] = [];
      
      try {
        const chatRequest = {
          message: userMessage,
          context: enhancedContext,
          conversation_history: messages.slice(-5)
        };

        const response = await chatWithAI(chatRequest);
        assistantMessage = response.response || response.toString();
        
        // Parse response for design commands
        const parsedCommands = parseDesignCommands(userMessage, assistantMessage);
        if (parsedCommands.length > 0) {
          aiCommands = parsedCommands;
        }
      } catch (apiError) {
        console.warn('API unavailable, using enhanced fallback responses:', apiError);
        // Enhanced fallback with design creation capabilities
        const fallbackResult = generateEnhancedFallbackResponse(userMessage, designContext);
        assistantMessage = fallbackResult.message;
        aiCommands = fallbackResult.commands || [];
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Auto-execute AI design commands
      if (aiCommands.length > 0) {
        await executeAICommands(aiCommands, canvasSize, addElements);
        // Add a follow-up message about what was created
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '✨ Design elements have been added to your canvas! You can select and modify any element using the properties panel on the right.' 
        }]);
      }

      if (assistantMessage.toLowerCase().includes('would you like me to') || 
          assistantMessage.toLowerCase().includes('i can create') ||
          assistantMessage.toLowerCase().includes('shall i add')) {
        onAutoSuggestion(assistantMessage);
      }

    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m having trouble connecting right now. Let me help you with some design tips instead! Try asking about layout, colors, or typography.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function for when API is unavailable
  const generateFallbackResponse = (userMessage: string, context: any): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('color') || lowerMessage.includes('palette')) {
      return `Great question about colors! For your ${context.canvasSize.width}x${context.canvasSize.height}px design, consider using a cohesive color palette. Try the 60-30-10 rule: 60% dominant color, 30% secondary color, and 10% accent color. Would you like me to suggest some specific color combinations?`;
    }
    
    if (lowerMessage.includes('text') || lowerMessage.includes('typography') || lowerMessage.includes('font')) {
      return `Typography is crucial for professional designs! For your current canvas, I recommend establishing a clear hierarchy with different font sizes. Try using a maximum of 2-3 font families, and ensure good contrast with your background. Consider line spacing of 1.2-1.5 for readability.`;
    }
    
    if (lowerMessage.includes('layout') || lowerMessage.includes('composition')) {
      return `Layout is key to professional design! For your ${context.elementCount}-element design, consider using the rule of thirds to create visual interest. Align elements to create clean lines, use consistent spacing, and ensure there's enough white space for the design to breathe.`;
    }
    
    if (lowerMessage.includes('background') || lowerMessage.includes('backdrop')) {
      return `A good background sets the foundation! For your design, consider a subtle gradient, solid color, or minimal pattern that doesn't compete with your main content. Keep contrast in mind - light backgrounds work well with dark text, and vice versa.`;
    }
    
    if (lowerMessage.includes('professional') || lowerMessage.includes('improve')) {
      return `To make your design more professional: 1) Ensure consistent alignment and spacing, 2) Use a limited color palette (3-5 colors max), 3) Choose readable typography with good hierarchy, 4) Add subtle shadows or effects sparingly, 5) Keep it simple and focused on your main message.`;
    }
    
    if (lowerMessage.includes('export') || lowerMessage.includes('save') || lowerMessage.includes('download')) {
      return `For exporting your design: Use PNG for web graphics with transparency, JPG for photographs, SVG for logos and scalable graphics, or PDF for print materials. Make sure your design is at least 300 DPI for print (your current canvas is perfect for digital use).`;
    }
    
    // Default helpful response
    return `I can help you with your design! Here are some things I can assist with:
    
• **Colors & Palettes** - Creating harmonious color schemes
• **Typography** - Font selection and text hierarchy  
• **Layout & Composition** - Professional arrangement principles
• **Visual Effects** - Shadows, gradients, and styling
• **Export & Quality** - Preparing for web or print

What specific aspect would you like to improve?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  };

  const handleQuickAction = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMessage(action);
    // Use setTimeout to ensure state update happens before sending
    setTimeout(() => sendMessage(), 100);
  };

  const quickActions = [
    { label: 'Vision Board', action: 'Create a professional vision board for a sleek, moody, retro style restaurant with natural elements' },
    { label: 'Color Palette', action: 'Generate a natural, moody color palette with earthy tones and muted colors' },
    { label: 'Professional Layout', action: 'Create a professional layout with proper hierarchy and spacing' },
    { label: 'Retro Style', action: 'Apply a retro restaurant style with warm, natural colors and elegant typography' },
    { label: 'Add Text Elements', action: 'Add professional text elements with proper typography hierarchy' },
    { label: 'Style Guide', action: 'Create a complete style guide with colors, fonts, and design elements' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 h-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Design Assistant</h3>
                  <p className="text-xs text-gray-500">Professional design guidance</p>
                </div>
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
                      className={`max-w-[85%] p-2 rounded-lg text-sm ${
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
              <div className="grid grid-cols-2 gap-1">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Button
                    key={index}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                    onClick={(e) => handleQuickAction(e, action.action)}
                    disabled={isLoading}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me about design, layout, colors, effects..."
                  className="flex-1 min-h-[40px] max-h-[80px] resize-none text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSendClick}
                  disabled={!message.trim() || isLoading}
                  className="self-end"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </form>
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

// Advanced Canvas Toolbar
function AdvancedCanvasToolbar({ 
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
        { id: 'select' as Tool, icon: <MousePointer className="w-4 h-4" />, label: 'Select (V)' },
        { id: 'direct-select' as Tool, icon: <Navigation className="w-4 h-4" />, label: 'Direct Select (A)' },
        { id: 'hand' as Tool, icon: <Hand className="w-4 h-4" />, label: 'Pan (H)' },
        { id: 'zoom' as Tool, icon: <ZoomIn className="w-4 h-4" />, label: 'Zoom (Z)' },
      ]
    },
    {
      name: 'Drawing',
      tools: [
        { id: 'pen' as Tool, icon: <PenTool className="w-4 h-4" />, label: 'Pen (P)' },
        { id: 'brush' as Tool, icon: <Brush className="w-4 h-4" />, label: 'Brush (B)' },
        { id: 'line' as Tool, icon: <Minus className="w-4 h-4" />, label: 'Line (\\)' },
        { id: 'arrow' as Tool, icon: <ArrowUp className="w-4 h-4" />, label: 'Arrow' },
      ]
    },
    {
      name: 'Shapes',
      tools: [
        { id: 'rectangle' as Tool, icon: <Square className="w-4 h-4" />, label: 'Rectangle (M)' },
        { id: 'circle' as Tool, icon: <Circle className="w-4 h-4" />, label: 'Circle (L)' },
        { id: 'ellipse' as Tool, icon: <Circle className="w-4 h-4" />, label: 'Ellipse' },
        { id: 'triangle' as Tool, icon: <Triangle className="w-4 h-4" />, label: 'Triangle' },
        { id: 'polygon' as Tool, icon: <Hexagon className="w-4 h-4" />, label: 'Polygon' },
        { id: 'star' as Tool, icon: <Star className="w-4 h-4" />, label: 'Star' },
      ]
    },
    {
      name: 'Content',
      tools: [
        { id: 'text' as Tool, icon: <Type className="w-4 h-4" />, label: 'Text (T)' },
        { id: 'image' as Tool, icon: <ImageIcon className="w-4 h-4" />, label: 'Image' },
      ]
    },
    {
      name: 'Tools',
      tools: [
        { id: 'crop' as Tool, icon: <Crop className="w-4 h-4" />, label: 'Crop' },
        { id: 'eyedropper' as Tool, icon: <Pipette className="w-4 h-4" />, label: 'Eyedropper (I)' },
        { id: 'eraser' as Tool, icon: <Eraser className="w-4 h-4" />, label: 'Eraser' },
        { id: 'gradient' as Tool, icon: <Palette className="w-4 h-4" />, label: 'Gradient (G)' },
      ]
    }
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {/* History Controls */}
      <div className="flex items-center gap-1 mr-3">
        <Button
          size="sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="h-8"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="h-8"
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
          title="Toggle Grid (Ctrl+;)"
          className="h-8"
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={showRuler ? 'default' : 'outline'}
          onClick={onRulerToggle}
          title="Toggle Ruler (Ctrl+R)"
          className="h-8"
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
          title="Zoom Out (-)"
          className="h-8"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="w-16 text-center text-sm font-medium">
          {Math.round(zoom * 100)}%
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.min(5, zoom + 0.1))}
          title="Zoom In (+)"
          className="h-8"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(1)}
          title="Fit to Screen (Ctrl+0)"
          className="h-8"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Main Component - Professional Design Studio
export default function AdvancedDesignStudio({ 
  templates, 
  onSave, 
  onExport, 
  className = '' 
}: AdvancedDesignStudioProps) {
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState<{x: number, y: number}[]>([]);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History management
  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const updateElements = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
    saveToHistory(newElements);
  }, [saveToHistory]);

  // Add professional element with defaults
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
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      anchorX: 0.5,
      anchorY: 0.5,
      blendMode: 'normal',
      // Professional text defaults
      ...(type === 'text' && {
        text: 'Professional Text',
        fontSize: 24,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: '400',
        fontStyle: 'normal',
        textAlign: 'left',
        textDecoration: 'none',
        color: '#1f2937',
        letterSpacing: 0,
        lineHeight: 1.2
      }),
      // Professional shape defaults
      ...(type === 'shape' && {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 0,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        shapeType: 'rectangle'
      })
    };

    const newElements = [...elements, newElement];
    updateElements(newElements);
    setSelectedElementId(newElement.id);
  }, [elements, updateElements]);

  // Helper function for AI to add multiple elements
  const addElements = useCallback((newElements: CanvasElement[]) => {
    const updatedElements = [...elements, ...newElements];
    updateElements(updatedElements);
    if (newElements.length > 0) {
      setSelectedElementId(newElements[newElements.length - 1].id);
    }
  }, [elements, updateElements]);

  // Photo upload handler
  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate proportional size that fits within reasonable bounds
          const maxWidth = 400;
          const maxHeight = 400;
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          const imageElement: CanvasElement = {
            id: `element-${Date.now()}`,
            type: 'image',
            x: 100,
            y: 100,
            width: Math.round(width),
            height: Math.round(height),
            rotation: 0,
            opacity: 1,
            locked: false,
            visible: true,
            zIndex: elements.length,
            scaleX: 1,
            scaleY: 1,
            src: e.target?.result as string
          };
          
          updateElements([...elements, imageElement]);
          setSelectedElementId(imageElement.id);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  }, [elements, updateElements]);

  // Professional canvas click handler with all tools
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select' || selectedTool === 'hand') {
      setSelectedElementId(null);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    switch (selectedTool) {
      case 'text':
        addElement('text', { x, y });
        break;
        
      case 'rectangle':
        const rectElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 150,
          height: 100,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: '#000000',
          strokeWidth: 2,
          shapeType: 'rectangle'
        };
        updateElements([...elements, rectElement]);
        setSelectedElementId(rectElement.id);
        break;
        
      case 'circle':
        const circleElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 120,
          height: 120,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: '#000000',
          strokeWidth: 2,
          shapeType: 'circle'
        };
        updateElements([...elements, circleElement]);
        setSelectedElementId(circleElement.id);
        break;
        
      case 'ellipse':
        const ellipseElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 160,
          height: 100,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: '#000000',
          strokeWidth: 2,
          shapeType: 'ellipse'
        };
        updateElements([...elements, ellipseElement]);
        setSelectedElementId(ellipseElement.id);
        break;
        
      case 'triangle':
        const triangleElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 120,
          height: 120,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: '#000000',
          strokeWidth: 2,
          shapeType: 'triangle'
        };
        updateElements([...elements, triangleElement]);
        setSelectedElementId(triangleElement.id);
        break;
        
      case 'polygon':
        const polygonElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 120,
          height: 120,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: '#000000',
          strokeWidth: 2,
          shapeType: 'hexagon'
        };
        updateElements([...elements, polygonElement]);
        setSelectedElementId(polygonElement.id);
        break;
        
      case 'star':
        const starElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 120,
          height: 120,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: '#000000',
          strokeWidth: 2,
          shapeType: 'star'
        };
        updateElements([...elements, starElement]);
        setSelectedElementId(starElement.id);
        break;
        
      case 'line':
        const lineElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 150,
          height: 2,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: 'transparent',
          stroke: selectedColor,
          strokeWidth: 3,
          shapeType: 'line'
        };
        updateElements([...elements, lineElement]);
        setSelectedElementId(lineElement.id);
        break;
        
      case 'arrow':
        const arrowElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'shape',
          x, y,
          width: 150,
          height: 20,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: elements.length,
          scaleX: 1,
          scaleY: 1,
          fill: selectedColor,
          stroke: selectedColor,
          strokeWidth: 2,
          shapeType: 'arrow'
        };
        updateElements([...elements, arrowElement]);
        setSelectedElementId(arrowElement.id);
        break;
        
      case 'image':
        // Trigger file upload
        fileInputRef.current?.click();
        break;
    }
  }, [selectedTool, zoom, addElement, elements, updateElements, selectedColor]);

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
  }, [elements]);

  // Delete selected element
  const deleteSelectedElement = useCallback(() => {
    if (selectedElementId) {
      const newElements = elements.filter(el => el.id !== selectedElementId);
      updateElements(newElements);
      setSelectedElementId(null);
    }
  }, [selectedElementId, elements, updateElements]);

  // Duplicate selected element
  const duplicateSelectedElement = useCallback(() => {
    if (selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element) {
        const duplicatedElement: CanvasElement = {
          ...element,
          id: `element-${Date.now()}`,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: elements.length
        };
        updateElements([...elements, duplicatedElement]);
        setSelectedElementId(duplicatedElement.id);
      }
    }
  }, [selectedElementId, elements, updateElements]);

  // Group selected elements
  const groupElements = useCallback(() => {
    // Implementation for grouping multiple selected elements
    console.log('Group elements functionality');
  }, []);

  // Ungroup selected group
  const ungroupElements = useCallback(() => {
    // Implementation for ungrouping
    console.log('Ungroup elements functionality');
  }, []);

  // Bring to front
  const bringToFront = useCallback(() => {
    if (selectedElementId) {
      const maxZ = Math.max(...elements.map(el => el.zIndex));
      updateElement(selectedElementId, { zIndex: maxZ + 1 });
    }
  }, [selectedElementId, elements, updateElement]);

  // Send to back
  const sendToBack = useCallback(() => {
    if (selectedElementId) {
      const minZ = Math.min(...elements.map(el => el.zIndex));
      updateElement(selectedElementId, { zIndex: minZ - 1 });
    }
  }, [selectedElementId, elements, updateElement]);

  // Copy color from element (eyedropper tool)
  const copyColor = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element && (element.fill || element.color)) {
      setSelectedColor(element.fill || element.color || '#000000');
      setSelectedTool('select'); // Switch back to select tool
    }
  }, [elements]);

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

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'd':
            e.preventDefault();
            duplicateSelectedElement();
            break;
          case 'a':
            e.preventDefault();
            // Select all elements (could be implemented)
            break;
          case 's':
            e.preventDefault();
            onSave({ elements, metadata: { canvasSize } });
            break;
        }
      } else {
        // Tool shortcuts
        switch (e.key.toLowerCase()) {
          case 'v':
            setSelectedTool('select');
            break;
          case 'a':
            setSelectedTool('direct-select');
            break;
          case 'h':
            setSelectedTool('hand');
            break;
          case 'z':
            setSelectedTool('zoom');
            break;
          case 't':
            setSelectedTool('text');
            break;
          case 'm':
            setSelectedTool('rectangle');
            break;
          case 'l':
            setSelectedTool('circle');
            break;
          case 'p':
            setSelectedTool('pen');
            break;
          case 'b':
            setSelectedTool('brush');
            break;
          case 'i':
            setSelectedTool('eyedropper');
            break;
          case 'g':
            setSelectedTool('gradient');
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            deleteSelectedElement();
            break;
          case 'Escape':
            setSelectedElementId(null);
            setSelectedTool('select');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateSelectedElement, deleteSelectedElement, onSave, elements, canvasSize]);

  // Get cursor style based on selected tool
  const getCursorStyle = (tool: Tool): string => {
    switch (tool) {
      case 'select': return 'default';
      case 'hand': return 'grab';
      case 'text': return 'text';
      case 'zoom': return 'zoom-in';
      case 'eyedropper': return 'crosshair';
      case 'brush': return 'crosshair';
      case 'pen': return 'crosshair';
      case 'eraser': return 'crosshair';
      case 'crop': return 'crosshair';
      default: return 'crosshair';
    }
  };

  const selectedElement = selectedElementId ? elements.find(el => el.id === selectedElementId) : null;

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Professional Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              Professional Design Studio
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adobe Illustrator-level tools with Canva's ease of use + AI assistance
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={`${canvasSize.width}x${canvasSize.height}`} onValueChange={(value) => {
            const [width, height] = value.split('x').map(Number);
            setCanvasSize({ width, height });
          }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080x1080">Instagram Square</SelectItem>
              <SelectItem value="1080x1920">Instagram Story</SelectItem>
              <SelectItem value="1200x630">Facebook Cover</SelectItem>
              <SelectItem value="2560x1440">Desktop Wallpaper</SelectItem>
              <SelectItem value="8000x6000">Print A4 (300 DPI)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => onSave({ elements, metadata: { canvasSize } })}>
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

      {/* Advanced Toolbar */}
      <AdvancedCanvasToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
        onZoomChange={setZoom}
        onGridToggle={() => setShowGrid(!showGrid)}
        showGrid={showGrid}
        onRulerToggle={() => setShowRuler(!showRuler)}
        showRuler={showRuler}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onUploadPhoto={() => fileInputRef.current?.click()}
        onDeleteElement={deleteSelectedElement}
        onDuplicateElement={duplicateSelectedElement}
        hasSelectedElement={!!selectedElementId}
      />

      {/* Main Canvas Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Container */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-auto p-4">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl border border-gray-300 dark:border-gray-600"
            style={{
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
              cursor: getCursorStyle(selectedTool)
            }}
            onClick={handleCanvasClick}
          >
            {/* Professional Grid */}
            {showGrid && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #3b82f6 1px, transparent 1px),
                    linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
                  `,
                  backgroundSize: `${20 * zoom}px ${20 * zoom}px`
                }}
              />
            )}
            
            {/* Professional Rulers */}
            {showRuler && (
              <>
                {/* Top Ruler */}
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gray-200 dark:bg-gray-700 border-b text-xs">
                  {/* Ruler marks would go here */}
                </div>
                {/* Left Ruler */}
                <div className="absolute -left-6 top-0 bottom-0 w-6 bg-gray-200 dark:bg-gray-700 border-r text-xs">
                  {/* Ruler marks would go here */}
                </div>
              </>
            )}
            
            {/* Canvas Elements */}
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-pointer transition-all duration-150 ${
                  selectedElementId === element.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                style={{
                  left: element.x * zoom,
                  top: element.y * zoom,
                  width: element.width * zoom,
                  height: element.height * zoom,
                  transform: `rotate(${element.rotation}deg) scale(${element.scaleX || 1}, ${element.scaleY || 1})`,
                  opacity: element.opacity,
                  zIndex: element.zIndex,
                  display: element.visible ? 'block' : 'none'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementId(element.id);
                }}
              >
                {/* Render element content based on type */}
                {element.type === 'text' && (
                  <div
                    style={{
                      fontSize: (element.fontSize || 16) * zoom,
                      fontFamily: element.fontFamily || 'Inter, sans-serif',
                      fontWeight: element.fontWeight || 'normal',
                      fontStyle: element.fontStyle || 'normal',
                      textAlign: element.textAlign || 'left',
                      textDecoration: element.textDecoration || 'none',
                      color: element.color || '#000000',
                      letterSpacing: element.letterSpacing || 0,
                      lineHeight: element.lineHeight || 1.2,
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
                )}
                
                {element.type === 'shape' && element.shapeType === 'rectangle' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fill || 'transparent',
                      border: element.strokeWidth ? 
                        `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'circle' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fill || 'transparent',
                      border: element.strokeWidth ? 
                        `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none',
                      borderRadius: '50%'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'ellipse' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fill || 'transparent',
                      border: element.strokeWidth ? 
                        `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none',
                      borderRadius: '50%'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'triangle' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, transparent 49%, ${element.fill || '#3b82f6'} 50%)`,
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'star' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fill || '#3b82f6',
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'hexagon' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fill || '#3b82f6',
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'line' && (
                  <div
                    style={{
                      width: '100%',
                      height: element.strokeWidth || 2,
                      backgroundColor: element.stroke || '#000000',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      position: 'relative'
                    }}
                  />
                )}
                
                {element.type === 'shape' && element.shapeType === 'arrow' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.fill || '#3b82f6',
                      clipPath: 'polygon(0% 40%, 60% 40%, 60% 20%, 100% 50%, 60% 80%, 60% 60%, 0% 60%)'
                    }}
                  />
                )}
                
                {element.type === 'image' && (
                  <img
                    src={element.src || '/placeholder-image.jpg'}
                    alt="Canvas element"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional Properties Panel */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          {selectedElement ? (
            <div className="h-full flex flex-col">
              {/* Element Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold capitalize">{selectedElement.type} Properties</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateElement(selectedElement.id, { 
                        visible: !selectedElement.visible 
                      })}
                    >
                      {selectedElement.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateElement(selectedElement.id, { 
                        locked: !selectedElement.locked 
                      })}
                    >
                      {selectedElement.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Properties Content */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {/* Position & Size */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Position & Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-500">X</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.x)}
                          onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Y</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.y)}
                          onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Width</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.width)}
                          onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 1 })}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Height</Label>
                        <Input
                          type="number"
                          value={Math.round(selectedElement.height)}
                          onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 1 })}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transform */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Transform</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Rotation</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[selectedElement.rotation]}
                            onValueChange={([value]) => updateElement(selectedElement.id, { rotation: value })}
                            min={0}
                            max={360}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-10">{selectedElement.rotation}°</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Opacity</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[selectedElement.opacity * 100]}
                            onValueChange={([value]) => updateElement(selectedElement.id, { opacity: value / 100 })}
                            min={0}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs w-10">{Math.round(selectedElement.opacity * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Properties */}
                  {selectedElement.type === 'text' && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Typography</Label>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-500">Text Content</Label>
                          <Textarea
                            value={selectedElement.text || ''}
                            onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                            placeholder="Enter text..."
                            className="min-h-[60px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500">Font Size</Label>
                            <Input
                              type="number"
                              value={selectedElement.fontSize || 16}
                              onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Color</Label>
                            <Input
                              type="color"
                              value={selectedElement.color || '#000000'}
                              onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Font Family</Label>
                          <Select 
                            value={selectedElement.fontFamily || 'Inter'} 
                            onValueChange={(value) => updateElement(selectedElement.id, { fontFamily: value })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                              <SelectItem value="Helvetica, Arial, sans-serif">Helvetica</SelectItem>
                              <SelectItem value="Georgia, serif">Georgia</SelectItem>
                              <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                              <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Text Style Controls */}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={selectedElement.fontWeight === 'bold' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedElement.id, { 
                              fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                            })}
                          >
                            <Bold className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedElement.fontStyle === 'italic' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedElement.id, { 
                              fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
                            })}
                          >
                            <Italic className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedElement.textDecoration === 'underline' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedElement.id, { 
                              textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' 
                            })}
                          >
                            <Underline className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Text Alignment */}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                          >
                            <AlignLeft className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                          >
                            <AlignCenter className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
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
                      <Label className="text-sm font-medium mb-2 block">Appearance</Label>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500">Fill Color</Label>
                            <Input
                              type="color"
                              value={selectedElement.fill || '#3b82f6'}
                              onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Stroke Color</Label>
                            <Input
                              type="color"
                              value={selectedElement.stroke || '#1e40af'}
                              onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Stroke Width</Label>
                          <Input
                            type="number"
                            value={selectedElement.strokeWidth || 0}
                            onChange={(e) => updateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) || 0 })}
                            className="h-8"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select an element to edit properties</p>
                <div className="mt-4 space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Design Tips
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Palette className="w-4 h-4 mr-2" />
                    Color Harmony
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for photo uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        style={{ display: 'none' }}
      />

      {/* AI Design Assistant */}
      <AIDesignAssistant
        elements={elements}
        onElementsUpdate={updateElements}
        canvasSize={canvasSize}
        onAutoSuggestion={setAiSuggestion}
      />
    </div>
  );
}