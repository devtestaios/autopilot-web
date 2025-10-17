/**
 * Brand Kit Manager Component
 * 
 * Features:
 * - Upload logo and extract colors automatically
 * - Manage brand colors with accessibility checks
 * - Font pairing suggestions
 * - Brand asset library
 * - Guidelines editor
 * - Brand consistency scoring
 * - Export as CSS/JSON
 * 
 * @author PulseBridge.ai
 * @date October 2025
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Type,
  Image as ImageIcon,
  Upload,
  Download,
  Sparkles,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  Copy,
  FileJson,
  FileCode,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  BrandKit,
  BrandColor,
  BrandFont,
  BrandAsset,
  extractColorsFromImage,
  suggestFontPairings,
  calculateBrandConsistency,
  generateColorVariations,
  exportBrandKitAsCSS,
  exportBrandKitAsJSON,
} from '@/lib/brand-kit';

interface BrandKitManagerProps {
  onApplyBrandKit?: (brandKit: BrandKit) => void;
  existingBrandKit?: BrandKit;
}

export default function BrandKitManager({
  onApplyBrandKit,
  existingBrandKit,
}: BrandKitManagerProps) {
  const [brandKit, setBrandKit] = useState<BrandKit>(
    existingBrandKit || {
      id: Date.now().toString(),
      name: 'My Brand Kit',
      colors: [],
      fonts: [],
      assets: [],
      guidelines: {
        logoSpacing: { minimum: 24, recommended: 48 },
        colorUsage: {},
        typography: {
          headingSizes: [48, 36, 28, 20],
          bodySize: 16,
          lineHeight: 1.6,
        },
        spacing: { small: 8, medium: 16, large: 32 },
        doAndDonts: { do: [], dont: [] },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'assets' | 'guidelines'>('colors');
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedColor, setSelectedColor] = useState<BrandColor | null>(null);
  const [showVariations, setShowVariations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle logo upload and color extraction
  const handleLogoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);

    try {
      const imageUrl = URL.createObjectURL(file);
      const colors = await extractColorsFromImage(imageUrl, 5);

      setBrandKit(prev => ({
        ...prev,
        colors: [...colors],
        assets: [
          ...prev.assets,
          {
            id: Date.now().toString(),
            type: 'logo',
            url: imageUrl,
            name: file.name,
            tags: ['logo', 'brand'],
            dimensions: undefined,
            fileSize: file.size,
            format: file.type,
            usageCount: 0,
          },
        ],
        updatedAt: new Date(),
      }));
    } catch (error) {
      console.error('Failed to extract colors:', error);
      alert('Failed to extract colors from logo. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  }, []);

  // Add custom color
  const handleAddColor = useCallback(() => {
    const newColor: BrandColor = {
      hex: '#3B82F6',
      rgb: { r: 59, g: 130, b: 246 },
      hsl: { h: 217, s: 91, l: 60 },
      name: 'Blue',
      usage: 'accent',
    };

    setBrandKit(prev => ({
      ...prev,
      colors: [...prev.colors, newColor],
      updatedAt: new Date(),
    }));
  }, []);

  // Remove color
  const handleRemoveColor = useCallback((index: number) => {
    setBrandKit(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
      updatedAt: new Date(),
    }));
  }, []);

  // Update color
  const handleUpdateColor = useCallback((index: number, updates: Partial<BrandColor>) => {
    setBrandKit(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, ...updates } : color
      ),
      updatedAt: new Date(),
    }));
  }, []);

  // Add font
  const handleAddFont = useCallback((font: BrandFont) => {
    setBrandKit(prev => ({
      ...prev,
      fonts: [...prev.fonts, font],
      updatedAt: new Date(),
    }));
  }, []);

  // Get font pairings
  const handleGetFontPairings = useCallback(() => {
    const headingFont = brandKit.fonts.find(f => f.usage === 'heading');
    if (!headingFont) {
      alert('Please add a heading font first');
      return;
    }

    const pairings = suggestFontPairings(headingFont.family);
    setBrandKit(prev => ({
      ...prev,
      fonts: [...prev.fonts, ...pairings.filter(p => 
        !prev.fonts.some(f => f.family === p.family)
      )],
      updatedAt: new Date(),
    }));
  }, [brandKit.fonts]);

  // Export brand kit
  const handleExport = useCallback((format: 'css' | 'json') => {
    const content = format === 'css' 
      ? exportBrandKitAsCSS(brandKit)
      : exportBrandKitAsJSON(brandKit);

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-kit.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [brandKit]);

  // Apply brand kit
  const handleApply = useCallback(() => {
    onApplyBrandKit?.(brandKit);
    alert('Brand kit applied successfully!');
  }, [brandKit, onApplyBrandKit]);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Palette className="w-7 h-7 text-blue-600" />
              Brand Kit Manager
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Define your brand identity and ensure consistency across all designs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('css')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <FileCode className="w-4 h-4" />
              Export CSS
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApply}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply Brand Kit
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          {['colors', 'fonts', 'assets', 'guidelines'].map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Upload Logo */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Auto-Extract Colors from Logo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Upload your logo and we'll automatically extract your brand colors using AI
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isExtracting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Extracting Colors...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Logo
                    </>
                  )}
                </motion.button>
              </div>

              {/* Color Palette */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Brand Colors ({brandKit.colors.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Color
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brandKit.colors.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-4">
                        {/* Color Swatch */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-20 h-20 rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setSelectedColor(color)}
                          />
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => {
                              // Convert hex to RGB
                              const hex = e.target.value;
                              const rgb = {
                                r: parseInt(hex.slice(1, 3), 16),
                                g: parseInt(hex.slice(3, 5), 16),
                                b: parseInt(hex.slice(5, 7), 16),
                              };
                              handleUpdateColor(index, { hex, rgb });
                            }}
                            className="w-20 h-8 mt-2 rounded cursor-pointer"
                          />
                        </div>

                        {/* Color Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="text"
                              value={color.name || ''}
                              onChange={(e) => handleUpdateColor(index, { name: e.target.value })}
                              placeholder="Color name"
                              className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white"
                            />
                            <button
                              onClick={() => handleRemoveColor(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 dark:text-gray-400">HEX:</span>
                              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                                {color.hex}
                              </code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 dark:text-gray-400">RGB:</span>
                              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                              </code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 dark:text-gray-400">HSL:</span>
                              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                                {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                              </code>
                            </div>
                          </div>

                          {/* Usage Select */}
                          <select
                            value={color.usage}
                            onChange={(e) => handleUpdateColor(index, { usage: e.target.value as any })}
                            className="mt-2 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                          >
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="accent">Accent</option>
                            <option value="neutral">Neutral</option>
                            <option value="text">Text</option>
                            <option value="background">Background</option>
                          </select>

                          {/* Accessibility Info */}
                          {color.accessibility && (
                            <div className="mt-2 flex items-center gap-2">
                              {color.accessibility.wcagAA ? (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  WCAG AA
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Fails WCAG AA
                                </span>
                              )}
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Contrast: {color.accessibility.contrastRatio}:1
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {brandKit.colors.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No colors yet. Upload a logo or add colors manually.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Fonts Tab */}
          {activeTab === 'fonts' && (
            <motion.div
              key="fonts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Font Pairing Suggestions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get perfectly paired fonts based on your heading font choice
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetFontPairings}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Font Pairings
                </motion.button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Brand Fonts ({brandKit.fonts.length})
                </h3>

                <div className="space-y-3">
                  {brandKit.fonts.map((font, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4
                            className="text-xl font-semibold text-gray-900 dark:text-white"
                            style={{ fontFamily: font.family }}
                          >
                            {font.family}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {font.usage} • Weights: {font.weights.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {font.googleFont && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                              Google Font
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {brandKit.fonts.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Type className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No fonts yet. Click "Get Font Pairings" to add fonts.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Brand Assets ({brandKit.assets.length})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {brandKit.assets.map((asset) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
                    >
                      {asset.type === 'logo' || asset.type === 'icon' || asset.type === 'photo' ? (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-32 object-contain rounded-lg mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {asset.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {asset.type}
                      </p>
                      {asset.usageCount > 0 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Used {asset.usageCount} times
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {brandKit.assets.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No assets yet. Upload your logo to get started.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <motion.div
              key="guidelines"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Brand Guidelines
                </h3>

                <div className="space-y-4">
                  {/* Logo Spacing */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Logo Minimum Spacing (px)
                    </label>
                    <input
                      type="number"
                      value={brandKit.guidelines.logoSpacing.minimum}
                      onChange={(e) =>
                        setBrandKit(prev => ({
                          ...prev,
                          guidelines: {
                            ...prev.guidelines,
                            logoSpacing: {
                              ...prev.guidelines.logoSpacing,
                              minimum: parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Body Font Size */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Body Font Size (px)
                    </label>
                    <input
                      type="number"
                      value={brandKit.guidelines.typography.bodySize}
                      onChange={(e) =>
                        setBrandKit(prev => ({
                          ...prev,
                          guidelines: {
                            ...prev.guidelines,
                            typography: {
                              ...prev.guidelines.typography,
                              bodySize: parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Line Height */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Line Height
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={brandKit.guidelines.typography.lineHeight}
                      onChange={(e) =>
                        setBrandKit(prev => ({
                          ...prev,
                          guidelines: {
                            ...prev.guidelines,
                            typography: {
                              ...prev.guidelines.typography,
                              lineHeight: parseFloat(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
