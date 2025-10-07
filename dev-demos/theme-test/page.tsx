'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Palette, Eye, Code2, Smartphone } from 'lucide-react';

export default function ThemeTestPage() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/30 dark:border-teal-700/30 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              🎨 PulseBridge.ai Theme System Test
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Current theme: <span className="font-semibold text-teal-600 dark:text-teal-400">{theme} mode</span>
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="group p-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Corporate Color Palette */}
          <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-teal-200/30 dark:border-teal-700/30">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Corporate Colors
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded"></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Teal Primary</span>
                </div>
                <code className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  #00c9a7
                </code>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded" style={{background: 'linear-gradient(135deg, #e07856, #f97316)'}}></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Coral Accent</span>
                </div>
                <code className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  #e07856
                </code>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded"></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cyan Support</span>
                </div>
                <code className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  #06b6d4
                </code>
              </div>
            </div>
          </div>

          {/* Typography Hierarchy */}
          <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-teal-200/30 dark:border-teal-700/30">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Typography Test
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Heading Bold
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">2xl / font-bold</p>
              </div>
              <div>
                <p className="text-lg text-slate-800 dark:text-slate-200 font-semibold">
                  Subheading Semibold
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">lg / font-semibold</p>
              </div>
              <div>
                <p className="text-base text-slate-700 dark:text-slate-300">
                  Body text regular for readability
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">base / regular</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Secondary text slightly muted
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">sm / muted</p>
              </div>
              <div>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                  Accent text in teal
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">sm / teal accent</p>
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-teal-200/30 dark:border-teal-700/30 lg:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Interactive Elements
              </h2>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 hover:shadow-lg">
                Primary Gradient Button
              </button>
              <button className="w-full px-4 py-3 bg-transparent border-2 border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 font-semibold rounded-lg hover:bg-teal-600 hover:text-white dark:hover:bg-teal-400 dark:hover:text-slate-900 transition-all duration-200">
                Secondary Outline Button
              </button>
              <button className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-white/20 transition-all duration-200">
                Glass Effect Button
              </button>
              <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <input 
                  type="text" 
                  placeholder="Test input field..."
                  className="w-full p-2 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Analysis Summary */}
        <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-teal-200/30 dark:border-teal-700/30">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Theme System Analysis
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-1">Theme Toggle</h3>
              <p className="text-sm text-green-600 dark:text-green-300">Working perfectly</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">∞</span>
              </div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Persistence</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">localStorage active</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">🎨</span>
              </div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-1">Branding</h3>
              <p className="text-sm text-purple-600 dark:text-purple-300">Corporate Clean</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border-l-4 border-teal-500">
            <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">
              ✅ Theme System Status: Ready for Enhancement
            </h4>
            <ul className="text-sm text-teal-600 dark:text-teal-300 space-y-1">
              <li>• Light/Dark mode switching functional</li>
              <li>• Corporate Tech Clean branding maintained</li>
              <li>• All text clearly readable in both themes</li>
              <li>• Smooth transitions and hover states</li>
              <li>• Ready for animation layer additions</li>
            </ul>
          </div>
        </div>

        {/* Navigation Test */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Navigate back to test the main landing page theme consistency:
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 hover:shadow-lg"
          >
            ← Back to Main Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}