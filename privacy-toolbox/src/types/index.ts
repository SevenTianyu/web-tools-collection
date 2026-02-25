// Common Types
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'pdf' | 'image' | 'text' | 'ai';
  path: string;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
}

export interface FileInfo {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface ProcessingStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  message: string;
}

// PDF Types
export interface PDFPageRange {
  start: number;
  end: number;
}

export interface PDFMergeOptions {
  files: FileInfo[];
  outputName: string;
}

export interface PDFSplitOptions {
  file: FileInfo;
  ranges: PDFPageRange[];
}

export interface PDFCompressOptions {
  file: FileInfo;
  quality: 'low' | 'medium' | 'high';
}

// Image Types
export interface ImageProcessOptions {
  format?: 'jpeg' | 'png' | 'webp' | 'gif';
  quality?: number;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  watermark?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
    fontSize: number;
    color: string;
  };
}

export interface ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Text Types
export interface TextFormatOptions {
  indent: number;
  sortKeys: boolean;
}

export interface RegexTestResult {
  match: string;
  index: number;
  groups: string[];
}

// AI Types
export interface AIRequest {
  prompt: string;
  type: 'generate' | 'translate' | 'summarize' | 'explain';
  language?: string;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  tokensUsed?: number;
  processingTime?: number;
}

// Theme Types
export type Theme = 'dark' | 'light' | 'system';

// Store Types
export interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  recentFiles: FileInfo[];
  addRecentFile: (file: FileInfo) => void;
  clearRecentFiles: () => void;
}
