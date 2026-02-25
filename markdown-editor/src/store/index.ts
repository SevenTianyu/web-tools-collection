import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Document, EditorSettings } from '../types';
import { defaultSettings, generateId } from '../utils/storage';

interface EditorState {
  // 文档状态
  documents: Document[];
  currentDocument: Document | null;
  
  // UI 状态
  isSidebarOpen: boolean;
  activeTab: 'editor' | 'preview' | 'split';
  showMindMap: boolean;
  showTableGenerator: boolean;
  
  // 设置
  settings: EditorSettings;
  
  // 操作
  setCurrentDocument: (doc: Document | null) => void;
  createDocument: (title?: string, content?: string) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  saveCurrentContent: (content: string) => void;
  
  toggleSidebar: () => void;
  setActiveTab: (tab: 'editor' | 'preview' | 'split') => void;
  toggleMindMap: () => void;
  toggleTableGenerator: () => void;
  
  updateSettings: (settings: Partial<EditorSettings>) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // 初始状态
      documents: [],
      currentDocument: null,
      isSidebarOpen: true,
      activeTab: 'split',
      showMindMap: false,
      showTableGenerator: false,
      settings: defaultSettings,
      
      // 设置当前文档
      setCurrentDocument: (doc) => {
        set({ currentDocument: doc });
      },
      
      // 创建新文档
      createDocument: (title = '未命名文档', content = '') => {
        const newDoc: Document = {
          id: generateId(),
          title,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set((state) => ({
          documents: [newDoc, ...state.documents],
          currentDocument: newDoc
        }));
        
        return newDoc;
      },
      
      // 更新文档
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates, updatedAt: Date.now() } : doc
          ),
          currentDocument: state.currentDocument?.id === id
            ? { ...state.currentDocument, ...updates, updatedAt: Date.now() }
            : state.currentDocument
        }));
      },
      
      // 删除文档
      deleteDocument: (id) => {
        set((state) => {
          const newDocs = state.documents.filter((doc) => doc.id !== id);
          return {
            documents: newDocs,
            currentDocument: state.currentDocument?.id === id
              ? (newDocs[0] || null)
              : state.currentDocument
          };
        });
      },
      
      // 保存当前内容
      saveCurrentContent: (content) => {
        const { currentDocument } = get();
        if (currentDocument) {
          // 自动提取第一行作为标题
          const lines = content.split('\n');
          const firstLine = lines[0].trim();
          let title = currentDocument.title;
          
          if (firstLine.startsWith('# ')) {
            title = firstLine.replace('# ', '').trim() || '未命名文档';
          } else if (firstLine && (!title || title === '未命名文档')) {
            title = firstLine.slice(0, 50) || '未命名文档';
          }
          
          get().updateDocument(currentDocument.id, { content, title });
        }
      },
      
      // 切换侧边栏
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      
      // 设置活动标签
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
      
      // 切换思维导图
      toggleMindMap: () => {
        set((state) => ({ showMindMap: !state.showMindMap }));
      },
      
      // 切换表格生成器
      toggleTableGenerator: () => {
        set((state) => ({ showTableGenerator: !state.showTableGenerator }));
      },
      
      // 更新设置
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      }
    }),
    {
      name: 'md-editor-storage',
      partialize: (state) => ({
        documents: state.documents,
        settings: state.settings,
        isSidebarOpen: state.isSidebarOpen
      })
    }
  )
);
