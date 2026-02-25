import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  User, 
  BookOpen, 
  ClipboardList, 
  PenTool, 
  Users,
  Search,
  ArrowRight
} from 'lucide-react';
import { templates, getTemplatesByCategory } from '../templates';
import { useEditorStore } from '../store';
import type { Template } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Palette: User,
  BookOpen,
  ClipboardList,
  FileCode: FileText,
  PenTool,
  Users
};

const categoryLabels: Record<Template['category'], { label: string; color: string }> = {
  resume: { label: '简历', color: 'bg-blue-100 text-blue-700' },
  report: { label: '报告', color: 'bg-green-100 text-green-700' },
  readme: { label: 'README', color: 'bg-purple-100 text-purple-700' },
  blog: { label: '博客', color: 'bg-orange-100 text-orange-700' },
  other: { label: '其他', color: 'bg-gray-100 text-gray-700' }
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { createDocument, setCurrentDocument } = useEditorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Template['category'] | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories: { value: Template['category'] | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'resume', label: '简历' },
    { value: 'report', label: '报告' },
    { value: 'readme', label: 'README' },
    { value: 'blog', label: '博客' },
    { value: 'other', label: '其他' }
  ];
  
  const handleUseTemplate = (template: Template) => {
    const doc = createDocument(template.name, template.content);
    setCurrentDocument(doc);
    navigate('/');
  };
  
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">模板库</h1>
          <p className="text-gray-600">选择合适的模板快速开始写作</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">没有找到匹配的模板</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = iconMap[template.icon] || FileText;
              const categoryStyle = categoryLabels[template.category];
              
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${categoryStyle.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.color}`}>
                        {categoryLabels[template.category].label}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 btn-primary text-sm"
                      >
                        使用模板
                      </button>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        预览
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Preview Modal */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{previewTemplate.name}</h2>
                <p className="text-sm text-gray-500">{previewTemplate.description}</p>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <span className="sr-only">关闭</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {previewTemplate.content}
                </pre>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="btn-secondary"
              >
                关闭
              </button>
              <button
                onClick={() => handleUseTemplate(previewTemplate)}
                className="btn-primary gap-2"
              >
                使用此模板
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
