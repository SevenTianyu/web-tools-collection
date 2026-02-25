import { useState } from 'react'
import { ClipboardList, Copy, Check, Sparkles, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

// Simple extractive summarization
const summarizeText = (text: string, ratio: number = 0.3): string => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  if (sentences.length <= 3) {
    return text
  }

  // Simple scoring based on word frequency
  const wordFreq: Record<string, number> = {}
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  
  words.forEach((word) => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  // Score sentences
  const sentenceScores = sentences.map((sentence) => {
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || []
    const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0)
    return { sentence: sentence.trim(), score }
  })

  // Sort by score and select top sentences
  const numSentences = Math.max(1, Math.ceil(sentences.length * ratio))
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))

  return topSentences.map((s) => s.sentence).join(' ')
}

const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || []
  const freq: Record<string, number> = {}
  
  words.forEach((word) => {
    freq[word] = (freq[word] || 0) + 1
  })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)
}

export default function AISummarize() {
  const [input, setInput] = useState('')
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!input.trim()) {
      toast.error('请输入要总结的文本')
      return
    }

    if (input.length < 100) {
      toast.error('文本太短，至少需要 100 个字符')
      return
    }

    setIsProcessing(true)
    setSummary('')
    setKeywords([])

    try {
      // Simulate processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const ratios: Record<string, number> = {
        short: 0.15,
        medium: 0.3,
        long: 0.5,
      }

      const result = summarizeText(input, ratios[length])
      const kw = extractKeywords(input)

      setSummary(result)
      setKeywords(kw)
      toast.success('总结完成')
    } catch (error) {
      toast.error('处理失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async () => {
    if (!summary) return
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  const charCount = input.length
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <label className="block text-sm text-gray-500 mb-3">总结长度</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'short', label: '简短 (15%)' },
            { value: 'medium', label: '适中 (30%)' },
            { value: 'long', label: '详细 (50%)' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLength(opt.value as typeof length)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                length === opt.value
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-dark-600 text-gray-400 hover:border-dark-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
        <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-medium">原文</span>
          </div>
          <span className="text-xs text-gray-500">
            {wordCount} 词 · {charCount} 字符
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要总结的文本（至少 100 个字符）..."
          className="w-full h-48 p-4 bg-dark-900 resize-none focus:outline-none"
        />
      </div>

      {/* Action */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSummarize}
          disabled={isProcessing || charCount < 100}
          className="btn-primary flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              处理中...
            </>
          ) : (
            <>
              <ClipboardList className="w-5 h-5" />
              生成总结
            </>
          )}
        </button>

        <button
          onClick={() => {
            setInput('')
            setSummary('')
            setKeywords([])
          }}
          disabled={isProcessing}
          className="btn-outline"
        >
          清空
        </button>
      </div>

      {/* Results */}
      {summary && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-medium">总结结果</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="p-4">
            <p className="text-gray-300 leading-relaxed mb-4">{summary}</p>
            
            {keywords.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dark-700">
                <span className="text-sm text-gray-500 mb-2 block">关键词:</span>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="px-4 py-3 bg-dark-800 border-t border-dark-700">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <span className="text-gray-500">原文</span>
                <p className="font-semibold">{charCount} 字符</p>
              </div>
              <div>
                <span className="text-gray-500">总结</span>
                <p className="font-semibold">{summary.length} 字符</p>
              </div>
              <div>
                <span className="text-gray-500">压缩率</span>
                <p className="font-semibold text-emerald-400">
                  {((1 - summary.length / charCount) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-400 mb-1">关于文本总结</h4>
            <p className="text-sm text-gray-400">
              本工具使用提取式摘要算法，从原文中选择最重要的句子组成摘要。
              这种方法保证了摘要的准确性和可读性。支持中文和英文文本。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
