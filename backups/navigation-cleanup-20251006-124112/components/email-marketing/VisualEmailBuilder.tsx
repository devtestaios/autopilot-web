'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type,
  Image as ImageIcon,
  Video,
  Calendar,
  Hash,
  AtSign,
  MapPin,
  Sparkles,
  Eye,
  BarChart3,
  Target,
  Wand2,
  Copy,
  RotateCcw,
  Download,
  Upload,
  Palette,
  Settings,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Users,
  TrendingUp,
  Zap,
  Filter,
  Layers,
  Smartphone,
  Monitor,
  Tablet,
  Link2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  Move,
  Square,
  Circle,
  Triangle,
  Trash2,
  Save,
  Send,
  Code,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';

interface VisualEmailBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emailData: EmailData) => void;
  importedContent?: any;
  campaignType?: string;
  className?: string;
}

interface EmailData {
  subject: string;
  preheader: string;
  htmlContent: string;
  textContent: string;
  components: EmailComponent[];
  settings: {
    width: number;
    backgroundColor: string;
    fontFamily: string;
    responsive: boolean;
  };
  metadata: {
    aiOptimized: boolean;
    brandCompliant: boolean;
    deliverabilityScore: number;
    readabilityScore: number;
  };
}

interface EmailComponent {
  id: string;
  type: 'text' | 'image' | 'button' | 'spacer' | 'divider' | 'header' | 'footer' | 'social';
  content: any;
  styles: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: string;
    color?: string;
    fontWeight?: string;
    lineHeight?: string;
  };
  responsive?: {
    mobile?: any;
    tablet?: any;
  };
}

const defaultComponents: EmailComponent[] = [
  {
    id: 'header-1',
    type: 'header',
    content: {
      text: 'Email Header',
      logoUrl: '/api/placeholder/200/50'
    },
    styles: {
      padding: '20px',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333333'
    }
  },
  {
    id: 'text-1',
    type: 'text',
    content: {
      text: 'Welcome to our newsletter! This is your main content area where you can write your message.'
    },
    styles: {
      padding: '20px',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#666666'
    }
  },
  {
    id: 'button-1',
    type: 'button',
    content: {
      text: 'Call to Action',
      url: 'https://example.com'
    },
    styles: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#007bff',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  {
    id: 'footer-1',
    type: 'footer',
    content: {
      text: 'Your Company Name | Unsubscribe | Privacy Policy',
      companyName: 'Your Company',
      address: '123 Street, City, State 12345'
    },
    styles: {
      padding: '20px',
      backgroundColor: '#f8f9fa',
      textAlign: 'center',
      fontSize: '12px',
      color: '#999999'
    }
  }
];

export default function VisualEmailBuilder({
  isOpen,
  onClose,
  onSave,
  importedContent,
  campaignType = 'newsletter',
  className = ''
}: VisualEmailBuilderProps) {
  const { generateResponse, isLoading: aiLoading } = useUnifiedAI();
  
  // Core state
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'settings' | 'preview'>('design');
  const [emailData, setEmailData] = useState<EmailData>({
    subject: '',
    preheader: '',
    htmlContent: '',
    textContent: '',
    components: defaultComponents,
    settings: {
      width: 600,
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      responsive: true
    },
    metadata: {
      aiOptimized: false,
      brandCompliant: true,
      deliverabilityScore: 85,
      readabilityScore: 8.2
    }
  });
  
  // UI state
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Canvas reference
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load imported content
  useEffect(() => {
    if (importedContent) {
      setEmailData(prev => ({
        ...prev,
        subject: importedContent.content?.subject || '',
        preheader: importedContent.content?.preheader || '',
        htmlContent: importedContent.content?.htmlContent || '',
        textContent: importedContent.content?.textContent || '',
        metadata: {
          ...prev.metadata,
          aiOptimized: importedContent.metadata?.aiOptimized || false
        }
      }));
      
      // If imported content has HTML, parse it into components
      if (importedContent.content?.htmlContent) {
        // Simple parsing - in a real implementation, you'd use a proper HTML parser
        const hasText = importedContent.content.textContent;
        if (hasText) {
          const textComponent: EmailComponent = {
            id: `imported-text-${Date.now()}`,
            type: 'text',
            content: { text: hasText },
            styles: {
              padding: '20px',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#666666'
            }
          };
          
          setEmailData(prev => ({
            ...prev,
            components: [
              prev.components[0], // Keep header
              textComponent,
              ...prev.components.slice(2) // Keep button and footer
            ]
          }));
        }
      }
      
      toast.success('Content imported into email builder');
    }
  }, [importedContent]);

  // Generate HTML from components
  const generateHTML = useCallback(() => {
    const { components, settings } = emailData;
    
    const componentHTML = components.map(component => {
      const styles = Object.entries(component.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
      
      switch (component.type) {
        case 'header':
          return `
            <div style="${styles}">
              ${component.content.logoUrl ? `<img src="${component.content.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;" />` : ''}
              <h1 style="margin: 0; ${styles}">${component.content.text}</h1>
            </div>
          `;
        case 'text':
          return `<div style="${styles}">${component.content.text}</div>`;
        case 'button':
          return `
            <div style="${styles}">
              <a href="${component.content.url || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; text-decoration: none; border-radius: 4px; font-weight: ${component.styles.fontWeight};">${component.content.text}</a>
            </div>
          `;
        case 'image':
          return `<div style="${styles}"><img src="${component.content.url || '/api/placeholder/400/200'}" alt="${component.content.alt || 'Image'}" style="width: 100%; height: auto;" /></div>`;
        case 'spacer':
          return `<div style="height: ${component.content.height || '20px'};"></div>`;
        case 'divider':
          return `<div style="${styles}"><hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" /></div>`;
        case 'footer':
          return `
            <div style="${styles}">
              <p style="margin: 0 0 10px 0;">${component.content.text}</p>
              ${component.content.address ? `<p style="margin: 0; font-size: 10px;">${component.content.address}</p>` : ''}
            </div>
          `;
        default:
          return `<div style="${styles}">${component.content.text || ''}</div>`;
      }
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailData.subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: ${settings.fontFamily}; background-color: ${settings.backgroundColor};">
          <div style="max-width: ${settings.width}px; margin: 0 auto; background-color: ${settings.backgroundColor};">
            ${componentHTML}
          </div>
        </body>
      </html>
    `;
  }, [emailData]);

  // Update component
  const updateComponent = useCallback((componentId: string, updates: Partial<EmailComponent>) => {
    setEmailData(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    }));
  }, []);

  // Add new component
  const addComponent = useCallback((type: EmailComponent['type']) => {
    const newComponent: EmailComponent = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
    
    setEmailData(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
    
    setSelectedComponent(newComponent.id);
  }, []);

  // Delete component
  const deleteComponent = useCallback((componentId: string) => {
    setEmailData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId)
    }));
    
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  // AI content optimization
  const optimizeWithAI = useCallback(async () => {
    setIsGeneratingAI(true);
    
    try {
      const prompt = `
        Optimize this email for better engagement and deliverability:
        
        Subject: "${emailData.subject}"
        Content: "${emailData.textContent || 'No content provided'}"
        Campaign Type: ${campaignType}
        
        Please provide:
        1. Improved subject line (under 50 characters)
        2. Compelling preheader text (under 90 characters)
        3. Enhanced content with better structure and engagement
        4. Suggestions for improvement
        
        Format as JSON with keys: subject, preheader, content, suggestions
      `;

      const response = await generateResponse(prompt, 'email-optimization');
      
      try {
        const aiSuggestions = JSON.parse(response);
        
        setEmailData(prev => ({
          ...prev,
          subject: aiSuggestions.subject || prev.subject,
          preheader: aiSuggestions.preheader || prev.preheader,
          textContent: aiSuggestions.content || prev.textContent,
          metadata: {
            ...prev.metadata,
            aiOptimized: true,
            deliverabilityScore: Math.min(prev.metadata.deliverabilityScore + 10, 100),
            readabilityScore: Math.min(prev.metadata.readabilityScore + 1, 10)
          }
        }));
        
        // Update main text component if it exists
        const textComponent = emailData.components.find(c => c.type === 'text');
        if (textComponent && aiSuggestions.content) {
          updateComponent(textComponent.id, {
            content: { text: aiSuggestions.content }
          });
        }
        
        toast.success('Email optimized with AI suggestions');
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        toast.error('AI optimization failed - invalid response format');
      }
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize with AI');
    } finally {
      setIsGeneratingAI(false);
    }
  }, [emailData, campaignType, generateResponse, updateComponent]);

  // Handle save
  const handleSave = useCallback(() => {
    const htmlContent = generateHTML();
    const finalEmailData = {
      ...emailData,
      htmlContent,
      textContent: emailData.components
        .filter(c => c.type === 'text' || c.type === 'header')
        .map(c => c.content.text)
        .join('\n\n')
    };
    
    onSave(finalEmailData);
    toast.success('Email saved successfully');
  }, [emailData, generateHTML, onSave]);

  // Helper functions
  function getDefaultContent(type: EmailComponent['type']) {
    switch (type) {
      case 'text': return { text: 'Your text content here...' };
      case 'image': return { url: '/api/placeholder/400/200', alt: 'Image' };
      case 'button': return { text: 'Click Here', url: 'https://example.com' };
      case 'header': return { text: 'Header Text', logoUrl: '' };
      case 'footer': return { text: 'Footer content', companyName: 'Your Company' };
      case 'spacer': return { height: '20px' };
      case 'divider': return {};
      default: return { text: 'Content' };
    }
  }

  function getDefaultStyles(type: EmailComponent['type']) {
    const baseStyles = { padding: '20px' };
    
    switch (type) {
      case 'header':
        return { ...baseStyles, textAlign: 'center' as const, fontSize: '24px', fontWeight: 'bold', color: '#333333' };
      case 'text':
        return { ...baseStyles, fontSize: '16px', lineHeight: '1.6', color: '#666666' };
      case 'button':
        return { ...baseStyles, textAlign: 'center' as const, backgroundColor: '#007bff', color: '#ffffff' };
      case 'footer':
        return { ...baseStyles, textAlign: 'center' as const, fontSize: '12px', color: '#999999', backgroundColor: '#f8f9fa' };
      default:
        return baseStyles;
    }
  }

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Visual Email Builder
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Design professional emails with drag & drop components
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={optimizeWithAI}
              disabled={isGeneratingAI || aiLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingAI ? 'Optimizing...' : 'AI Optimize'}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(95vh-140px)]">
          {/* Left Sidebar - Components & Settings */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4 p-2">
                <TabsTrigger value="design" className="text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="content" className="text-xs">
                  <Type className="w-3 h-3 mr-1" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>

              {/* Design Tab */}
              <TabsContent value="design" className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Add Components</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'text', icon: Type, label: 'Text' },
                      { type: 'image', icon: ImageIcon, label: 'Image' },
                      { type: 'button', icon: Square, label: 'Button' },
                      { type: 'spacer', icon: Minus, label: 'Spacer' },
                      { type: 'divider', icon: Minus, label: 'Divider' },
                      { type: 'social', icon: Users, label: 'Social' }
                    ].map((component) => {
                      const Icon = component.icon;
                      return (
                        <Button
                          key={component.type}
                          variant="outline"
                          size="sm"
                          onClick={() => addComponent(component.type as EmailComponent['type'])}
                          className="flex items-center gap-1 h-10"
                        >
                          <Icon className="w-3 h-3" />
                          <span className="text-xs">{component.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Component Properties */}
                {selectedComponent && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Component Properties</h3>
                    <div className="space-y-3">
                      {(() => {
                        const component = emailData.components.find(c => c.id === selectedComponent);
                        if (!component) return null;

                        return (
                          <div className="space-y-3">
                            {/* Content editing based on component type */}
                            {component.type === 'text' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Text Content
                                </label>
                                <Textarea
                                  value={component.content.text || ''}
                                  onChange={(e) => updateComponent(component.id, {
                                    content: { ...component.content, text: e.target.value }
                                  })}
                                  className="min-h-20"
                                />
                              </div>
                            )}

                            {component.type === 'button' && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Button Text
                                  </label>
                                  <Input
                                    value={component.content.text || ''}
                                    onChange={(e) => updateComponent(component.id, {
                                      content: { ...component.content, text: e.target.value }
                                    })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Link URL
                                  </label>
                                  <Input
                                    value={component.content.url || ''}
                                    onChange={(e) => updateComponent(component.id, {
                                      content: { ...component.content, url: e.target.value }
                                    })}
                                    placeholder="https://example.com"
                                  />
                                </div>
                              </>
                            )}

                            {component.type === 'image' && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Image URL
                                  </label>
                                  <Input
                                    value={component.content.url || ''}
                                    onChange={(e) => updateComponent(component.id, {
                                      content: { ...component.content, url: e.target.value }
                                    })}
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Alt Text
                                  </label>
                                  <Input
                                    value={component.content.alt || ''}
                                    onChange={(e) => updateComponent(component.id, {
                                      content: { ...component.content, alt: e.target.value }
                                    })}
                                    placeholder="Image description"
                                  />
                                </div>
                              </>
                            )}

                            {/* Style controls */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Text Align
                              </label>
                              <div className="flex gap-1">
                                {[
                                  { value: 'left', icon: AlignLeft },
                                  { value: 'center', icon: AlignCenter },
                                  { value: 'right', icon: AlignRight }
                                ].map((align) => {
                                  const Icon = align.icon;
                                  return (
                                    <Button
                                      key={align.value}
                                      variant={component.styles.textAlign === align.value ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => updateComponent(component.id, {
                                        styles: { ...component.styles, textAlign: align.value as any }
                                      })}
                                    >
                                      <Icon className="w-3 h-3" />
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Font Size
                              </label>
                              <Input
                                value={component.styles.fontSize || '16px'}
                                onChange={(e) => updateComponent(component.id, {
                                  styles: { ...component.styles, fontSize: e.target.value }
                                })}
                                placeholder="16px"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Text Color
                              </label>
                              <Input
                                type="color"
                                value={component.styles.color || '#000000'}
                                onChange={(e) => updateComponent(component.id, {
                                  styles: { ...component.styles, color: e.target.value }
                                })}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Background Color
                              </label>
                              <Input
                                type="color"
                                value={component.styles.backgroundColor || '#ffffff'}
                                onChange={(e) => updateComponent(component.id, {
                                  styles: { ...component.styles, backgroundColor: e.target.value }
                                })}
                              />
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteComponent(component.id)}
                              className="w-full"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete Component
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Subject
                  </label>
                  <Input
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject..."
                    maxLength={50}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {emailData.subject.length}/50 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preheader Text
                  </label>
                  <Input
                    value={emailData.preheader}
                    onChange={(e) => setEmailData(prev => ({ ...prev, preheader: e.target.value }))}
                    placeholder="Preview text that appears after subject..."
                    maxLength={90}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {emailData.preheader.length}/90 characters
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Email Quality</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Deliverability Score</span>
                        <span>{emailData.metadata.deliverabilityScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${emailData.metadata.deliverabilityScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Readability Score</span>
                        <span>{emailData.metadata.readabilityScore}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(emailData.metadata.readabilityScore / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {emailData.metadata.aiOptimized && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        AI Optimized
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      This email has been optimized for better engagement and deliverability.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Width
                  </label>
                  <Input
                    type="number"
                    value={emailData.settings.width}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, width: parseInt(e.target.value) || 600 }
                    }))}
                    min="320"
                    max="800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={emailData.settings.fontFamily}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, fontFamily: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Color
                  </label>
                  <Input
                    type="color"
                    value={emailData.settings.backgroundColor}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, backgroundColor: e.target.value }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Responsive Design
                  </label>
                  <Switch
                    checked={emailData.settings.responsive}
                    onCheckedChange={(checked) => setEmailData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, responsive: checked }
                    }))}
                  />
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Device Preview</h3>
                  <div className="flex gap-1">
                    {[
                      { device: 'desktop', icon: Monitor, label: 'Desktop' },
                      { device: 'tablet', icon: Tablet, label: 'Tablet' },
                      { device: 'mobile', icon: Smartphone, label: 'Mobile' }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.device}
                          variant={previewDevice === item.device ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice(item.device as any)}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          <span className="text-xs">{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show HTML Code
                  </span>
                  <Switch
                    checked={showCode}
                    onCheckedChange={setShowCode}
                  />
                </div>

                {showCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Generated HTML
                    </label>
                    <Textarea
                      value={generateHTML()}
                      readOnly
                      className="min-h-32 font-mono text-xs"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
            <div className="h-full overflow-auto">
              <div 
                ref={canvasRef}
                className={`mx-auto bg-white shadow-lg ${
                  previewDevice === 'mobile' ? 'max-w-sm' :
                  previewDevice === 'tablet' ? 'max-w-md' :
                  'max-w-2xl'
                }`}
                style={{ 
                  maxWidth: previewDevice === 'desktop' ? `${emailData.settings.width}px` : undefined,
                  fontFamily: emailData.settings.fontFamily,
                  backgroundColor: emailData.settings.backgroundColor
                }}
              >
                {emailData.components.map((component) => (
                  <div
                    key={component.id}
                    onClick={() => setSelectedComponent(component.id)}
                    className={`relative group cursor-pointer ${
                      selectedComponent === component.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {/* Component content */}
                    <div
                      style={{
                        ...component.styles,
                        textAlign: component.styles.textAlign || 'left'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          switch (component.type) {
                            case 'header':
                              return `
                                ${component.content.logoUrl ? `<img src="${component.content.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;" />` : ''}
                                <h1 style="margin: 0;">${component.content.text}</h1>
                              `;
                            case 'text':
                              return component.content.text || 'Text content';
                            case 'button':
                              return `<a href="${component.content.url || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; text-decoration: none; border-radius: 4px; font-weight: ${component.styles.fontWeight};">${component.content.text}</a>`;
                            case 'image':
                              return `<img src="${component.content.url || '/api/placeholder/400/200'}" alt="${component.content.alt || 'Image'}" style="width: 100%; height: auto;" />`;
                            case 'spacer':
                              return `<div style="height: ${component.content.height || '20px'};"></div>`;
                            case 'divider':
                              return '<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />';
                            case 'footer':
                              return `
                                <p style="margin: 0 0 10px 0;">${component.content.text}</p>
                                ${component.content.address ? `<p style="margin: 0; font-size: 10px;">${component.content.address}</p>` : ''}
                              `;
                            default:
                              return component.content.text || 'Content';
                          }
                        })()
                      }}
                    />
                    
                    {/* Hover controls */}
                    {selectedComponent === component.id && (
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteComponent(component.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {emailData.components.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4" />
                    <p>Start building your email by adding components</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {emailData.components.length} components • {emailData.settings.responsive ? 'Responsive' : 'Fixed width'}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Email
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}