/**
 * Brand Kit Management System
 * 
 * Features:
 * - Color palette extraction from logos
 * - Font pairing suggestions
 * - Brand guideline enforcement
 * - Asset usage tracking
 * - Brand consistency scoring
 * 
 * @author PulseBridge.ai
 * @date October 2025
 */

export interface BrandColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral' | 'text' | 'background';
  accessibility?: {
    wcagAA: boolean;
    wcagAAA: boolean;
    contrastRatio: number;
  };
}

export interface BrandFont {
  family: string;
  weights: number[];
  fallback: string;
  usage: 'heading' | 'body' | 'accent' | 'monospace';
  googleFont?: boolean;
  customFont?: boolean;
  url?: string;
}

export interface BrandAsset {
  id: string;
  type: 'logo' | 'icon' | 'pattern' | 'illustration' | 'photo' | 'video';
  url: string;
  name: string;
  tags: string[];
  dimensions?: { width: number; height: number };
  fileSize?: number;
  format?: string;
  usageCount: number;
  lastUsed?: Date;
  guidelines?: string; // Usage guidelines
}

export interface BrandGuidelines {
  logoSpacing: {
    minimum: number; // in pixels
    recommended: number;
  };
  colorUsage: {
    [key: string]: string; // Color hex -> Usage description
  };
  typography: {
    headingSizes: number[];
    bodySize: number;
    lineHeight: number;
    letterSpacing?: number;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  doAndDonts: {
    do: string[];
    dont: string[];
  };
}

export interface BrandKit {
  id: string;
  name: string;
  description?: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  assets: BrandAsset[];
  guidelines: BrandGuidelines;
  createdAt: Date;
  updatedAt: Date;
  consistency_score?: number; // 0-100
}

/**
 * Extract dominant colors from an image using canvas color analysis
 */
export async function extractColorsFromImage(
  imageUrl: string,
  numColors: number = 5
): Promise<BrandColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Scale down for performance
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Color quantization using median cut algorithm
      const colors = quantizeColors(pixels, numColors);
      
      resolve(colors);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Quantize colors using k-means clustering
 */
function quantizeColors(pixels: Uint8ClampedArray, k: number): BrandColor[] {
  const colorMap = new Map<string, number>();
  
  // Sample pixels (every 4th pixel for performance)
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent and very light/dark pixels
    if (a < 128 || (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) {
      continue;
    }
    
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  // Sort by frequency
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k * 3); // Get top colors for clustering
  
  // Simple k-means clustering
  const clusters = kMeansClustering(
    sortedColors.map(([rgb]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return { r, g, b };
    }),
    k
  );
  
  // Convert to BrandColor format
  return clusters.map((cluster, index) => {
    const rgb = cluster;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Determine usage based on lightness and saturation
    let usage: BrandColor['usage'] = 'secondary';
    if (index === 0) usage = 'primary';
    else if (hsl.l > 80) usage = 'background';
    else if (hsl.l < 20) usage = 'text';
    else if (hsl.s > 60) usage = 'accent';
    else usage = 'neutral';
    
    return {
      hex,
      rgb,
      hsl,
      name: generateColorName(hex),
      usage,
      accessibility: calculateAccessibility(hex),
    };
  });
}

/**
 * K-means clustering for color quantization
 */
function kMeansClustering(
  colors: Array<{ r: number; g: number; b: number }>,
  k: number,
  maxIterations: number = 10
): Array<{ r: number; g: number; b: number }> {
  // Initialize centroids randomly
  let centroids = colors.slice(0, k);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign colors to nearest centroid
    const clusters: Array<Array<{ r: number; g: number; b: number }>> = Array(k).fill(null).map(() => []);
    
    colors.forEach(color => {
      let minDist = Infinity;
      let clusterIndex = 0;
      
      centroids.forEach((centroid, i) => {
        const dist = colorDistance(color, centroid);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });
      
      clusters[clusterIndex].push(color);
    });
    
    // Update centroids
    const newCentroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0];
      
      const sum = cluster.reduce(
        (acc, color) => ({
          r: acc.r + color.r,
          g: acc.g + color.g,
          b: acc.b + color.b,
        }),
        { r: 0, g: 0, b: 0 }
      );
      
      return {
        r: Math.round(sum.r / cluster.length),
        g: Math.round(sum.g / cluster.length),
        b: Math.round(sum.b / cluster.length),
      };
    });
    
    // Check convergence
    const converged = centroids.every((centroid, i) => 
      colorDistance(centroid, newCentroids[i]) < 5
    );
    
    centroids = newCentroids;
    
    if (converged) break;
  }
  
  return centroids;
}

/**
 * Calculate Euclidean distance between two colors
 */
function colorDistance(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Generate human-readable color name
 */
function generateColorName(hex: string): string {
  const colorNames: { [key: string]: string } = {
    '#FF0000': 'Red',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#FFC0CB': 'Pink',
    '#A52A2A': 'Brown',
  };
  
  // Find closest color name
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  let closestName = hex;
  let minDistance = Infinity;
  
  Object.entries(colorNames).forEach(([namedHex, name]) => {
    const namedRgb = hexToRgb(namedHex);
    if (!namedRgb) return;
    
    const distance = colorDistance(rgb, namedRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  });
  
  return closestName;
}

/**
 * Convert HEX to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Calculate WCAG contrast ratio and accessibility
 */
function calculateAccessibility(hex: string): BrandColor['accessibility'] {
  const rgb = hexToRgb(hex);
  if (!rgb) return { wcagAA: false, wcagAAA: false, contrastRatio: 0 };
  
  // Calculate relative luminance
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  
  // Compare with white background
  const whiteLuminance = 1;
  const contrastRatio = (whiteLuminance + 0.05) / (luminance + 0.05);
  
  return {
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    wcagAA: contrastRatio >= 4.5,
    wcagAAA: contrastRatio >= 7,
  };
}

/**
 * Suggest font pairings based on selected heading font
 */
export function suggestFontPairings(headingFont: string): BrandFont[] {
  const pairings: { [key: string]: string[] } = {
    'Montserrat': ['Open Sans', 'Lato', 'Roboto'],
    'Playfair Display': ['Lato', 'Source Sans Pro', 'Montserrat'],
    'Raleway': ['Open Sans', 'Lora', 'Merriweather'],
    'Oswald': ['Lato', 'PT Sans', 'Open Sans'],
    'Roboto': ['Roboto Slab', 'Open Sans', 'Lato'],
    'Poppins': ['Inter', 'Lato', 'Open Sans'],
    'Inter': ['Merriweather', 'Lora', 'PT Serif'],
  };
  
  const suggestions = pairings[headingFont] || ['Open Sans', 'Lato', 'Roboto'];
  
  return suggestions.map(fontFamily => ({
    family: fontFamily,
    weights: [400, 600, 700],
    fallback: 'sans-serif',
    usage: 'body',
    googleFont: true,
  }));
}

/**
 * Calculate brand consistency score based on design elements
 */
export function calculateBrandConsistency(
  designs: Array<{
    colors: string[];
    fonts: string[];
    spacing: number[];
  }>,
  brandKit: BrandKit
): number {
  if (designs.length === 0) return 100;
  
  let totalScore = 0;
  
  designs.forEach(design => {
    let designScore = 0;
    let checks = 0;
    
    // Check color consistency
    const brandColorHexes = brandKit.colors.map(c => c.hex.toLowerCase());
    const colorMatches = design.colors.filter(c => 
      brandColorHexes.includes(c.toLowerCase())
    ).length;
    designScore += (colorMatches / design.colors.length) * 40;
    checks++;
    
    // Check font consistency
    const brandFonts = brandKit.fonts.map(f => f.family.toLowerCase());
    const fontMatches = design.fonts.filter(f => 
      brandFonts.includes(f.toLowerCase())
    ).length;
    designScore += (fontMatches / design.fonts.length) * 30;
    checks++;
    
    // Check spacing consistency
    const brandSpacings = [
      brandKit.guidelines.spacing.small,
      brandKit.guidelines.spacing.medium,
      brandKit.guidelines.spacing.large,
    ];
    const spacingMatches = design.spacing.filter(s => 
      brandSpacings.some(bs => Math.abs(bs - s) < 5)
    ).length;
    designScore += (spacingMatches / design.spacing.length) * 30;
    checks++;
    
    totalScore += designScore;
  });
  
  return Math.round(totalScore / designs.length);
}

/**
 * Generate color palette variations (tints, shades, tones)
 */
export function generateColorVariations(hex: string): {
  tints: string[];
  shades: string[];
  tones: string[];
} {
  const rgb = hexToRgb(hex);
  if (!rgb) return { tints: [], shades: [], tones: [] };
  
  const tints = Array.from({ length: 5 }, (_, i) => {
    const factor = (i + 1) * 0.15;
    return rgbToHex(
      Math.round(rgb.r + (255 - rgb.r) * factor),
      Math.round(rgb.g + (255 - rgb.g) * factor),
      Math.round(rgb.b + (255 - rgb.b) * factor)
    );
  });
  
  const shades = Array.from({ length: 5 }, (_, i) => {
    const factor = (i + 1) * 0.15;
    return rgbToHex(
      Math.round(rgb.r * (1 - factor)),
      Math.round(rgb.g * (1 - factor)),
      Math.round(rgb.b * (1 - factor))
    );
  });
  
  const tones = Array.from({ length: 5 }, (_, i) => {
    const factor = (i + 1) * 0.15;
    const gray = 128;
    return rgbToHex(
      Math.round(rgb.r + (gray - rgb.r) * factor),
      Math.round(rgb.g + (gray - rgb.g) * factor),
      Math.round(rgb.b + (gray - rgb.b) * factor)
    );
  });
  
  return { tints, shades, tones };
}

/**
 * Validate brand asset usage against guidelines
 */
export function validateAssetUsage(
  asset: BrandAsset,
  context: {
    surroundingSpace: number; // in pixels
    backgroundColor: string;
    size: { width: number; height: number };
  },
  guidelines: BrandGuidelines
): {
  valid: boolean;
  violations: string[];
  suggestions: string[];
} {
  const violations: string[] = [];
  const suggestions: string[] = [];
  
  // Check logo spacing
  if (asset.type === 'logo') {
    if (context.surroundingSpace < guidelines.logoSpacing.minimum) {
      violations.push(
        `Logo spacing (${context.surroundingSpace}px) is less than minimum (${guidelines.logoSpacing.minimum}px)`
      );
      suggestions.push(
        `Increase spacing to at least ${guidelines.logoSpacing.recommended}px for optimal visibility`
      );
    }
  }
  
  // Check asset size
  if (asset.dimensions) {
    const scaleX = context.size.width / asset.dimensions.width;
    const scaleY = context.size.height / asset.dimensions.height;
    
    if (scaleX < 0.5 || scaleY < 0.5) {
      suggestions.push('Asset is significantly scaled down. Consider using a smaller version.');
    }
    
    if (scaleX > 2 || scaleY > 2) {
      violations.push('Asset is scaled up too much, may appear pixelated');
      suggestions.push('Use a higher resolution version of this asset');
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Export brand kit as CSS variables
 */
export function exportBrandKitAsCSS(brandKit: BrandKit): string {
  let css = ':root {\n';
  
  // Colors
  brandKit.colors.forEach((color, index) => {
    css += `  --brand-${color.usage}-${index}: ${color.hex};\n`;
  });
  
  // Fonts
  brandKit.fonts.forEach(font => {
    css += `  --brand-font-${font.usage}: '${font.family}', ${font.fallback};\n`;
  });
  
  // Spacing
  css += `  --brand-spacing-sm: ${brandKit.guidelines.spacing.small}px;\n`;
  css += `  --brand-spacing-md: ${brandKit.guidelines.spacing.medium}px;\n`;
  css += `  --brand-spacing-lg: ${brandKit.guidelines.spacing.large}px;\n`;
  
  // Typography
  css += `  --brand-body-size: ${brandKit.guidelines.typography.bodySize}px;\n`;
  css += `  --brand-line-height: ${brandKit.guidelines.typography.lineHeight};\n`;
  
  css += '}\n';
  
  return css;
}

/**
 * Export brand kit as JSON
 */
export function exportBrandKitAsJSON(brandKit: BrandKit): string {
  return JSON.stringify(brandKit, null, 2);
}
