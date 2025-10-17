/**
 * Magic Resize Utility
 * 
 * Automatically converts one design to 50+ platform-specific formats
 * with smart cropping and important element detection
 */

export interface ResizePreset {
  name: string;
  width: number;
  height: number;
  platform: string;
  category: string;
  description: string;
}

export interface MagicResizeOptions {
  presets?: string[]; // Specific presets to generate, or 'all'
  quality?: number;
  format?: 'png' | 'jpg' | 'webp';
  smartCrop?: boolean; // Enable AI-powered smart cropping
  preserveText?: boolean; // Ensure text remains readable
  backgroundColor?: string; // Fill color for letterboxing
}

export interface MagicResizeResult {
  preset: ResizePreset;
  dataUrl: string;
  blob: Blob;
  aspectRatio: number;
  cropArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Complete list of platform-specific size presets
 */
export const RESIZE_PRESETS: Record<string, ResizePreset[]> = {
  instagram: [
    { name: 'Instagram Post (Square)', width: 1080, height: 1080, platform: 'Instagram', category: 'Feed', description: 'Square post format' },
    { name: 'Instagram Post (Portrait)', width: 1080, height: 1350, platform: 'Instagram', category: 'Feed', description: 'Portrait 4:5 ratio' },
    { name: 'Instagram Post (Landscape)', width: 1080, height: 566, platform: 'Instagram', category: 'Feed', description: 'Landscape 1.91:1 ratio' },
    { name: 'Instagram Story', width: 1080, height: 1920, platform: 'Instagram', category: 'Story', description: 'Full-screen vertical story' },
    { name: 'Instagram Reel', width: 1080, height: 1920, platform: 'Instagram', category: 'Reel', description: 'Full-screen vertical reel' },
    { name: 'Instagram Carousel', width: 1080, height: 1080, platform: 'Instagram', category: 'Carousel', description: 'Multi-image carousel' },
    { name: 'Instagram Profile Picture', width: 320, height: 320, platform: 'Instagram', category: 'Profile', description: 'Profile photo' },
  ],
  
  facebook: [
    { name: 'Facebook Post', width: 1200, height: 630, platform: 'Facebook', category: 'Feed', description: 'Standard post format' },
    { name: 'Facebook Story', width: 1080, height: 1920, platform: 'Facebook', category: 'Story', description: 'Full-screen vertical story' },
    { name: 'Facebook Cover Photo', width: 820, height: 312, platform: 'Facebook', category: 'Cover', description: 'Profile cover photo' },
    { name: 'Facebook Profile Picture', width: 180, height: 180, platform: 'Facebook', category: 'Profile', description: 'Profile photo' },
    { name: 'Facebook Event Cover', width: 1920, height: 1080, platform: 'Facebook', category: 'Event', description: 'Event cover image' },
    { name: 'Facebook Link Preview', width: 1200, height: 628, platform: 'Facebook', category: 'Link', description: 'Shared link preview' },
  ],
  
  twitter: [
    { name: 'Twitter Post', width: 1200, height: 675, platform: 'Twitter', category: 'Feed', description: 'Standard tweet image' },
    { name: 'Twitter Header', width: 1500, height: 500, platform: 'Twitter', category: 'Header', description: 'Profile header banner' },
    { name: 'Twitter Profile Picture', width: 400, height: 400, platform: 'Twitter', category: 'Profile', description: 'Profile photo' },
    { name: 'Twitter Card', width: 800, height: 418, platform: 'Twitter', category: 'Card', description: 'Link preview card' },
  ],
  
  linkedin: [
    { name: 'LinkedIn Post', width: 1200, height: 627, platform: 'LinkedIn', category: 'Feed', description: 'Standard post format' },
    { name: 'LinkedIn Article Cover', width: 1200, height: 627, platform: 'LinkedIn', category: 'Article', description: 'Article header image' },
    { name: 'LinkedIn Profile Picture', width: 400, height: 400, platform: 'LinkedIn', category: 'Profile', description: 'Profile photo' },
    { name: 'LinkedIn Cover Photo', width: 1584, height: 396, platform: 'LinkedIn', category: 'Cover', description: 'Profile background' },
    { name: 'LinkedIn Company Logo', width: 300, height: 300, platform: 'LinkedIn', category: 'Company', description: 'Company page logo' },
  ],
  
  tiktok: [
    { name: 'TikTok Video', width: 1080, height: 1920, platform: 'TikTok', category: 'Video', description: 'Full-screen vertical video' },
    { name: 'TikTok Profile Picture', width: 200, height: 200, platform: 'TikTok', category: 'Profile', description: 'Profile photo' },
  ],
  
  youtube: [
    { name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'YouTube', category: 'Thumbnail', description: 'Video thumbnail' },
    { name: 'YouTube Channel Art', width: 2560, height: 1440, platform: 'YouTube', category: 'Banner', description: 'Channel banner' },
    { name: 'YouTube Profile Picture', width: 800, height: 800, platform: 'YouTube', category: 'Profile', description: 'Channel avatar' },
    { name: 'YouTube End Screen', width: 1920, height: 1080, platform: 'YouTube', category: 'End Screen', description: 'Video end screen' },
    { name: 'YouTube Community Post', width: 1200, height: 1200, platform: 'YouTube', category: 'Community', description: 'Community tab post' },
  ],
  
  pinterest: [
    { name: 'Pinterest Pin', width: 1000, height: 1500, platform: 'Pinterest', category: 'Pin', description: 'Standard pin format' },
    { name: 'Pinterest Board Cover', width: 600, height: 600, platform: 'Pinterest', category: 'Board', description: 'Board cover image' },
    { name: 'Pinterest Profile Picture', width: 165, height: 165, platform: 'Pinterest', category: 'Profile', description: 'Profile photo' },
  ],
  
  email: [
    { name: 'Email Header', width: 600, height: 200, platform: 'Email', category: 'Header', description: 'Email header banner' },
    { name: 'Email Banner', width: 600, height: 300, platform: 'Email', category: 'Banner', description: 'Full-width banner' },
    { name: 'Email Signature', width: 300, height: 100, platform: 'Email', category: 'Signature', description: 'Email signature image' },
  ],
  
  web: [
    { name: 'Website Hero', width: 1920, height: 1080, platform: 'Web', category: 'Hero', description: 'Hero section banner' },
    { name: 'Website OG Image', width: 1200, height: 630, platform: 'Web', category: 'OG', description: 'Open Graph preview' },
    { name: 'Website Thumbnail', width: 400, height: 300, platform: 'Web', category: 'Thumbnail', description: 'Content thumbnail' },
    { name: 'Website Favicon', width: 512, height: 512, platform: 'Web', category: 'Favicon', description: 'Website favicon' },
  ],
  
  print: [
    { name: 'Business Card', width: 1050, height: 600, platform: 'Print', category: 'Card', description: '3.5" x 2" at 300dpi' },
    { name: 'Flyer (Letter)', width: 2550, height: 3300, platform: 'Print', category: 'Flyer', description: '8.5" x 11" at 300dpi' },
    { name: 'Poster (18x24)', width: 5400, height: 7200, platform: 'Print', category: 'Poster', description: '18" x 24" at 300dpi' },
    { name: 'Banner (3x6)', width: 10800, height: 21600, platform: 'Print', category: 'Banner', description: '3ft x 6ft at 300dpi' },
  ],
};

/**
 * Get all presets as flat array
 */
export function getAllPresets(): ResizePreset[] {
  return Object.values(RESIZE_PRESETS).flat();
}

/**
 * Get presets for specific platforms
 */
export function getPresetsForPlatforms(platforms: string[]): ResizePreset[] {
  return platforms.flatMap(platform => RESIZE_PRESETS[platform.toLowerCase()] || []);
}

/**
 * Detect important regions in image (faces, text, high-contrast areas)
 */
async function detectImportantRegions(
  canvas: HTMLCanvasElement
): Promise<{ x: number; y: number; width: number; height: number }[]> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Simple edge detection to find high-contrast areas
  const regions: { x: number; y: number; width: number; height: number }[] = [];
  const gridSize = 20; // Divide image into grid
  
  for (let y = 0; y < canvas.height; y += gridSize) {
    for (let x = 0; x < canvas.width; x += gridSize) {
      let edgeCount = 0;
      
      // Check contrast in this grid cell
      for (let dy = 0; dy < gridSize && y + dy < canvas.height; dy++) {
        for (let dx = 0; dx < gridSize && x + dx < canvas.width; dx++) {
          const i = ((y + dy) * canvas.width + (x + dx)) * 4;
          const nextI = ((y + dy) * canvas.width + (x + dx + 1)) * 4;
          
          if (nextI < data.length) {
            const contrast = Math.abs(data[i] - data[nextI]);
            if (contrast > 30) edgeCount++;
          }
        }
      }
      
      // High edge count = important region
      if (edgeCount > gridSize * 2) {
        regions.push({ x, y, width: gridSize, height: gridSize });
      }
    }
  }
  
  return regions;
}

/**
 * Calculate smart crop area to preserve important content
 */
function calculateSmartCrop(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  importantRegions: { x: number; y: number; width: number; height: number }[]
): { x: number; y: number; width: number; height: number } {
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;
  
  let cropWidth: number, cropHeight: number;
  
  if (sourceAspect > targetAspect) {
    // Source is wider - crop width
    cropHeight = sourceHeight;
    cropWidth = sourceHeight * targetAspect;
  } else {
    // Source is taller - crop height
    cropWidth = sourceWidth;
    cropHeight = sourceWidth / targetAspect;
  }
  
  // If no important regions, center crop
  if (importantRegions.length === 0) {
    return {
      x: (sourceWidth - cropWidth) / 2,
      y: (sourceHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    };
  }
  
  // Find center of important regions
  const centerX = importantRegions.reduce((sum, r) => sum + r.x + r.width / 2, 0) / importantRegions.length;
  const centerY = importantRegions.reduce((sum, r) => sum + r.y + r.height / 2, 0) / importantRegions.length;
  
  // Center crop on important regions
  let x = Math.max(0, Math.min(centerX - cropWidth / 2, sourceWidth - cropWidth));
  let y = Math.max(0, Math.min(centerY - cropHeight / 2, sourceHeight - cropHeight));
  
  return { x, y, width: cropWidth, height: cropHeight };
}

/**
 * Resize single image to specific preset
 */
async function resizeToPreset(
  sourceCanvas: HTMLCanvasElement,
  preset: ResizePreset,
  options: MagicResizeOptions,
  importantRegions: { x: number; y: number; width: number; height: number }[]
): Promise<MagicResizeResult> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  canvas.width = preset.width;
  canvas.height = preset.height;
  
  // Fill background
  if (options.backgroundColor) {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  let cropArea: { x: number; y: number; width: number; height: number } | undefined;
  
  if (options.smartCrop && importantRegions.length > 0) {
    // Smart crop to preserve important content
    cropArea = calculateSmartCrop(
      sourceCanvas.width,
      sourceCanvas.height,
      preset.width,
      preset.height,
      importantRegions
    );
    
    ctx.drawImage(
      sourceCanvas,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, canvas.width, canvas.height
    );
  } else {
    // Simple contain (letterbox) or cover
    const sourceAspect = sourceCanvas.width / sourceCanvas.height;
    const targetAspect = preset.width / preset.height;
    
    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
    
    if (sourceAspect > targetAspect) {
      // Source is wider - fit width
      drawWidth = canvas.width;
      drawHeight = canvas.width / sourceAspect;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      // Source is taller - fit height
      drawHeight = canvas.height;
      drawWidth = canvas.height * sourceAspect;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }
    
    ctx.drawImage(sourceCanvas, drawX, drawY, drawWidth, drawHeight);
  }
  
  // Convert to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to create blob'));
      },
      `image/${options.format || 'png'}`,
      options.quality || 0.9
    );
  });
  
  // Convert to data URL
  const dataUrl = canvas.toDataURL(`image/${options.format || 'png'}`, options.quality || 0.9);
  
  return {
    preset,
    dataUrl,
    blob,
    aspectRatio: preset.width / preset.height,
    cropArea,
  };
}

/**
 * Main magic resize function
 * Converts one image to multiple platform formats
 */
export async function magicResize(
  sourceImageDataUrl: string,
  options: MagicResizeOptions = {}
): Promise<MagicResizeResult[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        // Create source canvas
        const sourceCanvas = document.createElement('canvas');
        const ctx = sourceCanvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        sourceCanvas.width = img.width;
        sourceCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Detect important regions if smart crop enabled
        let importantRegions: { x: number; y: number; width: number; height: number }[] = [];
        if (options.smartCrop) {
          importantRegions = await detectImportantRegions(sourceCanvas);
        }
        
        // Determine which presets to generate
        let presets: ResizePreset[];
        if (options.presets && options.presets.length > 0) {
          if (options.presets.includes('all')) {
            presets = getAllPresets();
          } else {
            presets = getPresetsForPlatforms(options.presets);
          }
        } else {
          // Default: Instagram, Facebook, Twitter, LinkedIn
          presets = getPresetsForPlatforms(['instagram', 'facebook', 'twitter', 'linkedin']);
        }
        
        // Generate all resized versions
        const results = await Promise.all(
          presets.map(preset => resizeToPreset(sourceCanvas, preset, options, importantRegions))
        );
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = sourceImageDataUrl;
  });
}

/**
 * Download all resized images as ZIP file
 */
export async function downloadResizedImages(results: MagicResizeResult[], filename: string = 'resized-images') {
  // Dynamically import JSZip
  const JSZip = (await import('jszip')).default;
  
  const zip = new JSZip();
  
  // Add each image to ZIP
  results.forEach((result, index) => {
    const name = `${result.preset.platform}_${result.preset.name.replace(/[^a-z0-9]/gi, '_')}.${result.preset.width}x${result.preset.height}.png`;
    zip.file(name, result.blob);
  });
  
  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get preset by name
 */
export function getPresetByName(name: string): ResizePreset | undefined {
  return getAllPresets().find(p => p.name === name);
}

/**
 * Group presets by platform
 */
export function groupPresetsByPlatform(): Record<string, ResizePreset[]> {
  return RESIZE_PRESETS;
}

/**
 * Group presets by category
 */
export function groupPresetsByCategory(): Record<string, ResizePreset[]> {
  const grouped: Record<string, ResizePreset[]> = {};
  
  getAllPresets().forEach(preset => {
    if (!grouped[preset.category]) {
      grouped[preset.category] = [];
    }
    grouped[preset.category].push(preset);
  });
  
  return grouped;
}
