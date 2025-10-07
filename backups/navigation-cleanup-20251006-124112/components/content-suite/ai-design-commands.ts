// AI Design Command System for Advanced Design Studio
import { CanvasElement } from './AdvancedDesignStudio';

// AI Design Command Interface
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

// Generate unique ID for elements
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Parse user messages for design commands
export const parseDesignCommands = (userMessage: string, aiResponse: string): AIDesignCommand[] => {
  const lowerMessage = userMessage.toLowerCase();
  const commands: AIDesignCommand[] = [];

  // Check for vision board requests
  if (lowerMessage.includes('vision board') || lowerMessage.includes('mood board')) {
    commands.push({
      type: 'create_vision_board',
      layout: 'vision_board',
      theme: extractTheme(userMessage),
      autoExecute: true
    });
  }

  // Check for specific style requests
  const styleMatch = Object.keys(DESIGN_STYLES).find(style => 
    lowerMessage.includes(style) || lowerMessage.includes(style + ' style')
  );
  
  if (styleMatch) {
    commands.push({
      type: 'apply_style',
      style: styleMatch as any,
      autoExecute: true
    });
  }

  // Check for layout requests
  if (lowerMessage.includes('layout') || lowerMessage.includes('arrange')) {
    commands.push({
      type: 'create_layout',
      layout: 'rule_of_thirds',
      autoExecute: true
    });
  }

  return commands;
};

// Extract theme from user message
const extractTheme = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('restaurant')) return 'restaurant';
  if (lowerMessage.includes('retro')) return 'retro';
  if (lowerMessage.includes('natural')) return 'natural';
  if (lowerMessage.includes('moody')) return 'moody';
  
  return 'professional';
};

// Generate enhanced fallback response with design creation
export const generateEnhancedFallbackResponse = (userMessage: string, context: any): { message: string; commands?: AIDesignCommand[] } => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Vision board creation
  if (lowerMessage.includes('vision board') && lowerMessage.includes('restaurant')) {
    return {
      message: `I'll create a sleek, moody retro restaurant vision board for you! I'm adding:

• **Background**: Warm, textured backdrop with natural tones
• **Typography**: Elegant retro fonts for headers and labels  
• **Color Palette**: Earth tones with sage greens and warm browns
• **Layout**: Professional grid structure with breathing room
• **Style Elements**: Natural textures and muted accents

Let me build this design for you now...`,
      commands: [
        {
          type: 'create_vision_board',
          theme: 'restaurant',
          style: 'retro',
          colors: DESIGN_STYLES.restaurant.colors,
          autoExecute: true
        }
      ]
    };
  }

  // Color palette requests
  if (lowerMessage.includes('color') || lowerMessage.includes('palette')) {
    const theme = extractTheme(userMessage);
    const colors = DESIGN_STYLES[theme as keyof typeof DESIGN_STYLES]?.colors || DESIGN_STYLES.professional.colors;
    
    return {
      message: `Perfect! I'll create a ${theme} color palette for your design. Adding color swatches with: ${colors.join(', ')}`,
      commands: [
        {
          type: 'create_palette',
          colors,
          autoExecute: true
        }
      ]
    };
  }

  // Layout creation
  if (lowerMessage.includes('layout') || lowerMessage.includes('composition')) {
    return {
      message: `I'll create a professional layout using the rule of thirds and proper spacing. Adding structured elements with visual hierarchy...`,
      commands: [
        {
          type: 'create_layout',
          layout: 'rule_of_thirds',
          autoExecute: true
        }
      ]
    };
  }

  // Default with suggestions
  return {
    message: `I can help you create designs! Here's what I can do:

• **Create Vision Boards** - "Create a retro restaurant vision board"
• **Apply Style Themes** - "Make this moody and natural"  
• **Generate Color Palettes** - "Add a warm, earthy color scheme"
• **Professional Layouts** - "Arrange these elements professionally"
• **Add Text & Shapes** - "Add a title and some design elements"

What would you like me to create for you?`
  };
};

// Create vision board elements
export const createVisionBoardElements = (theme: string, canvasSize: { width: number; height: number }): CanvasElement[] => {
  const style = DESIGN_STYLES[theme as keyof typeof DESIGN_STYLES] || DESIGN_STYLES.professional;
  const elements: CanvasElement[] = [];
  
  // Background
  elements.push({
    id: generateId(),
    type: 'shape',
    x: 0,
    y: 0,
    width: canvasSize.width,
    height: canvasSize.height,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    zIndex: 0,
    shapeType: 'rectangle',
    fill: style.colors[4], // Light background color
    stroke: 'none',
    strokeWidth: 0
  });

  // Title
  elements.push({
    id: generateId(),
    type: 'text',
    x: 50,
    y: 40,
    width: canvasSize.width - 100,
    height: 60,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    zIndex: 10,
    text: theme === 'restaurant' ? 'Restaurant Vision Board' : `${theme.charAt(0).toUpperCase() + theme.slice(1)} Vision Board`,
    fontSize: 36,
    fontFamily: style.fonts[0],
    fontWeight: 'bold',
    color: style.colors[0],
    textAlign: 'center'
  });

  // Color palette swatches
  style.colors.forEach((color, index) => {
    elements.push({
      id: generateId(),
      type: 'shape',
      x: 50 + (index * 80),
      y: 120,
      width: 60,
      height: 60,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 5,
      shapeType: 'circle',
      fill: color,
      stroke: '#ffffff',
      strokeWidth: 3
    });
  });

  // Section labels
  const sections = ['Colors', 'Typography', 'Mood', 'Elements'];
  sections.forEach((section, index) => {
    elements.push({
      id: generateId(),
      type: 'text',
      x: 50 + (index * 200),
      y: 220,
      width: 180,
      height: 30,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 10,
      text: section,
      fontSize: 18,
      fontFamily: style.fonts[0],
      fontWeight: '600',
      color: style.colors[1],
      textAlign: 'center'
    });
  });

  // Decorative elements
  for (let i = 0; i < 3; i++) {
    elements.push({
      id: generateId(),
      type: 'shape',
      x: 100 + (i * 250),
      y: 300 + (i * 50),
      width: 120,
      height: 80,
      rotation: 15 * (i - 1),
      opacity: 0.7,
      locked: false,
      visible: true,
      zIndex: 3,
      shapeType: 'rectangle',
      fill: style.colors[i + 1],
      stroke: 'none',
      strokeWidth: 0
    });
  }

  return elements;
};

// Create color palette elements
export const createColorPaletteElements = (colors: string[], canvasSize: { width: number; height: number }): CanvasElement[] => {
  const elements: CanvasElement[] = [];
  const swatchSize = 80;
  const spacing = 20;
  const totalWidth = (colors.length * swatchSize) + ((colors.length - 1) * spacing);
  const startX = (canvasSize.width - totalWidth) / 2;

  colors.forEach((color, index) => {
    elements.push({
      id: generateId(),
      type: 'shape',
      x: startX + (index * (swatchSize + spacing)),
      y: canvasSize.height / 2 - swatchSize / 2,
      width: swatchSize,
      height: swatchSize,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 5,
      shapeType: 'circle',
      fill: color,
      stroke: '#ffffff',
      strokeWidth: 4
    });

    // Color label
    elements.push({
      id: generateId(),
      type: 'text',
      x: startX + (index * (swatchSize + spacing)),
      y: canvasSize.height / 2 + swatchSize / 2 + 10,
      width: swatchSize,
      height: 20,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 10,
      text: color.toUpperCase(),
      fontSize: 10,
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      color: '#333333',
      textAlign: 'center'
    });
  });

  return elements;
};

// Execute AI commands
export const executeAICommands = async (
  commands: AIDesignCommand[], 
  canvasSize: { width: number; height: number },
  addElements: (elements: CanvasElement[]) => void
): Promise<void> => {
  for (const command of commands) {
    switch (command.type) {
      case 'create_vision_board':
        const visionBoardElements = createVisionBoardElements(command.theme || 'professional', canvasSize);
        addElements(visionBoardElements);
        break;
        
      case 'create_palette':
        if (command.colors) {
          const paletteElements = createColorPaletteElements(command.colors, canvasSize);
          addElements(paletteElements);
        }
        break;
        
      case 'create_element':
        if (command.element) {
          const element: CanvasElement = {
            id: generateId(),
            type: command.element.type || 'text',
            x: command.element.x || 100,
            y: command.element.y || 100,
            width: command.element.width || 200,
            height: command.element.height || 50,
            rotation: command.element.rotation || 0,
            opacity: command.element.opacity || 1,
            locked: false,
            visible: true,
            zIndex: 5,
            ...command.element
          };
          addElements([element]);
        }
        break;
    }
  }
};