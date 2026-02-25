// 文档类型
export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// 导出格式
export type ExportFormat = 'pdf' | 'word' | 'html' | 'md';

// 导出设置
export interface ExportSettings {
  format: ExportFormat;
  filename: string;
  includeStyles: boolean;
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// 模板类型
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'resume' | 'report' | 'readme' | 'blog' | 'other';
  icon: string;
  content: string;
  tags: string[];
}

// 表格数据
export interface TableData {
  rows: number;
  cols: number;
  data: string[][];
}

// 思维导图节点
export interface MindMapNode {
  id: string;
  text: string;
  level: number;
  children: MindMapNode[];
}

// 编辑器设置
export interface EditorSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  lineHeight: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  syncScroll: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
}

// 应用状态
export interface AppState {
  currentDocument: Document | null;
  documents: Document[];
  settings: EditorSettings;
  isSidebarOpen: boolean;
  activeTab: 'editor' | 'preview' | 'split';
}
