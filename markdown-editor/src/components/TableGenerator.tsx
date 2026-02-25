import { useState } from 'react';
import { X, Plus, Minus, Table, Copy, Check } from 'lucide-react';
import { generateTableMarkdown } from '../utils/markdown';

interface TableGeneratorProps {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

export default function TableGenerator({ onInsert, onClose }: TableGeneratorProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>(() => 
    Array(3).fill(null).map(() => Array(3).fill(''))
  );
  const [copied, setCopied] = useState(false);
  
  const updateCell = (row: number, col: number, value: string) => {
    const newData = data.map((r, i) => 
      i === row ? r.map((c, j) => j === col ? value : c) : r
    );
    setData(newData);
  };
  
  const addRow = () => {
    setRows(rows + 1);
    setData([...data, Array(cols).fill('')]);
  };
  
  const removeRow = () => {
    if (rows > 1) {
      setRows(rows - 1);
      setData(data.slice(0, -1));
    }
  };
  
  const addCol = () => {
    setCols(cols + 1);
    setData(data.map(row => [...row, '']));
  };
  
  const removeCol = () => {
    if (cols > 1) {
      setCols(cols - 1);
      setData(data.map(row => row.slice(0, -1)));
    }
  };
  
  const handleInsert = () => {
    const markdown = generateTableMarkdown(rows, cols, data);
    onInsert(markdown);
  };
  
  const handleCopy = () => {
    const markdown = generateTableMarkdown(rows, cols, data);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const preview = generateTableMarkdown(rows, cols, data);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Table className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">表格生成器</h2>
              <p className="text-sm text-gray-500">可视化编辑表格，自动生成 Markdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="flex gap-6">
            {/* Controls */}
            <div className="w-48 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">行数</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={removeRow}
                    disabled={rows <= 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{rows}</span>
                  <button
                    onClick={addRow}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">列数</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={removeCol}
                    disabled={cols <= 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{cols}</span>
                  <button
                    onClick={addCol}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCopy}
                  className="w-full btn-secondary gap-2 text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制 Markdown'}
                </button>
              </div>
            </div>
            
            {/* Table Editor */}
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {Array(cols).fill(null).map((_, colIndex) => (
                        <th key={colIndex} className="border border-gray-300 bg-gray-100 p-2 min-w-[100px]">
                          <input
                            type="text"
                            value={`列${colIndex + 1}`}
                            readOnly
                            className="w-full bg-transparent text-center font-semibold text-gray-700 focus:outline-none"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 p-0">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                              placeholder={`R${rowIndex + 1}C${colIndex + 1}`}
                              className="w-full p-2 bg-white focus:bg-primary-50 focus:outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Preview */}
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Markdown 预览</label>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto max-h-40">
                  {preview}
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            取消
          </button>
          <button
            onClick={handleInsert}
            className="btn-primary"
          >
            插入表格
          </button>
        </div>
      </div>
    </div>
  );
}
