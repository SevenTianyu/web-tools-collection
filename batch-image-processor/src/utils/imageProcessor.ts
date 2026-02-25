import type { ImageFile, CompressOptions, ResizeOptions, WatermarkOptions, FormatOptions, RenameOptions } from '@/types';

// Constants for performance optimization
const MAX_CONCURRENT_PROCESSING = 4;
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for reading

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Read file as data URL with progress tracking
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get image dimensions
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
};

// Create canvas from image source
export const createCanvasFromImage = async (
  src: string,
  options?: { maxWidth?: number; maxHeight?: number }
): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; originalWidth: number; originalHeight: number }> => {
  const img = new Image();
  img.src = src;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  let { width, height } = img;
  const originalWidth = width;
  const originalHeight = height;

  // Apply max dimensions if specified
  if (options?.maxWidth && width > options.maxWidth) {
    height = (height * options.maxWidth) / width;
    width = options.maxWidth;
  }
  if (options?.maxHeight && height > options.maxHeight) {
    width = (width * options.maxHeight) / height;
    height = options.maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  
  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
  if (!ctx) throw new Error('Failed to get canvas context');

  // Use better quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return { canvas, ctx, originalWidth, originalHeight };
};

// Compress image
export const compressImage = async (
  imageFile: ImageFile,
  options: CompressOptions
): Promise<Blob> => {
  const { canvas, ctx } = await createCanvasFromImage(imageFile.preview, {
    maxWidth: options.maxWidth,
    maxHeight: options.maxHeight,
  });

  // Determine output format
  const outputFormat = imageFile.type === 'image/png' && !options.maxWidth && !options.maxHeight
    ? 'image/png'
    : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to compress image'));
      },
      outputFormat,
      options.quality / 100
    );
  });
};

// Resize image
export const resizeImage = async (
  imageFile: ImageFile,
  options: ResizeOptions
): Promise<HTMLCanvasElement> => {
  const img = new Image();
  img.src = imageFile.preview;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  let { width, height } = img;
  const aspectRatio = width / height;

  switch (options.mode) {
    case 'exact':
      width = options.width || width;
      height = options.height || height;
      break;
    case 'fit':
      if (options.width && options.height) {
        const targetRatio = options.width / options.height;
        if (aspectRatio > targetRatio) {
          width = options.width;
          height = width / aspectRatio;
        } else {
          height = options.height;
          width = height * aspectRatio;
        }
      } else if (options.width) {
        width = options.width;
        height = width / aspectRatio;
      } else if (options.height) {
        height = options.height;
        width = height * aspectRatio;
      }
      break;
    case 'fill':
      if (options.width && options.height) {
        width = options.width;
        height = options.height;
      }
      break;
    case 'max':
      if (options.width && width > options.width) {
        height = (height * options.width) / width;
        width = options.width;
      }
      if (options.height && height > options.height) {
        width = (width * options.height) / height;
        height = options.height;
      }
      break;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (options.mode === 'fill' && options.width && options.height) {
    // Cover mode - crop to fill
    const targetRatio = options.width / options.height;
    let srcWidth = img.width;
    let srcHeight = img.height;
    let srcX = 0;
    let srcY = 0;

    if (aspectRatio > targetRatio) {
      srcWidth = img.height * targetRatio;
      srcX = (img.width - srcWidth) / 2;
    } else {
      srcHeight = img.width / targetRatio;
      srcY = (img.height - srcHeight) / 2;
    }

    ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, width, height);
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }

  return canvas;
};

// Add watermark to image
export const addWatermark = async (
  imageFile: ImageFile,
  options: WatermarkOptions
): Promise<HTMLCanvasElement> => {
  const { canvas, ctx } = await createCanvasFromImage(imageFile.preview);

  ctx.save();
  ctx.globalAlpha = options.opacity / 100;

  if (options.type === 'text' && options.text) {
    await addTextWatermark(ctx, canvas, options);
  } else if (options.type === 'image' && options.imageFile) {
    await addImageWatermark(ctx, canvas, options);
  }

  ctx.restore();
  return canvas;
};

// Add text watermark
const addTextWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: WatermarkOptions
): Promise<void> => {
  const textOptions = options.textOptions || {
    font: 'Arial',
    fontSize: 48,
    color: '#ffffff',
    bold: false,
    italic: false,
  };

  const fontStyle = `${textOptions.italic ? 'italic ' : ''}${textOptions.bold ? 'bold ' : ''}${textOptions.fontSize}px ${textOptions.font}`;
  ctx.font = fontStyle;
  ctx.fillStyle = textOptions.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = options.text || '';
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = textOptions.fontSize;

  const positions = getWatermarkPositions(
    options.position,
    canvas.width,
    canvas.height,
    textWidth,
    textHeight,
    options.randomOffset
  );

  positions.forEach(({ x, y }) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((options.rotation * Math.PI) / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  });
};

// Add image watermark
const addImageWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: WatermarkOptions
): Promise<void> => {
  if (!options.imageFile) return;

  const img = new Image();
  const dataUrl = await readFileAsDataURL(options.imageFile);
  img.src = dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  const scale = options.scale / 100;
  const watermarkWidth = img.width * scale;
  const watermarkHeight = img.height * scale;

  const positions = getWatermarkPositions(
    options.position,
    canvas.width,
    canvas.height,
    watermarkWidth,
    watermarkHeight,
    options.randomOffset
  );

  positions.forEach(({ x, y }) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((options.rotation * Math.PI) / 180);
    ctx.drawImage(img, -watermarkWidth / 2, -watermarkHeight / 2, watermarkWidth, watermarkHeight);
    ctx.restore();
  });
};

// Get watermark positions
const getWatermarkPositions = (
  position: WatermarkOptions['position'],
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  randomOffset: boolean
): Array<{ x: number; y: number }> => {
  const margin = 20;
  const positions: Array<{ x: number; y: number }> = [];

  const getOffset = () => randomOffset ? (Math.random() - 0.5) * 40 : 0;

  switch (position) {
    case 'center':
      positions.push({ x: canvasWidth / 2 + getOffset(), y: canvasHeight / 2 + getOffset() });
      break;
    case 'topLeft':
      positions.push({ x: watermarkWidth / 2 + margin + getOffset(), y: watermarkHeight / 2 + margin + getOffset() });
      break;
    case 'topRight':
      positions.push({ x: canvasWidth - watermarkWidth / 2 - margin + getOffset(), y: watermarkHeight / 2 + margin + getOffset() });
      break;
    case 'bottomLeft':
      positions.push({ x: watermarkWidth / 2 + margin + getOffset(), y: canvasHeight - watermarkHeight / 2 - margin + getOffset() });
      break;
    case 'bottomRight':
      positions.push({ x: canvasWidth - watermarkWidth / 2 - margin + getOffset(), y: canvasHeight - watermarkHeight / 2 - margin + getOffset() });
      break;
    case 'random':
      positions.push({
        x: watermarkWidth / 2 + margin + Math.random() * (canvasWidth - watermarkWidth - margin * 2),
        y: watermarkHeight / 2 + margin + Math.random() * (canvasHeight - watermarkHeight - margin * 2),
      });
      break;
    case 'tile':
      const cols = Math.ceil(canvasWidth / (watermarkWidth + margin));
      const rows = Math.ceil(canvasHeight / (watermarkHeight + margin));
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          positions.push({
            x: i * (watermarkWidth + margin) + watermarkWidth / 2 + getOffset(),
            y: j * (watermarkHeight + margin) + watermarkHeight / 2 + getOffset(),
          });
        }
      }
      break;
  }

  return positions;
};

// Convert image format
export const convertImageFormat = async (
  imageFile: ImageFile,
  options: FormatOptions
): Promise<Blob> => {
  const { canvas, ctx } = await createCanvasFromImage(imageFile.preview);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert image format'));
      },
      options.targetFormat,
      options.quality / 100
    );
  });
};

// Generate new filename based on rename options
export const generateNewFilename = (
  originalName: string,
  index: number,
  options: RenameOptions,
  newExtension?: string
): string => {
  const lastDotIndex = originalName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
  const extension = newExtension || (lastDotIndex > 0 ? originalName.substring(lastDotIndex + 1) : 'jpg');

  let newName = options.pattern;
  
  // Replace placeholders
  newName = newName.replace(/\{original\}/g, baseName);
  newName = newName.replace(/\{index\}/g, (options.startIndex + index).toString().padStart(3, '0'));
  newName = newName.replace(/\{date\}/g, new Date().toISOString().split('T')[0].replace(/-/g, ''));
  newName = newName.replace(/\{time\}/g, new Date().toTimeString().split(' ')[0].replace(/:/g, ''));
  
  if (options.customSuffix) {
    newName += options.customSuffix;
  }

  return `${newName}.${extension}`;
};

// Process single image through multiple steps
export const processImage = async (
  imageFile: ImageFile,
  options: {
    compress?: CompressOptions;
    resize?: ResizeOptions;
    watermark?: WatermarkOptions;
    format?: FormatOptions;
    rename?: RenameOptions;
  }
): Promise<{ blob: Blob; newName: string; width: number; height: number }> => {
  let canvas: HTMLCanvasElement | null = null;
  let currentType = imageFile.type;
  let currentName = imageFile.name;

  // Step 1: Resize
  if (options.resize) {
    canvas = await resizeImage(imageFile, options.resize);
  }

  // Step 2: Add watermark
  if (options.watermark) {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.globalAlpha = options.watermark.opacity / 100;
        if (options.watermark.type === 'text' && options.watermark.text) {
          await addTextWatermark(ctx, canvas, options.watermark);
        } else if (options.watermark.type === 'image' && options.watermark.imageFile) {
          await addImageWatermark(ctx, canvas, options.watermark);
        }
        ctx.restore();
      }
    } else {
      canvas = await addWatermark(imageFile, options.watermark);
    }
  }

  // Step 3: Compress or Convert format (both involve encoding)
  let outputBlob: Blob;
  let outputFormat = options.format?.targetFormat || currentType;
  let quality = options.compress?.quality || options.format?.quality || 85;

  if (canvas) {
    outputBlob = await new Promise((resolve, reject) => {
      canvas!.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to encode image'));
        },
        outputFormat,
        quality / 100
      );
    });
  } else {
    // No canvas manipulation yet, process from original
    if (options.compress) {
      outputBlob = await compressImage(imageFile, options.compress);
    } else if (options.format) {
      outputBlob = await convertImageFormat(imageFile, options.format);
    } else {
      // No processing needed, return original
      outputBlob = imageFile.file;
    }
  }

  // Step 4: Rename
  let newName = currentName;
  if (options.rename) {
    const newExtension = FORMAT_OPTIONS.find(f => f.value === outputFormat)?.extension;
    newName = generateNewFilename(currentName, 0, options.rename, newExtension);
  } else if (options.format) {
    // Change extension if format conversion happened
    const lastDotIndex = currentName.lastIndexOf('.');
    const baseName = lastDotIndex > 0 ? currentName.substring(0, lastDotIndex) : currentName;
    const newExtension = FORMAT_OPTIONS.find(f => f.value === outputFormat)?.extension || 'jpg';
    newName = `${baseName}.${newExtension}`;
  }

  return {
    blob: outputBlob,
    newName,
    width: canvas?.width || imageFile.width,
    height: canvas?.height || imageFile.height,
  };
};

// Get extension from mime type
const FORMAT_OPTIONS = [
  { value: 'image/jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'image/png', label: 'PNG', extension: 'png' },
  { value: 'image/webp', label: 'WebP', extension: 'webp' },
  { value: 'image/avif', label: 'AVIF', extension: 'avif' },
];

// Batch process images with concurrency control
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  onProgress?: (completed: number, total: number) => void,
  concurrency: number = MAX_CONCURRENT_PROCESSING
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let completed = 0;

  const processItem = async (item: T, index: number): Promise<void> => {
    try {
      results[index] = await processor(item, index);
    } catch (error) {
      results[index] = error as R;
    } finally {
      completed++;
      onProgress?.(completed, items.length);
    }
  };

  const queue = [...items.entries()];
  const active: Promise<void>[] = [];

  while (queue.length > 0 || active.length > 0) {
    while (active.length < concurrency && queue.length > 0) {
      const [index, item] = queue.shift()!;
      active.push(processItem(item, index));
    }

    if (active.length > 0) {
      await Promise.race(active);
      // Remove completed promises
      for (let i = active.length - 1; i >= 0; i--) {
        const promise = active[i];
        // Check if promise is settled
        const result = await Promise.race([promise.then(() => true).catch(() => true), Promise.resolve(false)]);
        if (result) {
          active.splice(i, 1);
        }
      }
    }
  }

  return results;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Calculate compression ratio
export const calculateCompressionRatio = (original: number, compressed: number): string => {
  const ratio = ((original - compressed) / original) * 100;
  return ratio > 0 ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`;
};

// Debounce function for performance
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
