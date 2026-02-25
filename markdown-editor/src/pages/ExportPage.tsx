import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FileCode, 
  FileType, 
  File,
  Download,
  ChevronRight,
  AlertCircle,
  Check,
  Settings
} from 'lucide-react';
import { useEditorStore } from '../store';
import { exportToMarkdown, exportToHTMLFile, exportToWord, exportToPDF } from '../utils/export';
import type { ExportFormat, ExportSettings } from '../types';

const exportOptions: { 
  value: ExportFormat; 
  label: string; 
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  color: string;
}[] = [
  { 
    value: 'md', 
    label: 'Markdown', 
    icon: FileText, 
    desc: '纯 Markdown 格式，适合继续编辑',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  { 
    value: 'html', 
    label: 'HTML', 
    icon: FileCode, 
    desc: '网页格式，保留完整样式',
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  { 
    value: 'word', 
    label: 'Word', 
    icon: FileType, 
    desc: 'Microsoft Word 文档 (.doc)',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  { 
    value: 'pdf', 
    label: 'PDF', 
    icon: File, 
    desc: '便携式文档格式，适合打印分享',
    color: 'text-red-600 bg-red-50 border-red-200'
  }
];

export default function ExportPage() {
  const navigate = useNavigate();
  const { currentDocument, documents } = useEditorStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    filename: currentDocument?.title || 'document',
    includeStyles: true,
    pageSize: 'a4',
    orientation: 'portrait',
    margins: { top: 15, right: 15, bottom: 15, left: 15 }
  });
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = async () => {
    if (!currentDocument) return;
    
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      switch (selectedFormat) {
        case 'md':
          exportToMarkdown(currentDocument.content, currentDocument.title);
          break;
        case 'html':
          exportToHTMLFile(currentDocument.content, currentDocument.title);
          break;
        case 'word':
          exportToWord(currentDocument.content, currentDocument.title);
          break;
        case 'pdf':
          await exportToPDF(currentDocument.content, currentDocument.title, {
            pageSize: exportSettings.pageSize,
            orientation: exportSettings.orientation,
            margins: [
              exportSettings.margins.top,
              exportSettings.margins.right,
              exportSettings.margins.bottom,
              exportSettings.margins.left
            ]
          });
          break;
      }
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportAll = async () => {
    setIsExporting(true);
    
    try {
      for (const doc of documents) {
        switch (selectedFormat) {
          case 'md':
            exportToMarkdown(doc.content, doc.title);
            break;
          case 'html':
            exportToHTMLFile(doc.content, doc.title);
            break;
          case 'word':
            exportToWord(doc.content, doc.title);
            break;
          case 'pdf':
            await exportToPDF(doc.content, doc.title);
            break;
        }
        // 添加小延迟避免浏览器阻止多下载
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Batch export error:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!currentDocument) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-500 mb-2">请先选择一个文档</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            返回编辑器
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">导出文档</h1>
          <p className="text-gray-600">
            当前文档：<span className="font-medium text-gray-900">{currentDocument.title}</span>
          </p>
        </div>
        
        {/* Format Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择格式</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exportOptions.map(({ value, label, icon: Icon, desc, color }) => (
              <button
                key={value}
                onClick={() => setSelectedFormat(value)}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  selectedFormat === value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{label}</span>
                    {selectedFormat === value && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* PDF Settings */}
        {selectedFormat === 'pdf' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">PDF 设置</h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                {showSettings ? '收起' : '高级设置'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">页面大小</label>
                <select
                  value={exportSettings.pageSize}
                  onChange={(e) => setExportSettings({ ...exportSettings, pageSize: e.target.value as any })}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">方向</label>
                <select
                  value={exportSettings.orientation}
                  onChange={(e) => setExportSettings({ ...exportSettings, orientation: e.target.value as any })}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="portrait">纵向</option>
                  <option value="landscape">横向</option>
                </select>
              </div>
            </div>
            
            {showSettings && (
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">边距 (mm)</label>
                <div className="grid grid-cols-4 gap-3">
                  {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                    <div key={side}>
                      <label className="block text-xs text-gray-500 mb-1 capitalize">
                        {side === 'top' ? '上' : side === 'right' ? '右' : side === 'bottom' ? '下' : '左'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={exportSettings.margins[side]}
                        onChange={(e) => setExportSettings({
                          ...exportSettings,
                          margins: { ...exportSettings.margins, [side]: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full rounded-lg border-gray-300 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              {exportSuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">导出成功！</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  将导出为 <strong>{exportOptions.find(o => o.value === selectedFormat)?.label}</strong> 格式
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                返回
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-primary gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? '导出中...' : '导出当前文档'}
              </button>
            </div>
          </div>
          
          {documents.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                批量导出所有 {documents.length} 个文档
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Tips */}
        <div className="mt-6 flex items-start gap-3 text-sm text-gray-500">
          <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700 mb-1">导出提示</p>
            <ul className="space-y-1">
              <li>• PDF 导出可能需要几秒钟，请耐心等待</li>
              <li>• 如果 PDF 导出失败，请尝试 HTML 格式</li>
              <li>• Word 导出为 .doc 格式，可能在某些软件中显示略有差异</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
