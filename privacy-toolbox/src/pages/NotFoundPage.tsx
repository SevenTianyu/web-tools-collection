import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>页面未找到 - Privacy Toolbox</title>
        <meta name="description" content="您访问的页面不存在。返回 Privacy Toolbox 首页探索更多隐私优先的工具。" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          
          <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页探索更多工具。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-5 h-5" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
