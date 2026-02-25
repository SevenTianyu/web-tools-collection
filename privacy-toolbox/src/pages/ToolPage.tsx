import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Tool } from '@types'
import PDFMerge from '@components/pdf/PDFMerge'
import PDFSplit from '@components/pdf/PDFSplit'
import PDFCompress from '@components/pdf/PDFCompress'
import PDFToImages from '@components/pdf/PDFToImages'
import ImageCompress from '@components/image/ImageCompress'
import ImageConvert from '@components/image/ImageConvert'
import ImageResize from '@components/image/ImageResize'
import ImageWatermark from '@components/image/ImageWatermark'
import JSONFormatter from '@components/text/JSONFormatter'
import CodeMinifier from '@components/text/CodeMinifier'
import RegexTester from '@components/text/RegexTester'
import MarkdownEditor from '@components/text/MarkdownEditor'
import AITranslate from '@components/ai/AITranslate'
import AISummarize from '@components/ai/AISummarize'
import AIGenerate from '@components/ai/AIGenerate'

interface ToolPageProps {
  tool: Tool
}

const toolComponents: Record<string, React.ComponentType> = {
  'pdf-merge': PDFMerge,
  'pdf-split': PDFSplit,
  'pdf-compress': PDFCompress,
  'pdf-to-images': PDFToImages,
  'image-compress': ImageCompress,
  'image-convert': ImageConvert,
  'image-resize': ImageResize,
  'image-watermark': ImageWatermark,
  'json-formatter': JSONFormatter,
  'code-minifier': CodeMinifier,
  'regex-tester': RegexTester,
  'markdown-editor': MarkdownEditor,
  'ai-translate': AITranslate,
  'ai-summarize': AISummarize,
  'ai-generate': AIGenerate,
}

export default function ToolPage({ tool }: ToolPageProps) {
  const ToolComponent = toolComponents[tool.id]

  if (!ToolComponent) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">工具开发中</h1>
        <p className="text-gray-400 mb-8">该工具正在开发中，敬请期待...</p>
        <Link to="/" className="btn-primary">返回首页</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{tool.meta.title}</title>
        <meta name="description" content={tool.meta.description} />
        <meta name="keywords" content={tool.meta.keywords} />
        <link rel="canonical" href={`https://privacy-toolbox.app${tool.path}`} />
      </Helmet>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">首页</Link>
            <span>/</span>
            <span className="capitalize">{tool.category}</span>
            <span>/</span>
            <span className="text-white">{tool.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              返回工具列表
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <div className="privacy-badge">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                本地处理
              </div>
            </div>
            
            <p className="text-gray-400 max-w-2xl">{tool.description}</p>
          </div>

          {/* Tool Content */}
          <div className="glass-panel p-6 sm:p-8">
            <ToolComponent />
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 mt-0.5 text-emerald-400">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">隐私保护承诺</h3>
                <p className="text-sm text-gray-400">
                  您的文件和数据仅在此设备的浏览器中处理，<strong className="text-white">永远不会上传到任何服务器</strong>。
                  处理完成后，所有临时数据将立即清除。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
