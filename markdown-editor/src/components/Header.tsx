import { useState, useRef } from 'react';
import { 
  Menu, 
  FileText, 
  LayoutTemplate, 
  Download, 
  Settings,
  Moon,
  Sun,
  Keyboard,
  Info
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEditorStore } from '../store';
import ImportExportModal from './ImportExportModal';
import ShortcutsModal from './ShortcutsModal';
import AboutModal from './AboutModal';

export default function Header() {
  const location = useLocation();
  const { toggleSidebar, settings, updateSettings } = useEditorStore();
  const [showImportExport, setShowImportExport] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: FileText, label: '编辑器' },
    { path: '/templates', icon: LayoutTemplate, label: '模板' },
    { path: '/export', icon: Download, label: '导出' },
  ];
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="切换侧边栏"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowImportExport(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="导入/导出"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="切换主题"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={() => setShowShortcuts(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="快捷键"
          >
            <Keyboard className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="设置"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowAbout(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="关于"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Modals */}
      {showImportExport && (
        <ImportExportModal onClose={() => setShowImportExport(false)} />
      )}
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}

// Settings Modal Component
function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useEditorStore();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">设置</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="sr-only">关闭</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">自动保存</label>
              <p className="text-xs text-gray-500">自动保存到本地存储</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.autoSave}
                onChange={(e) => updateSettings({ autoSave: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          {/* Sync Scroll */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">同步滚动</label>
              <p className="text-xs text-gray-500">编辑器和预览同步滚动</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.syncScroll}
                onChange={(e) => updateSettings({ syncScroll: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">自动换行</label>
              <p className="text-xs text-gray-500">编辑器自动换行</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.wordWrap}
                onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="text-sm font-medium text-gray-900">字体大小</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="12"
                max="20"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 w-8">{settings.fontSize}px</span>
            </div>
          </div>
          
          {/* Auto Save Interval */}
          {settings.autoSave && (
            <div>
              <label className="text-sm font-medium text-gray-900">自动保存间隔</label>
              <select
                value={settings.autoSaveInterval}
                onChange={(e) => updateSettings({ autoSaveInterval: parseInt(e.target.value) })}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="10000">10秒</option>
                <option value="30000">30秒</option>
                <option value="60000">1分钟</option>
                <option value="300000">5分钟</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
