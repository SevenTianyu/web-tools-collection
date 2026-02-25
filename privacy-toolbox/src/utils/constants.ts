import type { Tool } from '@types'

export const TOOLS: Tool[] = [
  // PDF Tools
  {
    id: 'pdf-merge',
    name: 'PDF 合并',
    description: '将多个 PDF 文件合并为一个文件',
    icon: 'FileStack',
    category: 'pdf',
    path: '/pdf/merge',
    meta: {
      title: 'PDF 合并工具 - Privacy Toolbox',
      description: '免费在线 PDF 合并工具，将多个 PDF 文件合并为一个。所有处理在浏览器本地完成，保护您的隐私安全。',
      keywords: 'PDF合并,合并PDF,PDF工具,本地处理,隐私保护'
    }
  },
  {
    id: 'pdf-split',
    name: 'PDF 拆分',
    description: '将 PDF 文件拆分为多个文件',
    icon: 'Scissors',
    category: 'pdf',
    path: '/pdf/split',
    meta: {
      title: 'PDF 拆分工具 - Privacy Toolbox',
      description: '免费在线 PDF 拆分工具，将 PDF 文件按页拆分为多个文件。所有处理在浏览器本地完成。',
      keywords: 'PDF拆分,拆分PDF,PDF工具,本地处理,隐私保护'
    }
  },
  {
    id: 'pdf-compress',
    name: 'PDF 压缩',
    description: '压缩 PDF 文件大小',
    icon: 'Minimize2',
    category: 'pdf',
    path: '/pdf/compress',
    meta: {
      title: 'PDF 压缩工具 - Privacy Toolbox',
      description: '免费在线 PDF 压缩工具，减小 PDF 文件大小。所有处理在浏览器本地完成，不上传服务器。',
      keywords: 'PDF压缩,压缩PDF,PDF工具,本地处理,隐私保护'
    }
  },
  {
    id: 'pdf-to-images',
    name: 'PDF 转图片',
    description: '将 PDF 页面转换为图片格式',
    icon: 'Image',
    category: 'pdf',
    path: '/pdf/to-images',
    meta: {
      title: 'PDF 转图片工具 - Privacy Toolbox',
      description: '免费在线 PDF 转图片工具，将 PDF 页面转换为 JPG/PNG 格式。所有处理在浏览器本地完成。',
      keywords: 'PDF转图片,PDF转JPG,PDF转PNG,PDF工具,本地处理'
    }
  },
  // Image Tools
  {
    id: 'image-compress',
    name: '图片压缩',
    description: '压缩图片文件大小，保持质量',
    icon: 'ImageMinus',
    category: 'image',
    path: '/image/compress',
    meta: {
      title: '图片压缩工具 - Privacy Toolbox',
      description: '免费在线图片压缩工具，支持 JPG、PNG、WebP 格式。智能压缩，保持画质。所有处理在浏览器本地完成。',
      keywords: '图片压缩,压缩图片,JPG压缩,PNG压缩,WebP压缩,本地处理'
    }
  },
  {
    id: 'image-convert',
    name: '图片格式转换',
    description: '转换图片格式，支持多种格式',
    icon: 'RefreshCw',
    category: 'image',
    path: '/image/convert',
    meta: {
      title: '图片格式转换工具 - Privacy Toolbox',
      description: '免费在线图片格式转换工具，支持 JPG、PNG、WebP、GIF 等格式互转。所有处理在浏览器本地完成。',
      keywords: '图片格式转换,JPG转PNG,PNG转WebP,图片转换,本地处理'
    }
  },
  {
    id: 'image-resize',
    name: '图片调整大小',
    description: '调整图片尺寸，支持批量处理',
    icon: 'Maximize',
    category: 'image',
    path: '/image/resize',
    meta: {
      title: '图片调整大小工具 - Privacy Toolbox',
      description: '免费在线图片调整大小工具，自定义尺寸，保持比例。支持批量处理，所有处理在浏览器本地完成。',
      keywords: '图片调整大小,图片尺寸,图片缩放,批量处理,本地处理'
    }
  },
  {
    id: 'image-watermark',
    name: '图片水印',
    description: '为图片添加文字或图片水印',
    icon: 'Droplet',
    category: 'image',
    path: '/image/watermark',
    meta: {
      title: '图片水印工具 - Privacy Toolbox',
      description: '免费在线图片水印工具，添加文字水印，自定义位置、大小、透明度。所有处理在浏览器本地完成。',
      keywords: '图片水印,加水印,文字水印,图片保护,本地处理'
    }
  },
  // Text Tools
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、验证和压缩 JSON',
    icon: 'Braces',
    category: 'text',
    path: '/text/json-formatter',
    meta: {
      title: 'JSON 格式化工具 - Privacy Toolbox',
      description: '免费在线 JSON 格式化工具，美化、验证、压缩 JSON 数据。支持语法高亮，本地处理保护隐私。',
      keywords: 'JSON格式化,JSON美化,JSON验证,JSON压缩,JSON工具'
    }
  },
  {
    id: 'code-minifier',
    name: '代码压缩',
    description: '压缩 JavaScript、CSS、HTML 代码',
    icon: 'Shrink',
    category: 'text',
    path: '/text/code-minifier',
    meta: {
      title: '代码压缩工具 - Privacy Toolbox',
      description: '免费在线代码压缩工具，压缩 JavaScript、CSS、HTML。减小文件体积，本地处理保护隐私。',
      keywords: '代码压缩,JS压缩,CSS压缩,HTML压缩,代码优化'
    }
  },
  {
    id: 'regex-tester',
    name: '正则表达式测试',
    description: '测试和调试正则表达式',
    icon: 'Search',
    category: 'text',
    path: '/text/regex-tester',
    meta: {
      title: '正则表达式测试工具 - Privacy Toolbox',
      description: '免费在线正则表达式测试工具，实时匹配、高亮显示、解释说明。本地处理，输入数据不会上传。',
      keywords: '正则表达式,Regex测试,正则测试,正则调试,正则工具'
    }
  },
  {
    id: 'markdown-editor',
    name: 'Markdown 编辑器',
    description: '在线 Markdown 编辑和预览',
    icon: 'FileText',
    category: 'text',
    path: '/text/markdown-editor',
    meta: {
      title: 'Markdown 编辑器 - Privacy Toolbox',
      description: '免费在线 Markdown 编辑器，实时预览，支持导出 HTML 和 PDF。本地处理，文档不会上传服务器。',
      keywords: 'Markdown编辑器,MD编辑器,Markdown预览,Markdown工具'
    }
  },
  // AI Tools
  {
    id: 'ai-translate',
    name: 'AI 翻译',
    description: '使用 AI 进行智能翻译',
    icon: 'Languages',
    category: 'ai',
    path: '/ai/translate',
    meta: {
      title: 'AI 翻译工具 - Privacy Toolbox',
      description: '免费 AI 翻译工具，支持多种语言互译。使用免费 AI API，无需注册，快速准确。',
      keywords: 'AI翻译,智能翻译,免费翻译,在线翻译,翻译工具'
    }
  },
  {
    id: 'ai-summarize',
    name: 'AI 文本总结',
    description: '自动总结长文本内容',
    icon: 'ClipboardList',
    category: 'ai',
    path: '/ai/summarize',
    meta: {
      title: 'AI 文本总结工具 - Privacy Toolbox',
      description: '免费 AI 文本总结工具，自动提取关键信息，生成摘要。使用免费 AI API，快速高效。',
      keywords: 'AI总结,文本总结,自动摘要,文章总结,AI工具'
    }
  },
  {
    id: 'ai-generate',
    name: 'AI 文本生成',
    description: '使用 AI 生成文本内容',
    icon: 'Sparkles',
    category: 'ai',
    path: '/ai/generate',
    meta: {
      title: 'AI 文本生成工具 - Privacy Toolbox',
      description: '免费 AI 文本生成工具，根据提示生成文章、段落、创意内容。使用免费 AI API。',
      keywords: 'AI生成,文本生成,AI写作,智能写作,AI工具'
    }
  }
]

export const CATEGORIES = [
  { id: 'pdf', name: 'PDF 工具', icon: 'FileText', color: 'text-red-400', bgColor: 'bg-red-400/10' },
  { id: 'image', name: '图片工具', icon: 'Image', color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  { id: 'text', name: '文本工具', icon: 'Type', color: 'text-green-400', bgColor: 'bg-green-400/10' },
  { id: 'ai', name: 'AI 工具', icon: 'Brain', color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
] as const

export const ACCEPTED_IMAGE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp']
}

export const ACCEPTED_PDF_TYPES = {
  'application/pdf': ['.pdf']
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
