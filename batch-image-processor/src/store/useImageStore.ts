import { create } from 'zustand';
import type { ImageFile, ProcessingOptions, ProcessingStep } from '@/types';

interface ImageState {
  images: ImageFile[];
  selectedImages: Set<string>;
  processingOptions: ProcessingOptions;
  currentStep: ProcessingStep | null;
  isProcessing: boolean;
  progress: {
    total: number;
    completed: number;
    failed: number;
    currentFile?: string;
  };
  
  // Actions
  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  selectImage: (id: string) => void;
  deselectImage: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  updateImageStatus: (id: string, status: ImageFile['status'], processedPreview?: string, processedSize?: number) => void;
  setProcessingOptions: (options: Partial<ProcessingOptions>) => void;
  setCurrentStep: (step: ProcessingStep | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: Partial<ImageState['progress']>) => void;
  resetProgress: () => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
}

const defaultProcessingOptions: ProcessingOptions = {
  maintainFolderStructure: true,
  compress: {
    quality: 80,
    preserveExif: true,
  },
  resize: {
    mode: 'max',
    maintainAspectRatio: true,
  },
  watermark: {
    type: 'text',
    text: '',
    position: 'bottomRight',
    opacity: 50,
    scale: 20,
    rotation: 0,
    randomOffset: false,
    textOptions: {
      font: 'Arial',
      fontSize: 48,
      color: '#ffffff',
      bold: false,
      italic: false,
    },
  },
  format: {
    targetFormat: 'image/jpeg',
    quality: 85,
  },
  rename: {
    pattern: '{original}_{index}',
    startIndex: 1,
    preserveOriginal: true,
  },
};

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  selectedImages: new Set(),
  processingOptions: defaultProcessingOptions,
  currentStep: null,
  isProcessing: false,
  progress: {
    total: 0,
    completed: 0,
    failed: 0,
  },

  addImages: (newImages) => {
    set((state) => ({
      images: [...state.images, ...newImages],
    }));
  },

  removeImage: (id) => {
    set((state) => {
      const newSelected = new Set(state.selectedImages);
      newSelected.delete(id);
      return {
        images: state.images.filter((img) => img.id !== id),
        selectedImages: newSelected,
      };
    });
  },

  clearImages: () => {
    set({
      images: [],
      selectedImages: new Set(),
    });
  },

  selectImage: (id) => {
    set((state) => {
      const newSelected = new Set(state.selectedImages);
      newSelected.add(id);
      return { selectedImages: newSelected };
    });
  },

  deselectImage: (id) => {
    set((state) => {
      const newSelected = new Set(state.selectedImages);
      newSelected.delete(id);
      return { selectedImages: newSelected };
    });
  },

  selectAll: () => {
    set((state) => ({
      selectedImages: new Set(state.images.map((img) => img.id)),
    }));
  },

  deselectAll: () => {
    set({ selectedImages: new Set() });
  },

  updateImageStatus: (id, status, processedPreview, processedSize) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? { ...img, status, processedPreview, processedSize }
          : img
      ),
    }));
  },

  setProcessingOptions: (options) => {
    set((state) => ({
      processingOptions: { ...state.processingOptions, ...options },
    }));
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  setIsProcessing: (isProcessing) => set({ isProcessing }),

  setProgress: (progress) => {
    set((state) => ({
      progress: { ...state.progress, ...progress },
    }));
  },

  resetProgress: () => {
    set({
      progress: {
        total: 0,
        completed: 0,
        failed: 0,
      },
    });
  },

  reorderImages: (startIndex, endIndex) => {
    set((state) => {
      const newImages = [...state.images];
      const [removed] = newImages.splice(startIndex, 1);
      newImages.splice(endIndex, 0, removed);
      return { images: newImages };
    });
  },
}));
