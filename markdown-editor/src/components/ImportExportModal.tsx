import { useState, useRef } from 'react';
import { X, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { useEditorStore } from '../store';
import { exportToMarkdown, exportToHTMLFile, exportToWord, exportToPDF, importMarkdownFile } from '../utils/export';
import { exportAllData, importAllData } from '../utils/storage';

interface ImportExportModalProps {
  onClose: () => void;
}

export default function ImportExportModal({ onClose }: ImportExportModalProps) {
  const { currentDocument, createDocument, documents } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'md' | 'html' | 'doc' | 'pdf'>('md');
  const [isExporting, setIsExporting] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = async () => {
    if (!currentDocument) return;
    
    setIsExporting(true);
    try {
      switch (exportFormat) {
        case 'md':
          exportToMarkdown(currentDocument.content, currentDocument.title);
          break;
        case 'html':
          exportToHTMLFile(currentDocument.content, currentDocument.title);
          break;
        case 'doc':
          exportToWord(currentDocument.content, currentDocument.title);
          break;
        case 'pdf':
          await exportToPDF(currentDocument.content, currentDocument.title);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError('');
    
    try {
      const { content, filename } = await importMarkdownFile(file);
      createDocument(filename, content);
      onClose();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入失败');
    }
  };
  
  const handleExportAll = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `markdown-editor-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const success = importAllData(text);
      if (success) {
        window.location.reload();
      } else {
        setImportError('数据格式错误');
      }
    } catch (error) {
      setImportError('导入失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">导入 / 导出</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'export' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            导出
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'import' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            导入
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {/* Current Document Export */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">导出当前文档</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'md', label: 'Markdown', icon: FileText },
                    { value: 'html', label: 'HTML', icon: FileText },
                    { value: 'doc', label: 'Word', icon: FileText },
                    { value: 'pdf', label: 'PDF', icon: FileText },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setExportFormat(value as any)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        exportFormat === value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExport}
                  disabled={!currentDocument || isExporting}
                  className="w-full mt-4 btn-primary gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? '导出中...' : `导出为 ${exportFormat.toUpperCase()}`}
                </button>
                {!currentDocument && (
                  <p className="text-xs text-gray-500 mt-2 text-center">请先选择一个文档</p>
                )}
              </div>
              
              {/* Backup Export */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">备份所有数据</h3>
                <p className="text-xs text-gray-500 mb-3">
                  导出所有文档和设置，以便在其他设备上恢复
                </p>
                <button
                  onClick={handleExportAll}
                  className="w-full btn-secondary gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出备份 ({documents.length} 个文档)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Import Markdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">导入 Markdown 文件</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full btn-secondary gap-2"
                >
                  <Upload className="w-4 h-4" />
                  选择 .md 文件
                </button>
              </div>
              
              {/* Import Backup */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">恢复备份</h3>
                <p className="text-xs text-gray-500 mb-3">
                  从备份文件恢复所有文档和设置，当前数据将被覆盖
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportAll}
                  className="hidden"
                  id="import-backup"
                />
                <label
                  htmlFor="import-backup"
                  className="w-full btn-secondary gap-2 cursor-pointer inline-flex"
                >
                  <Upload className="w-4 h-4" />
                  选择备份文件
                </label>
              </div>
              
              {importError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {importError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
