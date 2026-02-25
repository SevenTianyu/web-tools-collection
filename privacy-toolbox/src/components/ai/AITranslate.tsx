import { useState } from 'react'
import { Languages, Copy, Check, ArrowRightLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const LANGUAGES = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' },
  { code: 'th', name: 'ไทย' },
]

// Free translation using LibreTranslate API
const translateText = async (
  text: string,
  source: string,
  target: string
): Promise<string> => {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: source === 'auto' ? 'auto' : source,
        target: target,
        format: 'text',
      }),
    })

    if (!response.ok) {
      throw new Error('Translation failed')
    }

    const data = await response.json()
    return data.translatedText
  } catch (error) {
    // Fallback: simple word-by-word translation simulation
    console.warn('Translation API failed, using fallback:', error)
    return `[翻译服务暂时不可用]\n\n原文:\n${text}\n\n请稍后再试，或使用其他翻译服务。`
  }
}

export default function AITranslate() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('请输入要翻译的文本')
      return
    }

    setIsTranslating(true)
    setTranslatedText('')

    try {
      const result = await translateText(sourceText, sourceLang, targetLang)
      setTranslatedText(result)
      toast.success('翻译完成')
    } catch (error) {
      toast.error('翻译失败，请重试')
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    if (sourceLang === 'auto') {
      toast.error('自动检测语言无法交换')
      return
    }
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const copyToClipboard = async () => {
    if (!translatedText) return
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-500 mb-2">源语言</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="input-field"
            >
              <option value="auto">自动检测</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapLanguages}
            disabled={sourceLang === 'auto'}
            className="mt-6 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-500 mb-2">目标语言</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="input-field"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
            <span className="font-medium">输入文本</span>
            <span className="text-xs text-gray-500">
              {sourceText.length} 字符
            </span>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="请输入要翻译的文本..."
            className="w-full h-64 p-4 bg-dark-900 resize-none focus:outline-none"
          />
        </div>

        {/* Target */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
            <span className="font-medium">翻译结果</span>
            <div className="flex items-center gap-2">
              {translatedText && (
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
              <span className="text-xs text-gray-500">
                {translatedText.length} 字符
              </span>
            </div>
          </div>
          <textarea
            value={translatedText}
            readOnly
            placeholder="翻译结果将显示在这里..."
            className="w-full h-64 p-4 bg-dark-900 resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="btn-primary flex items-center gap-2"
        >
          {isTranslating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              翻译中...
            </>
          ) : (
            <>
              <Languages className="w-5 h-5" />
              翻译
            </>
          )}
        </button>

        <button
          onClick={() => {
            setSourceText('')
            setTranslatedText('')
          }}
          disabled={isTranslating}
          className="btn-outline"
        >
          清空
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400 mb-1">关于翻译服务</h4>
            <p className="text-sm text-gray-400">
              本工具使用 LibreTranslate 免费翻译 API。翻译质量可能不如商业服务，
              但完全免费且无需注册。对于重要文档，建议人工校对。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
