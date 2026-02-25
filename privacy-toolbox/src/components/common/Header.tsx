import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Shield, Download } from 'lucide-react'
import { TOOLS } from '@utils/constants'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check if PWA is installable
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setShowInstallPrompt(true)
    })
  }, [])

  const categories = [...new Set(TOOLS.map((t) => t.category))]

  const getCategoryTools = (category: string) => {
    return TOOLS.filter((t) => t.category === category)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-900/90 backdrop-blur-xl border-b border-dark-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Privacy Toolbox</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              首页
            </Link>
            
            {categories.map((category) => (
              <div key={category} className="relative group">
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors capitalize">
                  {category} 工具
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 py-2 bg-dark-800 rounded-xl border border-dark-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {getCategoryTools(category).map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {showInstallPrompt && (
              <button
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
                onClick={() => {
                  // Trigger install prompt
                }}
              >
                <Download className="w-4 h-4" />
                安装应用
              </button>
            )}
            
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-dark-800 border-b border-dark-700">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-white font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            
            {categories.map((category) => (
              <div key={category}>
                <span className="block text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                  {category} 工具
                </span>
                <div className="space-y-1 ml-4">
                  {getCategoryTools(category).map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="block text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
