'use client';

import React, { useState, useEffect } from 'react';
import { DraggableDashboard, LAYOUT_PRESETS } from '@/components/DraggableDashboard';
import { DashboardCustomizationProvider, useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import NavigationTabs from '@/components/NavigationTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Save, Download, Upload, Settings, 
  Smartphone, Tablet, Monitor, Grid3X3, List, 
  Plus, Trash2, Copy, RefreshCw, Star,
  ChevronDown, ChevronUp, Eye, EyeOff
} from 'lucide-react';

// Layout Management Component
function LayoutManager() {
  const {
    currentLayout,
    savedLayouts,
    setCurrentLayout,
    saveLayout,
    loadLayout,
    deleteLayout,
    resetToPreset,
    exportLayout,
    importLayout,
    isCustomizationEnabled,
    setCustomizationEnabled,
    autoSave,
    setAutoSave
  } = useDashboardCustomization();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [importData, setImportData] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSaveLayout = () => {
    if (newLayoutName.trim()) {
      saveLayout(currentLayout, newLayoutName.trim());
      setNewLayoutName('');
      setShowSaveDialog(false);
    }
  };

  const handleImportLayout = () => {
    if (importLayout(importData)) {
      setImportData('');
      setShowImportDialog(false);
    }
  };

  const handleExportLayout = () => {
    const data = exportLayout();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-layout-${currentLayout.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard Layout Manager
          </h2>
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Settings className="w-4 h-4" />
          Advanced
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Layout Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {LAYOUT_PRESETS?.map(preset => (
          <button
            key={preset.id}
            onClick={() => {
              resetToPreset(preset.id);
              setCurrentLayout(preset);
            }}
            className={`p-3 border-2 rounded-lg text-left transition-all ${
              currentLayout?.id === preset.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Grid3X3 className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                {preset.name}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {preset.description}
            </p>
          </button>
        )) || []}
      </div>

      {/* Customization Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCustomizationEnabled}
              onChange={(e) => setCustomizationEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Enable Customization Mode
            </span>
          </label>
          {isCustomizationEnabled && <Eye className="w-4 h-4 text-green-500" />}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            Auto-save
          </label>
        </div>
      </div>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Layout Actions */}
            <div className="flex flex-wrap items-center gap-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white w-full mb-2">
                Layout Actions
              </h3>
              
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save Current
              </button>
              
              <button
                onClick={handleExportLayout}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <button
                onClick={() => setShowImportDialog(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>

            {/* Saved Layouts */}
            {savedLayouts?.length > 0 && (
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Saved Layouts ({savedLayouts.length})
                </h3>
                
                <div className="space-y-2">
                  {savedLayouts.map(layout => (
                    <div
                      key={layout.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {layout.name}
                          </span>
                          {layout.isDefault && <Star className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {layout.widgets?.length || 0} widgets • Modified {layout.lastModified?.toLocaleDateString?.() || 'Unknown'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => loadLayout(layout.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLayout(layout.id)}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Save Layout
            </h3>
            <input
              type="text"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="Enter layout name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveLayout}
                disabled={!newLayoutName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setNewLayoutName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Layout
            </h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste layout JSON data here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleImportLayout}
                disabled={!importData.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportData('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Enhanced Dashboard Page
function EnhancedDashboardContent() {
  const { currentLayout, setCurrentLayout, isCustomizationEnabled } = useDashboardCustomization();
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleLayoutChange = (newLayout: any) => {
    setCurrentLayout(newLayout);
  };

  // Ensure we have a valid layout
  if (!currentLayout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Enhanced Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Drag and drop widgets to customize your dashboard layout
              </p>
            </div>

            {/* Device Preview Toggle */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setDevicePreview('desktop')}
                className={`p-2 rounded ${
                  devicePreview === 'desktop'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview('tablet')}
                className={`p-2 rounded ${
                  devicePreview === 'tablet'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview('mobile')}
                className={`p-2 rounded ${
                  devicePreview === 'mobile'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Layout Manager */}
          <LayoutManager />
        </div>

        {/* Dashboard with Device Preview */}
        <div className={`
          transition-all duration-300 mx-auto
          ${devicePreview === 'mobile' ? 'max-w-sm' : 
            devicePreview === 'tablet' ? 'max-w-4xl' : 
            'max-w-none'}
        `}>
          <div className={`
            ${devicePreview === 'mobile' ? 'border-8 border-gray-300 dark:border-gray-600 rounded-[2rem] p-2' :
              devicePreview === 'tablet' ? 'border-4 border-gray-300 dark:border-gray-600 rounded-lg p-4' :
              ''}
          `}>
            <DraggableDashboard
              initialLayout={currentLayout}
              onLayoutChange={handleLayoutChange}
              className={devicePreview === 'mobile' ? 'text-sm' : ''}
            />
          </div>
        </div>

        {/* Usage Tips */}
        {isCustomizationEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Customization Tips
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Drag widgets by their drag handle (⋮⋮) to rearrange them
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Use the edit button to configure widget settings
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Save your layout to preserve your customizations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Switch between device previews to see responsive behavior
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Main Page Component with Provider
export default function EnhancedDashboardPage() {
  return (
    <DashboardCustomizationProvider>
      <EnhancedDashboardContent />
    </DashboardCustomizationProvider>
  );
}