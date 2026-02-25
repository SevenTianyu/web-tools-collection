import { Link } from 'react-router-dom';
import { Sparkles, Mail, Twitter, Github, Youtube } from 'lucide-react';

const footerLinks = {
  tools: [
    { label: 'AI写作工具', href: '/category/writing' },
    { label: 'AI图像工具', href: '/category/image' },
    { label: 'AI视频工具', href: '/category/video' },
    { label: 'AI编程助手', href: '/category/code' },
    { label: 'AI音频工具', href: '/category/audio' },
  ],
  resources: [
    { label: '博客文章', href: '/blog' },
    { label: '工具对比', href: '/compare' },
    { label: '排行榜', href: '/ranking' },
    { label: '使用教程', href: '/blog?category=tutorial' },
    { label: '新闻资讯', href: '/blog?category=news' },
  ],
  company: [
    { label: '关于我们', href: '/about' },
    { label: '联系方式', href: '/contact' },
    { label: '提交工具', href: '/submit' },
    { label: '隐私政策', href: '/privacy' },
    { label: '使用条款', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Mail, href: 'mailto:contact@aitoolsnav.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                AI Tools Nav
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              发现、对比、评测最佳AI工具。我们致力于帮助用户找到最适合的AI工具，提升工作效率和创造力。
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="订阅我们的周刊"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                订阅
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">工具分类</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">资源</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">关于</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 AI Tools Nav. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
