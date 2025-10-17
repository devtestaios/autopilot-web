/**
 * Cloud Storage Integration
 * 
 * Supports multiple cloud storage providers:
 * - Cloudinary (primary)
 * - AWS S3 (alternative)
 * - Vercel Blob (fallback)
 */

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: string;
  format?: 'auto' | 'png' | 'jpg' | 'webp' | 'avif';
  quality?: 'auto' | number;
}

export interface UploadResult {
  success: boolean;
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

export interface CloudStorageProvider {
  name: string;
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  delete: (publicId: string) => Promise<boolean>;
  getUrl: (publicId: string, transformation?: string) => string;
}

// ====================================
// CLOUDINARY PROVIDER
// ====================================

class CloudinaryProvider implements CloudStorageProvider {
  name = 'Cloudinary';
  
  private cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  private uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
  private apiKey = process.env.CLOUDINARY_API_KEY || '';
  private apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary credentials not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      
      if (options?.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options?.publicId) {
        formData.append('public_id', options.publicId);
      }
      
      if (options?.tags) {
        formData.append('tags', options.tags.join(','));
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      return {
        success: false,
        url: '',
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async delete(publicId: string): Promise<boolean> {
    if (!this.apiKey || !this.apiSecret) {
      console.warn('Cloudinary API credentials not configured for deletion');
      return false;
    }

    try {
      // Note: Deletion requires server-side API call with signature
      // This should be implemented as a server-side API route
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId })
      });

      return response.ok;
    } catch (error) {
      console.error('Cloudinary delete failed:', error);
      return false;
    }
  }

  getUrl(publicId: string, transformation?: string): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    
    if (transformation) {
      return `${baseUrl}/${transformation}/${publicId}`;
    }
    
    return `${baseUrl}/${publicId}`;
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'limit';
      quality?: 'auto' | number;
      format?: 'auto' | 'png' | 'jpg' | 'webp' | 'avif';
    } = {}
  ): string {
    const transformations = [];

    if (options.width || options.height) {
      const crop = options.crop || 'fill';
      const size = [
        options.width ? `w_${options.width}` : '',
        options.height ? `h_${options.height}` : '',
        `c_${crop}`
      ].filter(Boolean).join(',');
      transformations.push(size);
    }

    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }

    if (options.format) {
      transformations.push(`f_${options.format}`);
    }

    return this.getUrl(publicId, transformations.join('/'));
  }
}

// ====================================
// AWS S3 PROVIDER (Alternative)
// ====================================

class S3Provider implements CloudStorageProvider {
  name = 'AWS S3';

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    try {
      // S3 upload should be handled via server-side API route
      const formData = new FormData();
      formData.append('file', file);
      
      if (options?.folder) {
        formData.append('folder', options.folder);
      }

      const response = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        url: data.url,
        publicId: data.key,
        bytes: file.size
      };
    } catch (error) {
      console.error('S3 upload failed:', error);
      return {
        success: false,
        url: '',
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/s3/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: publicId })
      });

      return response.ok;
    } catch (error) {
      console.error('S3 delete failed:', error);
      return false;
    }
  }

  getUrl(publicId: string): string {
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET || '';
    const region = process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${publicId}`;
  }
}

// ====================================
// PROVIDER FACTORY
// ====================================

function getStorageProvider(): CloudStorageProvider {
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'cloudinary';

  switch (provider.toLowerCase()) {
    case 's3':
      return new S3Provider();
    case 'cloudinary':
    default:
      return new CloudinaryProvider();
  }
}

// ====================================
// CONVENIENCE FUNCTIONS
// ====================================

const storageProvider = getStorageProvider();

/**
 * Upload a file to cloud storage
 */
export async function uploadAsset(file: File, options?: UploadOptions): Promise<UploadResult> {
  // Validate file
  if (!file) {
    return {
      success: false,
      url: '',
      error: 'No file provided'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      success: false,
      url: '',
      error: 'File size exceeds 10MB limit'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      url: '',
      error: 'Invalid file type. Only images are allowed.'
    };
  }

  return await storageProvider.upload(file, options);
}

/**
 * Delete an asset from cloud storage
 */
export async function deleteAsset(publicId: string): Promise<boolean> {
  return await storageProvider.delete(publicId);
}

/**
 * Get URL for an asset
 */
export function getAssetUrl(publicId: string, transformation?: string): string {
  return storageProvider.getUrl(publicId, transformation);
}

/**
 * Get optimized image URL (Cloudinary-specific)
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    quality?: 'auto' | number;
    format?: 'auto' | 'png' | 'jpg' | 'webp' | 'avif';
  } = {}
): string {
  if (storageProvider instanceof CloudinaryProvider) {
    return storageProvider.getOptimizedUrl(publicId, options);
  }
  
  return storageProvider.getUrl(publicId);
}

/**
 * Upload multiple files
 */
export async function uploadMultipleAssets(
  files: File[],
  options?: UploadOptions
): Promise<UploadResult[]> {
  const uploads = files.map(file => uploadAsset(file, options));
  return await Promise.all(uploads);
}

/**
 * Generate thumbnail URL (Cloudinary-specific)
 */
export function getThumbnailUrl(publicId: string, size: number = 200): string {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
}

/**
 * Generate responsive image URLs
 */
export function getResponsiveUrls(
  publicId: string,
  sizes: number[] = [320, 640, 1024, 1920]
): Record<number, string> {
  const urls: Record<number, string> = {};
  
  sizes.forEach(size => {
    urls[size] = getOptimizedImageUrl(publicId, {
      width: size,
      quality: 'auto',
      format: 'auto'
    });
  });
  
  return urls;
}

export default {
  uploadAsset,
  deleteAsset,
  getAssetUrl,
  getOptimizedImageUrl,
  uploadMultipleAssets,
  getThumbnailUrl,
  getResponsiveUrls
};
