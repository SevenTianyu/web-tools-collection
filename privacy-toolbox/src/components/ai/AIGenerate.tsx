import { useState } from 'react'
import { Sparkles, Copy, Check, Wand2, Lightbulb, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface PromptTemplate {
  id: string
  name: string
  description: string
  prompt: string
}

const TEMPLATES: PromptTemplate[] = [
  {
    id: 'paragraph',
    name: '段落生成',
    description: '根据主题生成一段文字',
    prompt: '请写一段关于"{topic}"的文字，大约100-200字：',
  },
  {
    id: 'email',
    name: '邮件模板',
    description: '生成专业邮件',
    prompt: '请写一封关于"{topic}"的正式邮件：',
  },
  {
    id: 'social',
    name: '社交媒体',
    description: '生成社交媒体帖子',
    prompt: '请写一条关于"{topic}"的社交媒体帖子（简洁有趣）：',
  },
  {
    id: 'idea',
    name: '创意点子',
    description: '生成创意想法',
    prompt: '请提供5个关于"{topic}"的创意点子：',
  },
  {
    id: 'description',
    name: '产品描述',
    description: '生成产品描述',
    prompt: '请写一段关于"{topic}"的产品描述：',
  },
]

// Simple text generation using template-based approach
const generateText = (template: PromptTemplate, topic: string): string => {
  const prompts: Record<string, string[]> = {
    paragraph: [
      `${topic}是一个引人入胜的话题。它不仅影响着我们日常生活的方方面面，还在不断推动着社会的进步与发展。通过深入了解${topic}，我们能够更好地把握时代脉搏，做出更明智的决策。`,
      `谈到${topic}，我们不得不提到它在我们生活中的重要性。无论是个人成长还是社会发展，${topic}都扮演着不可或缺的角色。让我们一起探索这个话题的更多可能性。`,
      `${topic}正在改变我们的世界。从技术创新到思维方式，它带来的影响是深远的。理解和掌握${topic}，将成为未来发展的关键能力。`,
    ],
    email: [
      `主题：关于${topic}的讨论\n\n尊敬的先生/女士，\n\n希望这封邮件能找到您。我写这封邮件是想和您讨论关于${topic}的事宜。\n\n我们相信这个话题对双方都很重要，期待能听到您的想法和建议。\n\n如果您方便的话，我们可以安排一个时间来详细讨论。\n\n期待您的回复。\n\n此致敬礼`,
    ],
    social: [
      `🚀 ${topic}真的太有意思了！你有没有想过它会如何改变我们的生活？#${topic.replace(/\s+/g, '')} #新发现`,
      `💡 今天学到了关于${topic}的新知识，分享给大家！有什么想法欢迎留言讨论 👇`,
      `✨ ${topic} - 这个话题值得每个人关注！你怎么看？`,
    ],
    idea: [
      `1. 创建一个关于${topic}的在线社区\n2. 开发一款帮助学习${topic}的App\n3. 举办${topic}主题的线下活动\n4. 制作${topic}相关的视频内容\n5. 编写一本关于${topic}的电子书`,
    ],
    description: [
      `这款${topic}产品采用创新设计，为用户带来卓越体验。它不仅功能强大，而且易于使用，是您理想的选择。`,
      `体验全新的${topic}，感受科技带来的便利。精心设计，品质保证，让生活更美好。`,
    ],
  }

  const options = prompts[template.id] || prompts.paragraph
  return options[Math.floor(Math.random() * options.length)]
}

export default function AIGenerate() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(TEMPLATES[0])
  const [topic, setTopic] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('请输入主题')
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = generateText(selectedTemplate, topic)
      setGeneratedText(result)
      setHistory((prev) => [result, ...prev].slice(0, 5))
      toast.success('生成成功')
    } catch (error) {
      toast.error('生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedText) return
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  const regenerate = () => {
    if (!topic.trim()) return
    handleGenerate()
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <label className="block text-sm text-gray-500 mb-3">选择模板</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedTemplate.id === template.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Topic Input */}
      <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
        <label className="block text-sm text-gray-500 mb-2">
          输入主题 / 关键词
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：人工智能、环保、健康饮食..."
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="btn-primary flex items-center gap-2"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            生成
          </button>
        </div>
      </div>

      {/* Generated Text */}
      {generatedText && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
          <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              <span className="font-medium">生成结果</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={regenerate}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="重新生成"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="prose prose-invert prose-sm max-w-none">
              {generatedText.split('\n').map((line, i) => (
                <p key={i} className="text-gray-300 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
          <h4 className="font-medium mb-3">历史记录</h4>
          <div className="space-y-2">
            {history.slice(1).map((item, i) => (
              <button
                key={i}
                onClick={() => setGeneratedText(item)}
                className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors truncate"
              >
                {item.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-400 mb-1">使用提示</h4>
            <p className="text-sm text-gray-400">
              输入具体的关键词可以获得更好的生成效果。您可以多次点击"重新生成"获取不同版本的内容。
              本工具使用模板生成内容，适合快速获取灵感和草稿。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
