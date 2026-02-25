import { useState, useCallback } from 'react'
import { Shrink, Copy, Check, Trash2, FileCode, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Editor from '@monaco-editor/react'

type Language = 'javascript' | 'css' | 'html' | 'json'

export default function CodeMinifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [copied, setCopied] = useState(false)

  const minifyJS = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, ';}') // Remove space before }
      .replace(/{\s*/g, '{') // Remove space after {
      .replace(/}\s*/g, '}') // Remove space after }
      .replace(/;\s*/g, ';') // Remove space after ;
      .replace(/,\s*/g, ',') // Remove space after ,
      .replace(/:\s*/g, ':') // Remove space after :
      .trim()
  }

  const minifyCSS = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around operators
      .trim()
  }

  const minifyHTML = (code: string): string => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim()
  }

  const minifyJSON = (code: string): string => {
    return JSON.stringify(JSON.parse(code))
  }

  const minify = useCallback(() => {
    if (!input.trim()) {
      toast.error('请输入代码')
      return
    }

    try {
      let result = ''
      switch (language) {
        case 'javascript':
          result = minifyJS(input)
          break
        case 'css':
          result = minifyCSS(input)
          break
        case 'html':
          result = minifyHTML(input)
          break
        case 'json':
          result = minifyJSON(input)
          break
      }
      setOutput(result)
      
      const saved = input.length - result.length
      const percentage = ((saved / input.length) * 100).toFixed(1)
      toast.success(`压缩完成！节省了 ${saved} 个字符 (${percentage}%)`)
    } catch (error) {
      toast.error('压缩失败，请检查代码语法')
    }
  }, [input, language])

  const copyToClipboard = async () => {
    if (!output) return
    
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  const downloadOutput = () => {
    if (!output) return
    
    const extensions: Record<Language, string> = {
      javascript: 'js',
      css: 'css',
      html: 'html',
      json: 'json',
    }
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `minified.${extensions[language]}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('文件已下载')
  }

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'css', label: 'CSS' },
    { value: 'html', label: 'HTML' },
    { value: 'json', label: 'JSON' },
  ]

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <label className="block text-sm text-gray-500 mb-3">选择语言</label>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLanguage(opt.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                language === opt.value
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-dark-600 text-gray-400 hover:border-dark-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              <span className="font-medium">原始代码</span>
            </div>
            <button
              onClick={() => setInput('')}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="h-96">
            <Editor
              value={input}
              onChange={(value) => setInput(value || '')}
              language={language}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <Shrink className="w-5 h-5 text-primary-400" />
              <span className="font-medium">压缩结果</span>
            </div>
            <div className="flex items-center gap-2">
              {output && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={downloadOutput}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="h-96">
            <Editor
              value={output}
              language={language}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: true,
                automaticLayout: true,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={minify} className="btn-primary flex items-center gap-2">
          <Shrink className="w-5 h-5" />
          压缩代码
        </button>
      </div>

      {/* Stats */}
      {output && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">原始大小</p>
              <p className="text-lg font-semibold">{input.length.toLocaleString()} 字符</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">压缩后</p>
              <p className="text-lg font-semibold">{output.length.toLocaleString()} 字符</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">节省</p>
              <p className="text-lg font-semibold text-emerald-400">
                {((1 - output.length / input.length) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
