import { useRef, useCallback, useEffect } from 'react';
import { useEditorStore } from '../store';

export const useSyncScroll = () => {
  const { settings } = useEditorStore();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  
  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (!settings.syncScroll || isScrolling.current) return;
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    
    if (!editor || !preview) return;
    
    isScrolling.current = true;
    
    if (source === 'editor') {
      const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
    } else {
      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    }
    
    setTimeout(() => {
      isScrolling.current = false;
    }, 50);
  }, [settings.syncScroll]);
  
  const handleEditorScroll = useCallback(() => {
    syncScroll('editor');
  }, [syncScroll]);
  
  const handlePreviewScroll = useCallback(() => {
    syncScroll('preview');
  }, [syncScroll]);
  
  return {
    editorRef,
    previewRef,
    handleEditorScroll,
    handlePreviewScroll
  };
};
