import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Moon, Sun, Monitor, Search, Menu, X, Command, Github,
  Wrench, ChevronRight
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { tools } from '@/utils/tools';
import type { Theme } from '@/types';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
    { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'Auto' },
  ];

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`p-2 rounded-md transition-colors ${
            theme === t.value
              ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Open search
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    onClose();
    setQuery('');
  }, [location.pathname]);

  if (!isOpen) return null;

  const filteredTools = query
    ? tools.filter(
        t =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 ml-3 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
            ESC
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredTools.length > 0 ? (
            <div className="p-2">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="flex items-center px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center text-gray-500">
              No tools found for "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Type to search tools...
            </div>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 flex items-center justify-between">
          <span>Press <kbd className="px-1 bg-white dark:bg-gray-700 rounded">Enter</kbd> to select</span>
          <span><kbd className="px-1 bg-white dark:bg-gray-700 rounded">↑↓</kbd> to navigate</span>
        </div>
      </div>
    </div>
  );
}

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl lg:hidden animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl">DevToolkit</span>
          </Link>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              onClick={onClose}
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default function Layout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <Wrench className="w-7 h-7 text-blue-600" />
                <span className="font-bold text-xl hidden sm:block">DevToolkit</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search...</span>
                <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded">⌘K</kbd>
              </button>
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              <ThemeToggle />
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2024 Dev Toolkit. All tools run locally in your browser.</p>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
