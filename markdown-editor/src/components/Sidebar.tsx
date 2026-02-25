import { useState } from 'react';
import { 
  FilePlus, 
  Trash2, 
  Clock,
  Search,
  ChevronRight,
  FileText,
  MoreVertical
} from 'lucide-react';
import { useEditorStore } from '../store';
import { formatDistanceToNow } from '../utils/date';

export default function Sidebar() {
  const { 
    documents, 
    currentDocument, 
    createDocument, 
    setCurrentDocument, 
    deleteDocument 
  } = useEditorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleNewDocument = () => {
    const doc = createDocument();
    setCurrentDocument(doc);
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(id);
  };
  
  const confirmDelete = (id: string) => {
    deleteDocument(id);
    setShowConfirmDelete(null);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleNewDocument}
          className="w-full btn-primary gap-2"
        >
          <FilePlus className="w-4 h-4" />
          新建文档
        </button>
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {searchQuery ? '没有找到匹配的文档' : '还没有文档，点击上方按钮创建'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setCurrentDocument(doc)}
                className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  currentDocument?.id === doc.id
                    ? 'bg-primary-50 text-primary-900'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <FileText className={`w-4 h-4 flex-shrink-0 ${
                  currentDocument?.id === doc.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {doc.title || '未命名文档'}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(doc.updatedAt)}
                  </p>
                </div>
                
                <button
                  onClick={(e) => handleDelete(doc.id, e)}
                  className={`p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    currentDocument?.id === doc.id 
                      ? 'hover:bg-primary-100 text-primary-600' 
                      : 'hover:bg-gray-200 text-gray-400 hover:text-red-500'
                  }`}
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Stats */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          共 {documents.length} 个文档
        </p>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">确认删除？</h3>
            <p className="text-sm text-gray-500 mb-4">
              此操作无法撤销，文档将被永久删除。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => confirmDelete(showConfirmDelete)}
                className="flex-1 btn-danger"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
