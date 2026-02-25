import { useState, useCallback, useEffect } from 'react'
import { Search, Copy, Check, Trash2, HelpCircle, Regex } from 'lucide-react'
import toast from 'react-hot-toast'

interface Match {
  text: string
  index: number
  groups: string[]
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('[a-z]+')
  const [flags, setFlags] = useState('gi')
  const [testText, setTestText] = useState('Hello World! This is a test.')
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState('')
  const [highlightedText, setHighlightedText] = useState('')
  const [copied, setCopied] = useState(false)

  const testRegex = useCallback(() => {
    if (!pattern.trim()) {
      setMatches([])
      setHighlightedText(testText)
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const newMatches: Match[] = []
      let match

      // Reset lastIndex for global regex
      regex.lastIndex = 0

      while ((match = regex.exec(testText)) !== null) {
        newMatches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        })

        // Prevent infinite loop on zero-width matches
        if (match[0] === '') {
          regex.lastIndex++
        }
      }

      setMatches(newMatches)
      setError('')

      // Create highlighted HTML
      let lastIndex = 0
      let html = ''
      newMatches.forEach((m, i) => {
        html += escapeHtml(testText.slice(lastIndex, m.index))
        html += `<mark class="bg-primary-500/30 text-primary-200 px-1 rounded" title="Match ${i + 1} at position ${m.index}">${escapeHtml(m.text)}</mark>`
        lastIndex = m.index + m.text.length
      })
      html += escapeHtml(testText.slice(lastIndex))
      setHighlightedText(html)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex')
      setMatches([])
      setHighlightedText(testText)
    }
  }, [pattern, flags, testText])

  useEffect(() => {
    testRegex()
  }, [testRegex])

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const copyPattern = async () => {
    try {
      await navigator.clipboard.writeText(`/${pattern}/${flags}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  const commonPatterns = [
    { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: '手机号', pattern: '1[3-9]\\d{9}' },
    { name: 'URL', pattern: 'https?://[^\\s]+' },
    { name: 'IP地址', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
    { name: '日期', pattern: '\\d{4}-\\d{2}-\\d{2}' },
    { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+' },
  ]

  const flagDescriptions: Record<string, string> = {
    g: '全局匹配',
    i: '忽略大小写',
    m: '多行模式',
    s: '单行模式',
    u: 'Unicode',
    y: '粘性匹配',
  }

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <label className="font-medium">正则表达式</label>
          <button
            onClick={copyPattern}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            复制
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl text-gray-500">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式"
            className="input-field font-mono"
          />
          <span className="text-2xl text-gray-500">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags"
            className="input-field w-24 font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(flagDescriptions).map(([flag, desc]) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                flags.includes(flag)
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                  : 'bg-dark-800 text-gray-500 border border-dark-600'
              }`}
              title={desc}
            >
              {flag}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Common Patterns */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <h4 className="font-medium mb-3">常用正则表达式</h4>
        <div className="flex flex-wrap gap-2">
          {commonPatterns.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setPattern(p.pattern)
                setFlags('g')
              }}
              className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-sm rounded-lg transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Test Text */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <Regex className="w-5 h-5 text-purple-400" />
            <span className="font-medium">测试文本</span>
          </div>
          <button
            onClick={() => setTestText('')}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="输入要测试的文本..."
          className="w-full h-40 bg-dark-900 p-4 font-mono text-sm resize-none focus:outline-none"
        />
      </div>

      {/* Results */}
      {matches.length > 0 && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <h4 className="font-medium mb-3">匹配结果 ({matches.length} 个)</h4>
          <div
            className="p-4 bg-dark-800 rounded-lg font-mono text-sm leading-relaxed break-all"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      )}

      {/* Match Details */}
      {matches.length > 0 && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="px-4 py-3 bg-dark-800 border-b border-dark-700">
            <span className="font-medium">匹配详情</span>
          </div>
          <div className="divide-y divide-dark-700">
            {matches.map((match, index) => (
              <div key={index} className="px-4 py-3 flex items-start gap-4">
                <span className="text-sm text-gray-500 w-16">#{index + 1}</span>
                <div className="flex-1">
                  <code className="text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                    {match.text}
                  </code>
                  <span className="text-sm text-gray-500 ml-4">
                    位置: {match.index}
                  </span>
                  {match.groups.length > 0 && (
                    <div className="mt-2 text-sm text-gray-400">
                      捕获组: {match.groups.map((g, i) => `[${i + 1}] ${g || '(empty)'}`).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
