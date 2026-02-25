import { Link } from 'react-router-dom'
import { Shield, Github, Twitter, Heart } from 'lucide-react'
import { TOOLS } from '@utils/constants'

export default function Footer() {
  const categories = [...new Set(TOOLS.map((t) => t.category))]

  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Privacy Toolbox</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              隐私优先的 All-in-One 工具箱。所有数据处理均在浏览器本地完成，保护您的隐私安全。
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tool Categories */}
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                {category} 工具
              </h3>
              <ul className="space-y-2">
                {TOOLS.filter((t) => t.category === category).slice(0, 4).map((tool) => (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Privacy Toolbox. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for privacy
          </p>
        </div>
      </div>
    </footer>
  )
}
