import { Helmet } from 'react-helmet-async'
import { Shield, Lock, Cpu, Zap } from 'lucide-react'
import ToolGrid from '@components/common/ToolGrid'
import { CATEGORIES } from '@utils/constants'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: '隐私优先',
      description: '所有数据处理均在浏览器本地完成，永远不会上传到服务器'
    },
    {
      icon: Lock,
      title: '安全可靠',
      description: '您的文件仅在您的设备上处理，确保数据绝对安全'
    },
    {
      icon: Cpu,
      title: '离线可用',
      description: '支持 PWA，安装后可离线使用所有工具'
    },
    {
      icon: Zap,
      title: '快速高效',
      description: '利用浏览器原生能力，处理速度极快'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Privacy Toolbox - 隐私优先的 All-in-One 工具箱</title>
        <meta name="description" content="隐私优先的 All-in-One 工具箱。PDF工具、图片处理、文本编辑、AI助手，所有数据处理均在浏览器本地完成，保护您的隐私安全。" />
        <meta name="keywords" content="隐私工具,PDF工具,图片压缩,文本编辑器,本地处理,离线工具,PWA" />
        <link rel="canonical" href="https://privacy-toolbox.app" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium mb-8 border border-emerald-500/20 animate-fade-in">
            <Lock className="w-4 h-4" />
            <span>100% 本地处理，保护您的隐私</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
            <span className="text-gradient">Privacy Toolbox</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up animate-delay-100">
            隐私优先的 All-in-One 工具箱。PDF处理、图片编辑、文本转换、AI助手——
            <span className="text-white">所有数据都在您的浏览器中处理</span>，
            永远不会上传。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up animate-delay-200">
            <a href="#tools" className="btn-primary inline-flex items-center gap-2">
              <Zap className="w-5 h-5" />
              开始使用
            </a>
            <a href="#features" className="btn-outline inline-flex items-center gap-2">
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">为什么选择 Privacy Toolbox？</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              我们致力于提供安全、高效、隐私优先的工具，让您的数据始终掌握在您手中
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 bg-dark-800 rounded-2xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">功能强大的工具集</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              我们提供多种类别的工具，满足您的各种需求
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className={`p-6 rounded-2xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300 text-center group ${category.bgColor}`}
              >
                <span className={`text-2xl mb-2 block ${category.color}`}>
                  {category.name.charAt(0)}
                </span>
                <span className="font-medium text-white group-hover:text-primary-400 transition-colors">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
          
          <ToolGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-r from-primary-900/50 to-purple-900/50 rounded-3xl border border-primary-500/20">
          <h2 className="text-3xl font-bold mb-4">开始使用 Privacy Toolbox</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            无需注册，无需安装，打开即可使用。支持 PWA，可以安装到您的设备上离线使用。
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            立即体验
          </button>
        </div>
      </section>
    </>
  )
}
