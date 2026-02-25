import { useState, useCallback, useEffect } from 'react'
import { FileText, Eye, Edit3, Download, Copy, Check, Split } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import toast from 'react-hot-toast'

const defaultContent = `# 欢迎使用 Markdown 编辑器

这是一个**实时预览**的 Markdown 编辑器。

## 功能特点

- 📝 实时预览
- 🎨 语法高亮
- 📤 导出 HTML
- 💾 本地保存

## 示例

### 代码块
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 表格
| 功能 | 状态 |
|------|------|
| 实时预览 | ✅ |
| 导出 | ✅ |
| 本地保存 | ✅ |

### 列表
1. 第一项
2. 第二项
3. 第三项

> 这是一段引用文本

[链接示例](https://example.com)

![图片示例](https://via.placeholder.com/400x200)
`

export default function MarkdownEditor() {
  const [content, setContent] = useState(defaultContent)
  const [html, setHtml] = useState('')
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split')
  const [copied, setCopied] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const rawHtml = await marked(content, {
          breaks: true,
          gfm: true,
        })
        const cleanHtml = DOMPurify.sanitize(rawHtml)
        setHtml(cleanHtml)
      } catch (error) {
        console.error('Markdown parse error:', error)
      }
    }
    parseMarkdown()

    // Update counts
    setCharCount(content.length)
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length)
  }, [content])

  const copyHTML = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('HTML 已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  const downloadHTML = () => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Markdown</title>
  <style>
    body { max-width: 800px; margin: 0 auto; padding: 40px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f4f4f4; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${html}
</body>
</html>`
    
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markdown-export-${Date.now()}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('HTML 文件已下载')
  }

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Markdown 文件已下载')
  }

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = before + selectedText + after
    
    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const toolbarButtons = [
    { icon: 'B', title: '粗体', action: () => insertText('**', '**') },
    { icon: 'I', title: '斜体', action: () => insertText('*', '*') },
    { icon: 'H1', title: '标题 1', action: () => insertText('# ') },
    { icon: 'H2', title: '标题 2', action: () => insertText('## ') },
    { icon: 'H3', title: '标题 3', action: () => insertText('### ') },
    { icon: '```', title: '代码块', action: () => insertText('```\n', '\n```') },
    { icon: '>', title: '引用', action: () => insertText('> ') },
    { icon: '-', title: '列表', action: () => insertText('- ') },
    { icon: '[]', title: '链接', action: () => insertText('[', '](url)') },
    { icon: '![]', title: '图片', action: () => insertText('![alt](', ')') },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-2 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              title={btn.title}
              className="px-3 py-1.5 text-sm font-mono bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-dark-700 mx-2" />

        <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('edit')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'edit' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white'
            }`}
            title="编辑"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'split' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white'
            }`}
            title="分屏"
          >
            <Split className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'preview' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white'
            }`}
            title="预览"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={downloadMarkdown}
          className="btn-outline text-sm py-1.5 px-3"
        >
          下载 MD
        </button>
        <button
          onClick={downloadHTML}
          className="btn-outline text-sm py-1.5 px-3"
        >
          导出 HTML
        </button>
      </div>

      {/* Editor */}
      <div className={`grid gap-4 ${
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* Edit Panel */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
            <div className="px-4 py-2 bg-dark-800 border-b border-dark-700 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium">编辑</span>
              <span className="text-xs text-gray-500 ml-auto">
                {wordCount} 词 · {charCount} 字符
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[500px] p-4 bg-dark-900 font-mono text-sm resize-none focus:outline-none leading-relaxed"
              placeholder="输入 Markdown 内容..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
            <div className="px-4 py-2 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">预览</span>
              </div>
              <button
                onClick={copyHTML}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                复制 HTML
              </button>
            </div>
            <div
              className="h-[500px] p-4 overflow-auto prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
