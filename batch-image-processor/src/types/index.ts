export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  processedSize?: number;
  width: number;
  height: number;
  type: string;
  preview: string;
  processedPreview?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  exif?: Record<string, unknown>;
  folderPath: string;
}

export interface CompressOptions {
  quality: number;
  preserveExif: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  mode: 'exact' | 'fit' | 'fill' | 'max';
  maintainAspectRatio: boolean;
  preset?: string;
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageFile?: File;
  position: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'random' | 'tile';
  opacity: number;
  scale: number;
  rotation: number;
  randomOffset: boolean;
  textOptions?: {
    font: string;
    fontSize: number;
    color: string;
    bold: boolean;
    italic: boolean;
  };
}

export interface FormatOptions {
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  quality: number;
}

export interface RenameOptions {
  pattern: string;
  startIndex: number;
  preserveOriginal: boolean;
  customSuffix?: string;
}

export interface ProcessingOptions {
  compress?: CompressOptions;
  resize?: ResizeOptions;
  watermark?: WatermarkOptions;
  format?: FormatOptions;
  rename?: RenameOptions;
  maintainFolderStructure: boolean;
}

export interface ProcessingProgress {
  total: number;
  completed: number;
  failed: number;
  currentFile?: string;
}

export type ProcessingStep = 'compress' | 'resize' | 'watermark' | 'format' | 'rename';

export const SIZE_PRESETS: Record<string, { width: number; height: number; name: string; category: string }> = {
  // Social Media
  'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post', category: 'Social Media' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story', category: 'Social Media' },
  'facebook-post': { width: 1200, height: 630, name: 'Facebook Post', category: 'Social Media' },
  'twitter-post': { width: 1200, height: 675, name: 'Twitter/X Post', category: 'Social Media' },
  'linkedin-post': { width: 1200, height: 627, name: 'LinkedIn Post', category: 'Social Media' },
  'pinterest-pin': { width: 1000, height: 1500, name: 'Pinterest Pin', category: 'Social Media' },
  'youtube-thumbnail': { width: 1280, height: 720, name: 'YouTube Thumbnail', category: 'Social Media' },
  'tiktok-video': { width: 1080, height: 1920, name: 'TikTok Video', category: 'Social Media' },
  
  // E-commerce
  'amazon-product': { width: 2000, height: 2000, name: 'Amazon Product', category: 'E-commerce' },
  'ebay-product': { width: 1600, height: 1600, name: 'eBay Product', category: 'E-commerce' },
  'shopify-product': { width: 2048, height: 2048, name: 'Shopify Product', category: 'E-commerce' },
  'etsy-product': { width: 2000, height: 2000, name: 'Etsy Product', category: 'E-commerce' },
  
  // Common
  'hd': { width: 1920, height: 1080, name: 'HD (1920x1080)', category: 'Common' },
  'full-hd': { width: 1920, height: 1080, name: 'Full HD', category: 'Common' },
  '4k': { width: 3840, height: 2160, name: '4K Ultra HD', category: 'Common' },
  'vga': { width: 640, height: 480, name: 'VGA (640x480)', category: 'Common' },
  'qvga': { width: 320, height: 240, name: 'QVGA (320x240)', category: 'Common' },
};

export const FORMAT_OPTIONS = [
  { value: 'image/jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'image/png', label: 'PNG', extension: 'png' },
  { value: 'image/webp', label: 'WebP', extension: 'webp' },
  { value: 'image/avif', label: 'AVIF', extension: 'avif' },
] as const;
