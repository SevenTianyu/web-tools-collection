import type { Document, EditorSettings } from '../types';

const STORAGE_KEYS = {
  DOCUMENTS: 'md_editor_documents',
  CURRENT_DOC: 'md_editor_current_doc',
  SETTINGS: 'md_editor_settings',
  LAST_SAVED: 'md_editor_last_saved'
};

// 默认设置
export const defaultSettings: EditorSettings = {
  theme: 'system',
  fontSize: 14,
  lineHeight: 1.6,
  wordWrap: true,
  showLineNumbers: false,
  syncScroll: true,
  autoSave: true,
  autoSaveInterval: 30000 // 30秒
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 保存文档列表
export const saveDocuments = (documents: Document[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  } catch (error) {
    console.error('Failed to save documents:', error);
  }
};

// 获取文档列表
export const getDocuments = (): Document[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get documents:', error);
    return [];
  }
};

// 保存单个文档
export const saveDocument = (document: Document): void => {
  const documents = getDocuments();
  const index = documents.findIndex(d => d.id === document.id);
  
  if (index >= 0) {
    documents[index] = { ...document, updatedAt: Date.now() };
  } else {
    documents.push({ ...document, updatedAt: Date.now() });
  }
  
  saveDocuments(documents);
};

// 获取单个文档
export const getDocument = (id: string): Document | null => {
  const documents = getDocuments();
  return documents.find(d => d.id === id) || null;
};

// 删除文档
export const deleteDocument = (id: string): void => {
  const documents = getDocuments().filter(d => d.id !== id);
  saveDocuments(documents);
};

// 保存当前文档ID
export const saveCurrentDocumentId = (id: string | null): void => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_DOC, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_DOC);
    }
  } catch (error) {
    console.error('Failed to save current document ID:', error);
  }
};

// 获取当前文档ID
export const getCurrentDocumentId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_DOC);
  } catch (error) {
    console.error('Failed to get current document ID:', error);
    return null;
  }
};

// 保存设置
export const saveSettings = (settings: EditorSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// 获取设置
export const getSettings = (): EditorSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return defaultSettings;
  }
};

// 自动保存状态
export const setLastSaved = (timestamp: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, timestamp.toString());
  } catch (error) {
    console.error('Failed to set last saved:', error);
  }
};

export const getLastSaved = (): number | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
    return data ? parseInt(data, 10) : null;
  } catch (error) {
    console.error('Failed to get last saved:', error);
    return null;
  }
};

// 导出所有数据
export const exportAllData = (): string => {
  const data = {
    documents: getDocuments(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

// 导入数据
export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.documents && Array.isArray(data.documents)) {
      saveDocuments(data.documents);
    }
    
    if (data.settings) {
      saveSettings({ ...defaultSettings, ...data.settings });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

// 清理所有数据
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// 检查存储空间
export const checkStorageSpace = (): { used: number; total: number; percentage: number } => {
  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length * 2; // UTF-16 encoding
    }
  }
  
  // 默认 localStorage 限制约 5-10MB
  const total = 5 * 1024 * 1024; // 5MB
  const percentage = (used / total) * 100;
  
  return { used, total, percentage };
};
