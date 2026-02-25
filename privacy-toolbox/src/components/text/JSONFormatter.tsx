import { useState, useCallback } from 'react'
import { Braces, Copy, Check, Trash2, FileJson, Minimize2, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Editor from '@monaco-editor/react'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)
  const [copied, setCopied] = useState(false)

  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      toast.error('请输入 JSON 内容')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(
        parsed,
        sortKeys ? Object.keys(parsed).sort() : null,
        indent
      )
      setOutput(formatted)
      setError('')
      toast.success('格式化成功')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      toast.error('JSON 格式错误')
    }
  }, [input, indent, sortKeys])

  const minifyJSON = useCallback(() => {
    if (!input.trim()) {
      toast.error('请输入 JSON 内容')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
      
      const saved = input.length - minified.length
      toast.success(`压缩成功，节省了 ${saved} 个字符`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      toast.error('JSON 格式错误')
    }
  }, [input])

  const validateJSON = useCallback(() => {
    if (!input.trim()) {
      toast.error('请输入 JSON 内容')
      return
    }

    try {
      JSON.parse(input)
      setError('')
      toast.success('JSON 格式正确 ✓')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      toast.error('JSON 格式错误')
    }
  }, [input])

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

  const escapeJSON = () => {
    if (!input.trim()) {
      toast.error('请输入 JSON 内容')
      return
    }

    try {
      const escaped = JSON.stringify(input)
      setOutput(escaped)
      setError('')
      toast.success('转义成功')
    } catch (err) {
      toast.error('转义失败')
    }
  }

  const unescapeJSON = () => {
    if (!input.trim()) {
      toast.error('请输入 JSON 内容')
      return
    }

    try {
      const unescaped = JSON.parse(input)
      if (typeof unescaped === 'string') {
        setOutput(unescaped)
        setError('')
        toast.success('反转义成功')
      } else {
        setOutput(JSON.stringify(unescaped, null, indent))
        setError('')
        toast.success('解析成功')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      toast.error('解析失败')
    }
  }

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">缩进:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="input-field py-2 w-24"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={8}>8 空格</option>
              <option value={0}>制表符</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-500">排序键名</span>
          </label>
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-green-400" />
              <span className="font-medium">输入</span>
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
              language="json"
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <Braces className="w-5 h-5 text-primary-400" />
              <span className="font-medium">输出</span>
            </div>
            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
          <div className="h-96">
            {error ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-red-400 mb-2">❌ JSON 错误</div>
                  <p className="text-sm text-gray-500">{error}</p>
                </div>
              </div>
            ) : (
              <Editor
                value={output}
                language="json"
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: true,
                  automaticLayout: true,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={formatJSON} className="btn-primary flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          格式化
        </button>
        <button onClick={minifyJSON} className="btn-secondary flex items-center gap-2">
          <Minimize2 className="w-5 h-5" />
          压缩
        </button>
        <button onClick={validateJSON} className="btn-outline flex items-center gap-2">
          <Check className="w-5 h-5" />
          验证
        </button>
        <button onClick={escapeJSON} className="btn-outline flex items-center gap-2">
          转义
        </button>
        <button onClick={unescapeJSON} className="btn-outline flex items-center gap-2">
          反转义
        </button>
      </div>

      {/* Stats */}
      {output && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">原始大小</p>
              <p className="text-lg font-semibold">{input.length} 字符</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">输出大小</p>
              <p className="text-lg font-semibold">{output.length} 字符</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">差异</p>
              <p className={`text-lg font-semibold ${output.length > input.length ? 'text-red-400' : 'text-emerald-400'}`}>
                {output.length - input.length > 0 ? '+' : ''}{output.length - input.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
