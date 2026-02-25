import { useCallback, useState } from 'react';
import { useImageStore } from '@/store/useImageStore';
import type { ImageFile } from '@/types';
import { generateId, readFileAsDataURL, getImageDimensions } from '@/utils/imageProcessor';

interface UseImageUploadReturn {
  isDragging: boolean;
  isLoading: boolean;
  progress: number;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/avif',
];

export const useImageUpload = (): UseImageUploadReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const addImages = useImageStore((state) => state.addImages);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setProgress(0);

    const imageFiles: ImageFile[] = [];
    const totalFiles = files.length;
    let processedCount = 0;

    // Filter and process files
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
        processedCount++;
        continue;
      }

      try {
        const preview = await readFileAsDataURL(file);
        const { width, height } = await getImageDimensions(preview);

        imageFiles.push({
          id: generateId(),
          file,
          name: file.name,
          originalSize: file.size,
          width,
          height,
          type: file.type,
          preview,
          status: 'pending',
          folderPath: '', // Will be set from webkitRelativePath if available
        });
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }

      processedCount++;
      setProgress(Math.round((processedCount / totalFiles) * 100));
    }

    if (imageFiles.length > 0) {
      addImages(imageFiles);
    }

    setIsLoading(false);
    setProgress(0);
  }, [addImages]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files: File[] = [];
    
    // Handle dropped items
    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items);
      
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            if (entry.isFile) {
              const file = item.getAsFile();
              if (file) files.push(file);
            } else if (entry.isDirectory) {
              // Handle directory - we'll traverse it
              traverseDirectory(entry, files);
            }
          }
        }
      }
    } else {
      // Fallback for browsers that don't support DataTransferItemList
      const droppedFiles = Array.from(e.dataTransfer.files);
      files.push(...droppedFiles);
    }

    if (files.length > 0) {
      // Create a FileList-like object
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      processFiles(dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [processFiles]);

  return {
    isDragging,
    isLoading,
    progress,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
  };
};

// Helper function to traverse directory
const traverseDirectory = (entry: FileSystemDirectoryEntry, files: File[]): Promise<void> => {
  return new Promise((resolve) => {
    const reader = entry.createReader();
    
    const readEntries = () => {
      reader.readEntries(async (entries) => {
        if (entries.length === 0) {
          resolve();
          return;
        }

        for (const childEntry of entries) {
          if (childEntry.isFile) {
            const file = await getFileFromEntry(childEntry as FileSystemFileEntry);
            if (file) files.push(file);
          } else if (childEntry.isDirectory) {
            await traverseDirectory(childEntry as FileSystemDirectoryEntry, files);
          }
        }

        // Continue reading if there are more entries
        readEntries();
      });
    };

    readEntries();
  });
};

// Helper function to get file from entry
const getFileFromEntry = (entry: FileSystemFileEntry): Promise<File | null> => {
  return new Promise((resolve) => {
    entry.file((file) => resolve(file), () => resolve(null));
  });
};
