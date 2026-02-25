import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../store';

export const useAutoSave = (content: string) => {
  const { settings, saveCurrentContent } = useEditorStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContent = useRef(content);
  
  const save = useCallback(() => {
    if (content !== lastSavedContent.current) {
      saveCurrentContent(content);
      lastSavedContent.current = content;
    }
  }, [content, saveCurrentContent]);
  
  useEffect(() => {
    if (!settings.autoSave) return;
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 设置新的自动保存定时器
    timeoutRef.current = setTimeout(() => {
      save();
    }, settings.autoSaveInterval);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, settings.autoSave, settings.autoSaveInterval, save]);
  
  // 组件卸载时保存
  useEffect(() => {
    return () => {
      save();
    };
  }, [save]);
  
  return { save };
};
