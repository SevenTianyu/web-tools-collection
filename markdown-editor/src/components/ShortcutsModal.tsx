import { X, Command, CornerDownLeft } from 'lucide-react';

interface ShortcutsModalProps {
  onClose: () => void;
}

export default function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  const shortcuts = [
    {
      category: '文件操作',
      items: [
        { key: 'Ctrl/Cmd + S', description: '保存文档' },
        { key: 'Ctrl/Cmd + N', description: '新建文档' },
        { key: 'Ctrl/Cmd + O', description: '导入文件' },
        { key: 'Ctrl/Cmd + E', description: '导出文档' },
      ]
    },
    {
      category: '编辑',
      items: [
        { key: 'Ctrl/Cmd + Z', description: '撤销' },
        { key: 'Ctrl/Cmd + Shift + Z', description: '重做' },
        { key: 'Ctrl/Cmd + X', description: '剪切' },
        { key: 'Ctrl/Cmd + C', description: '复制' },
        { key: 'Ctrl/Cmd + V', description: '粘贴' },
        { key: 'Ctrl/Cmd + F', description: '查找' },
      ]
    },
    {
      category: '格式化',
      items: [
        { key: 'Ctrl/Cmd + B', description: '粗体' },
        { key: 'Ctrl/Cmd + I', description: '斜体' },
        { key: 'Ctrl/Cmd + K', description: '插入链接' },
        { key: 'Ctrl/Cmd + H', description: '插入标题' },
      ]
    },
    {
      category: '视图',
      items: [
        { key: 'Ctrl/Cmd + P', description: '切换预览模式' },
        { key: 'Ctrl/Cmd + 1', description: '仅编辑器' },
        { key: 'Ctrl/Cmd + 2', description: '分屏模式' },
        { key: 'Ctrl/Cmd + 3', description: '仅预览' },
      ]
    }
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Command className="w-5 h-5" />
            键盘快捷键
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {shortcuts.map(({ category, items }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map(({ key, description }) => (
                    <div key={key} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-gray-600">{description}</span>
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-700">
                        {key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <CornerDownLeft className="w-4 h-4" />
            提示：Mac 用户使用 Cmd 键，Windows 用户使用 Ctrl 键
          </p>
        </div>
      </div>
    </div>
  );
}
