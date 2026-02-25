import { useCallback, useState, useRef } from 'react';
import { useImageStore } from '@/store/useImageStore';
import { processImage, batchProcess, formatFileSize, calculateCompressionRatio } from '@/utils/imageProcessor';
import type { ImageFile, ProcessingOptions } from '@/types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ProcessingResult {
  success: boolean;
  blob?: Blob;
  newName?: string;
  error?: string;
  width?: number;
  height?: number;
  processedSize?: number;
}

interface UseBatchProcessingReturn {
  isProcessing: boolean;
  progress: {
    total: number;
    completed: number;
    failed: number;
    currentFile?: string;
  };
  results: ProcessingResult[];
  totalSaved: number;
  processAll: () => Promise<void>;
  downloadAll: () => Promise<void>;
  downloadSingle: (imageId: string) => void;
  cancelProcessing: () => void;
  resetResults: () => void;
}

export const useBatchProcessing = (options: ProcessingOptions): UseBatchProcessingReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const cancelRef = useRef(false);

  const images = useImageStore((state) => state.images);
  const updateImageStatus = useImageStore((state) => state.updateImageStatus);
  const setGlobalProgress = useImageStore((state) => state.setProgress);

  const processAll = useCallback(async () => {
    if (images.length === 0) return;

    cancelRef.current = false;
    setIsProcessing(true);
    setResults([]);
    setTotalSaved(0);

    const pendingImages = images.filter((img) => img.status === 'pending');
    const totalOriginalSize = pendingImages.reduce((sum, img) => sum + img.originalSize, 0);
    let totalProcessedSize = 0;

    setGlobalProgress({
      total: pendingImages.length,
      completed: 0,
      failed: 0,
    });

    const processSingleImage = async (image: ImageFile, index: number): Promise<ProcessingResult> => {
      if (cancelRef.current) {
        return { success: false, error: 'Cancelled' };
      }

      setGlobalProgress({ currentFile: image.name });
      updateImageStatus(image.id, 'processing');

      try {
        const result = await processImage(image, options);
        
        if (cancelRef.current) {
          return { success: false, error: 'Cancelled' };
        }

        // Create preview for processed image
        const processedPreview = URL.createObjectURL(result.blob);
        
        updateImageStatus(
          image.id,
          'completed',
          processedPreview,
          result.blob.size
        );

        totalProcessedSize += result.blob.size;

        return {
          success: true,
          blob: result.blob,
          newName: result.newName,
          width: result.width,
          height: result.height,
          processedSize: result.blob.size,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateImageStatus(image.id, 'error');
        return { success: false, error: errorMessage };
      }
    };

    const processingResults = await batchProcess(
      pendingImages,
      processSingleImage,
      (completed, total) => {
        setGlobalProgress({ completed, failed: results.filter(r => !r.success).length });
      },
      4 // Process 4 images concurrently
    );

    setResults(processingResults);
    setTotalSaved(totalOriginalSize - totalProcessedSize);
    setIsProcessing(false);
    setGlobalProgress({ currentFile: undefined });
  }, [images, options, updateImageStatus, setGlobalProgress]);

  const downloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.status === 'completed');
    
    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      // Single file - download directly
      const image = completedImages[0];
      const result = results.find((r) => r.success && r.newName);
      if (result?.blob && result.newName) {
        saveAs(result.blob, result.newName);
      }
      return;
    }

    // Multiple files - create zip
    const zip = new JSZip();
    
    // Group files by folder if maintainFolderStructure is enabled
    if (options.maintainFolderStructure) {
      const folderMap = new Map<string, JSZip>();
      
      completedImages.forEach((image, index) => {
        const result = results[index];
        if (result?.success && result.blob && result.newName) {
          const folderPath = image.folderPath || '';
          let folder = folderMap.get(folderPath);
          
          if (!folder) {
            folder = folderPath ? zip.folder(folderPath)! : zip;
            folderMap.set(folderPath, folder);
          }
          
          folder.file(result.newName, result.blob);
        }
      });
    } else {
      // Flat structure
      completedImages.forEach((image, index) => {
        const result = results[index];
        if (result?.success && result.blob && result.newName) {
          zip.file(result.newName, result.blob);
        }
      });
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    saveAs(content, `processed-images-${timestamp}.zip`);
  }, [images, results, options.maintainFolderStructure]);

  const downloadSingle = useCallback((imageId: string) => {
    const imageIndex = images.findIndex((img) => img.id === imageId);
    if (imageIndex === -1) return;

    const image = images[imageIndex];
    const result = results[imageIndex];

    if (result?.success && result.blob && result.newName) {
      saveAs(result.blob, result.newName);
    }
  }, [images, results]);

  const cancelProcessing = useCallback(() => {
    cancelRef.current = true;
    setIsProcessing(false);
  }, []);

  const resetResults = useCallback(() => {
    setResults([]);
    setTotalSaved(0);
  }, []);

  const progress = useImageStore((state) => state.progress);

  return {
    isProcessing,
    progress,
    results,
    totalSaved,
    processAll,
    downloadAll,
    downloadSingle,
    cancelProcessing,
    resetResults,
  };
};
