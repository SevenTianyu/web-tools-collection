import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Minus,
  Eye,
  EyeOff,
  Columns,
  FileText,
  Check,
  X,
  Sparkles,
  BrainCircuit
} from 'lucide-react';
import { useEditorStore } from '../store';
import { renderMarkdown, getDocumentStats } from '../utils/markdown';
import { useAutoSave } from '../hooks/useAutoSave';
import { useSyncScroll } from '../hooks/useSyncScroll';
import { useShortcuts } from '../hooks/useShortcuts';
import MindMap from './MindMap';
import TableGenerator from './TableGenerator';
import 'highlight.js/styles/github.css';

export default function Editor() {
  const { 
    currentDocument, 
    settings, 
    activeTab, 
    setActiveTab, 
    saveCurrentContent,
    showMindMap,
    toggleMindMap,
    showTableGenerator,
    toggleTableGenerator
  } = useEditorStore();
  
  const [content, setContent] = useState(currentDocument?.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { editorRef, previewRef, handleEditorScroll, handlePreviewScroll } = useSyncScroll();
  
  // 同步文档内容
  useEffect(() => {
    if (currentDocument && currentDocument.content !== content) {
      setContent(currentDocument.content);
    }
  }, [currentDocument?.id]);
  
  // 自动保存
  useAutoSave(content);
  
  // 键盘快捷键
  useShortcuts({
    onSave: () => saveCurrentContent(content),
    onBold: () => insertText('**', '**'),
    onItalic: () => insertText('*', '*'),
    onHeading: () => insertText('# ', ''),
    onLink: () => insertText('[', '](url)'),
    onTogglePreview: () => {
      const tabs: ('editor' | 'preview' | 'split')[] = ['editor', 'split', 'preview'];
      const currentIndex = tabs.indexOf(activeTab);
      setActiveTab(tabs[(currentIndex + 1) % 3]);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const insertText = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: '粗体 (Ctrl+B)' },
    { icon: Italic, action: () => insertText('*', '*'), title: '斜体 (Ctrl+I)' },
    null,
    { icon: Heading, action: () => insertText('## ', ''), title: '标题 (Ctrl+H)' },
    { icon: List, action: () => insertText('- ', ''), title: '无序列表' },
    { icon: ListOrdered, action: () => insertText('1. ', ''), title: '有序列表' },
    null,
    { icon: Quote, action: () => insertText('> ', ''), title: '引用' },
    { icon: Code, action: () => insertText('```\n', '\n```'), title: '代码块' },
    null,
    { icon: Link, action: () => insertText('[', '](url)'), title: '链接 (Ctrl+K)' },
    { icon: Image, action: () => insertText('![alt](', ')'), title: '图片' },
    { icon: Table, action: toggleTableGenerator, title: '表格', active: showTableGenerator },
    null,
    { icon: Minus, action: () => insertText('---\n', ''), title: '分隔线' },
  ];
  
  const stats = getDocumentStats(content);
  
  if (!currentDocument) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-500 mb-2">选择一个文档开始编辑</h2>
          <p className="text-sm text-gray-400">或点击左侧"新建文档"按钮</p>
        </div>
      </div>
    );
  }
  
  const showEditor = activeTab === 'editor' || activeTab === 'split';
  const showPreview = activeTab === 'preview' || activeTab === 'split';
  
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-11 bg-white border-b border-gray-200 flex items-center px-3 gap-1 flex-shrink-0">
        <div className="flex items-center gap-0.5">
          {toolbarButtons.map((btn, index) => {
            if (!btn) return <div key={index} className="divider" />;
            const Icon = btn.icon;
            return (
              <button
                key={index}
                onClick={btn.action}
                title={btn.title}
                className={`toolbar-btn ${btn.active ? 'bg-primary-50 text-primary-600' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleMindMap}
            title="思维导图"
            className={`toolbar-btn ${showMindMap ? 'bg-primary-50 text-primary-600' : ''}`}
          >
            <BrainCircuit className="w-4 h-4" />
          </button>
          
          <div className="divider" />
          
          <button
            onClick={() => setActiveTab('editor')}
            title="仅编辑器"
            className={`toolbar-btn ${activeTab === 'editor' ? 'bg-primary-50 text-primary-600' : ''}`}
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('split')}
            title="分屏"
            className={`toolbar-btn ${activeTab === 'split' ? 'bg-primary-50 text-primary-600' : ''}`}
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            title="仅预览"
            className={`toolbar-btn ${activeTab === 'preview' ? 'bg-primary-50 text-primary-600' : ''}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {showEditor && (
          <div className={`${activeTab === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200 flex flex-col`}>
            <textarea
              ref={(el) => {
                textareaRef.current = el;
                (editorRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
              }}
              value={content}
              onChange={handleChange}
              onScroll={handleEditorScroll}
              className="editor-textarea"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre'
              }}
              placeholder="开始输入 Markdown..."
              spellCheck={false}
            />
          </div>
        )}
        
        {/* Preview Pane */}
        {showPreview && (
          <div 
            ref={previewRef}
            onScroll={handlePreviewScroll}
            className={`${activeTab === 'split' ? 'w-1/2' : 'w-full'} overflow-auto bg-white`}
          >
            <div 
              className="markdown-body p-8 min-h-full"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>
      
      {/* Stats Bar */}
      <div className="h-8 bg-gray-50 border-t border-gray-200 flex items-center px-4 text-xs text-gray-500 gap-4 flex-shrink-0">
        <span>{stats.words} 词</span>
        <span>{stats.chars} 字符</span>
        <span>{stats.lines} 行</span>
        <span>阅读约 {stats.readingTime} 分钟</span>
        <div className="flex-1" />
        <span>{settings.autoSave ? '自动保存已开启' : '自动保存已关闭'}</span>
      </div>
      
      {/* Mind Map Modal */}
      {showMindMap && (
        <MindMap content={content} onClose={toggleMindMap} />
      )}
      
      {/* Table Generator Modal */}
      {showTableGenerator && (
        <TableGenerator 
          onInsert={(markdown) => {
            insertText('', '\n' + markdown + '\n');
            toggleTableGenerator();
          }}
          onClose={toggleTableGenerator}
        />
      )}
    </div>
  );
}
