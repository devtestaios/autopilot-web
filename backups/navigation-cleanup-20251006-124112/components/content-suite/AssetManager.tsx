'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File, 
  Folder,
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MoreVertical,
  Download,
  Trash2,
  Edit3,
  Copy,
  Star,
  Tag,
  Calendar,
  Eye,
  Share2,
  FolderPlus,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
export interface ContentAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'template' | 'brand-asset';
  url: string;
  thumbnail?: string;
  size: number; // in bytes
  dimensions?: { width: number; height: number };
  mimeType: string;
  createdAt: Date;
  modifiedAt: Date;
  tags: string[];
  folder?: string;
  isFavorite: boolean;
  brandCompliant?: boolean;
  description?: string;
}

export interface AssetFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
  assetCount: number;
  color?: string;
}

export interface AssetManagerProps {
  assets: ContentAsset[];
  folders: AssetFolder[];
  onAssetsChange: (assets: ContentAsset[]) => void;
  onFoldersChange: (folders: AssetFolder[]) => void;
  className?: string;
}

// File Upload Component
function FileUploadArea({ onFilesUploaded }: { onFilesUploaded: (files: File[]) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    onFilesUploaded(files);
  }, [onFilesUploaded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesUploaded(files);
  }, [onFilesUploaded]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${isDragOver 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
        }
      `}
    >
      <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
      <h3 className="text-lg font-medium mb-2">Upload your content</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Drag and drop files here, or click to browse
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Choose Files
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4" />
          Create Folder
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 mt-4">
        Supports: Images, Videos, Documents (Max 50MB each)
      </p>
    </div>
  );
}

// Asset Grid Item Component
function AssetGridItem({ asset, onSelect, onAction }: { 
  asset: ContentAsset; 
  onSelect: (asset: ContentAsset) => void;
  onAction: (action: string, asset: ContentAsset) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const getTypeIcon = () => {
    switch (asset.type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <File className="w-4 h-4" />;
      case 'template': return <Copy className="w-4 h-4" />;
      case 'brand-asset': return <Star className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(asset)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Asset Preview */}
      <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        {asset.type === 'image' || asset.thumbnail ? (
          <img 
            src={asset.thumbnail || asset.url} 
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getTypeIcon()}
          </div>
        )}
        
        {/* Overlay Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2"
            >
              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onAction('view', asset); }}>
                <Eye className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onAction('edit', asset); }}>
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onAction('download', asset); }}>
                <Download className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Asset Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{asset.name}</h4>
            <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {asset.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
            {asset.brandCompliant && <Badge variant="outline" className="text-xs py-0">Brand</Badge>}
          </div>
        </div>
        
        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {asset.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {asset.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{asset.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        {/* Type & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            {getTypeIcon()}
            <span className="capitalize">{asset.type}</span>
          </div>
          <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Asset List Item Component
function AssetListItem({ asset, onSelect, onAction }: { 
  asset: ContentAsset; 
  onSelect: (asset: ContentAsset) => void;
  onAction: (action: string, asset: ContentAsset) => void;
}) {
  const getTypeIcon = () => {
    switch (asset.type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <File className="w-4 h-4" />;
      case 'template': return <Copy className="w-4 h-4" />;
      case 'brand-asset': return <Star className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div 
      className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer group"
      onClick={() => onSelect(asset)}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
        {asset.type === 'image' || asset.thumbnail ? (
          <img 
            src={asset.thumbnail || asset.url} 
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          getTypeIcon()
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium truncate">{asset.name}</h4>
          {asset.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
          {asset.brandCompliant && <Badge variant="outline" className="text-xs">Brand</Badge>}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="capitalize">{asset.type}</span>
          <span>{formatFileSize(asset.size)}</span>
          <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1 max-w-xs">
        {asset.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      
      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onAction('view', asset); }}>
          <Eye className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onAction('edit', asset); }}>
          <Edit3 className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onAction('more', asset); }}>
          <MoreVertical className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Main Asset Manager Component
export default function AssetManager({ 
  assets, 
  folders, 
  onAssetsChange, 
  onFoldersChange,
  className = '' 
}: AssetManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<ContentAsset | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Mock file upload handler
  const handleFilesUploaded = useCallback((files: File[]) => {
    console.log('Files uploaded:', files);
    // In a real implementation, you would upload these files to your storage service
    // and then add them to the assets array
    
    const newAssets: ContentAsset[] = files.map((file, index) => ({
      id: `asset-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      url: URL.createObjectURL(file), // Temporary URL for demo
      size: file.size,
      mimeType: file.type,
      createdAt: new Date(),
      modifiedAt: new Date(),
      tags: [],
      isFavorite: false,
      description: ''
    }));
    
    onAssetsChange([...assets, ...newAssets]);
  }, [assets, onAssetsChange]);

  const handleAssetAction = useCallback((action: string, asset: ContentAsset) => {
    console.log(`Action: ${action} on asset:`, asset);
    // Handle asset actions (view, edit, download, etc.)
  }, []);

  // Filter assets based on search, tags, and folder
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => asset.tags.includes(tag));
    const matchesFolder = !selectedFolder || asset.folder === selectedFolder;
    const matchesType = filterType === 'all' || asset.type === filterType;
    
    return matchesSearch && matchesTags && matchesFolder && matchesType;
  });

  // Get all unique tags from assets
  const allTags = [...new Set(assets.flatMap(asset => asset.tags))];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Asset Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredAssets.length} of {assets.length} assets
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      {assets.length === 0 ? (
        <FileUploadArea onFilesUploaded={handleFilesUploaded} />
      ) : (
        <Card>
          <CardContent className="p-4">
            <FileUploadArea onFilesUploaded={handleFilesUploaded} />
          </CardContent>
        </Card>
      )}

      {assets.length > 0 && (
        <>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="template">Templates</option>
                <option value="brand-asset">Brand Assets</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 py-1">Filter by tags:</span>
              {allTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Assets Display */}
          {filteredAssets.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredAssets.map((asset) => (
                  <AssetGridItem
                    key={asset.id}
                    asset={asset}
                    onSelect={setSelectedAsset}
                    onAction={handleAssetAction}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredAssets.map((asset) => (
                  <AssetListItem
                    key={asset.id}
                    asset={asset}
                    onSelect={setSelectedAsset}
                    onAction={handleAssetAction}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}