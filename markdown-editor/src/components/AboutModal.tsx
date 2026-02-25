import { X, Github, Heart, Coffee, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  const version = '1.0.0';
  
  const features = [
    { icon: '📝', title: '实时预览', desc: '所见即所得的编辑体验' },
    { icon: '📄', title: '多格式导出', desc: '支持 PDF、Word、HTML' },
    { icon: '🧠', title: '思维导图', desc: '自动生成思维导图' },
    { icon: '📊', title: '表格生成器', desc: '可视化编辑表格' },
    { icon: '🎨', title: '模板库', desc: '丰富的文档模板' },
    { icon: '💾', title: '自动保存', desc: '本地存储，永不丢失' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">关于</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Markdown Editor</h1>
            <p className="text-sm text-gray-500 mt-1">极简在线 Markdown 编辑器</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
              v{version}
            </span>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-sm font-medium text-gray-900">{title}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
          
          {/* Tech Stack */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand'].map(tech => (
                <span key={tech} className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-secondary gap-2 text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="#"
              className="flex-1 btn-secondary gap-2 text-sm"
            >
              <Coffee className="w-4 h-4" />
              打赏支持
            </a>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            用 <Heart className="w-3 h-3 text-red-500" /> 构建 · © 2024 Markdown Editor
          </p>
        </div>
      </div>
    </div>
  );
}
