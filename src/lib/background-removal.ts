/**
 * AI Background Removal Utility
 * 
 * Provides multiple methods for removing backgrounds from images:
 * 1. remove.bg API (paid, high quality)
 * 2. Client-side AI (free, good quality)
 * 3. Canvas-based fallback (basic quality)
 */

export interface BackgroundRemovalOptions {
  method?: 'removebg' | 'client' | 'canvas';
  format?: 'png' | 'jpg';
  size?: 'auto' | 'preview' | 'full' | 'medium';
  quality?: number;
}

export interface BackgroundRemovalResult {
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  error?: string;
  method: string;
  processingTime: number;
}

/**
 * Remove background using remove.bg API
 */
async function removeBackgroundWithAPI(
  imageDataUrl: string,
  options: BackgroundRemovalOptions
): Promise<BackgroundRemovalResult> {
  const startTime = performance.now();
  
  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    
    // Create form data
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', options.size || 'auto');
    
    // Call remove.bg API
    const apiKey = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY;
    
    if (!apiKey) {
      throw new Error('remove.bg API key not configured');
    }
    
    const apiResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });
    
    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.statusText}`);
    }
    
    const resultBlob = await apiResponse.blob();
    const dataUrl = await blobToDataUrl(resultBlob);
    
    return {
      success: true,
      dataUrl,
      blob: resultBlob,
      method: 'removebg',
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      method: 'removebg',
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Remove background using client-side AI
 * Uses a lightweight ML model that runs in the browser
 */
async function removeBackgroundClientSide(
  imageDataUrl: string,
  options: BackgroundRemovalOptions
): Promise<BackgroundRemovalResult> {
  const startTime = performance.now();
  
  try {
    // Dynamically import the background removal library
    const { removeBackground } = await import('@imgly/background-removal');
    
    const blob = await removeBackground(imageDataUrl, {
      publicPath: '/background-removal/',
      output: {
        format: options.format || 'png',
        quality: options.quality || 0.8,
      },
    });
    
    const dataUrl = await blobToDataUrl(blob);
    
    return {
      success: true,
      dataUrl,
      blob,
      method: 'client',
      processingTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      method: 'client',
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Canvas-based background removal (fallback method)
 * Uses color similarity to remove background
 */
async function removeBackgroundCanvas(
  imageDataUrl: string,
  options: BackgroundRemovalOptions
): Promise<BackgroundRemovalResult> {
  const startTime = performance.now();
  
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve({
            success: false,
            error: 'Canvas context not available',
            method: 'canvas',
            processingTime: performance.now() - startTime,
          });
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample corner pixels to determine background color
        const cornerColors = [
          { r: data[0], g: data[1], b: data[2] },
          { r: data[(canvas.width - 1) * 4], g: data[(canvas.width - 1) * 4 + 1], b: data[(canvas.width - 1) * 4 + 2] },
          { r: data[(canvas.height - 1) * canvas.width * 4], g: data[(canvas.height - 1) * canvas.width * 4 + 1], b: data[(canvas.height - 1) * canvas.width * 4 + 2] },
          { r: data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4], g: data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 1], b: data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 2] },
        ];
        
        // Average corner colors
        const bgColor = {
          r: Math.round(cornerColors.reduce((sum, c) => sum + c.r, 0) / 4),
          g: Math.round(cornerColors.reduce((sum, c) => sum + c.g, 0) / 4),
          b: Math.round(cornerColors.reduce((sum, c) => sum + c.b, 0) / 4),
        };
        
        // Remove similar colors (with tolerance)
        const tolerance = 30;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const distance = Math.sqrt(
            Math.pow(r - bgColor.r, 2) +
            Math.pow(g - bgColor.g, 2) +
            Math.pow(b - bgColor.b, 2)
          );
          
          if (distance < tolerance) {
            data[i + 3] = 0; // Make transparent
          }
        }
        
        // Put modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve({
              success: false,
              error: 'Failed to create blob',
              method: 'canvas',
              processingTime: performance.now() - startTime,
            });
            return;
          }
          
          const dataUrl = canvas.toDataURL('image/png');
          resolve({
            success: true,
            dataUrl,
            blob,
            method: 'canvas',
            processingTime: performance.now() - startTime,
          });
        }, 'image/png');
      };
      
      img.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to load image',
          method: 'canvas',
          processingTime: performance.now() - startTime,
        });
      };
      
      img.src = imageDataUrl;
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      method: 'canvas',
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Main function to remove background from image
 * Automatically falls back to alternative methods if primary fails
 */
export async function removeBackground(
  imageDataUrl: string,
  options: BackgroundRemovalOptions = {}
): Promise<BackgroundRemovalResult> {
  const method = options.method || 'client';
  
  // Try primary method
  let result: BackgroundRemovalResult;
  
  switch (method) {
    case 'removebg':
      result = await removeBackgroundWithAPI(imageDataUrl, options);
      break;
    case 'client':
      result = await removeBackgroundClientSide(imageDataUrl, options);
      break;
    case 'canvas':
      result = await removeBackgroundCanvas(imageDataUrl, options);
      break;
    default:
      result = await removeBackgroundClientSide(imageDataUrl, options);
  }
  
  // If primary method failed, try fallback
  if (!result.success && method !== 'canvas') {
    console.warn(`Background removal with ${method} failed, falling back to canvas method`);
    result = await removeBackgroundCanvas(imageDataUrl, options);
  }
  
  return result;
}

/**
 * Helper function to convert Blob to data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Check if background removal is available
 */
export function isBackgroundRemovalAvailable(): {
  removebg: boolean;
  client: boolean;
  canvas: boolean;
} {
  return {
    removebg: !!process.env.NEXT_PUBLIC_REMOVEBG_API_KEY,
    client: typeof window !== 'undefined',
    canvas: typeof window !== 'undefined' && !!document.createElement('canvas').getContext,
  };
}

/**
 * Get recommended background removal method
 */
export function getRecommendedMethod(): 'removebg' | 'client' | 'canvas' {
  const available = isBackgroundRemovalAvailable();
  
  if (available.removebg) return 'removebg';
  if (available.client) return 'client';
  return 'canvas';
}
