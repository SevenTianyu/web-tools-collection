import { Link } from 'react-router-dom'
import { FileText, Image, Type, Brain, ArrowRight } from 'lucide-react'
import { TOOLS, CATEGORIES } from '@utils/constants'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Image,
  Type,
  Brain,
  FileStack: FileText,
  Scissors: FileText,
  Minimize2: FileText,
  ImageMinus: Image,
  RefreshCw: Image,
  Maximize: Image,
  Droplet: Image,
  Braces: Type,
  Shrink: Type,
  Search: Type,
  Languages: Brain,
  ClipboardList: Brain,
  Sparkles: Brain,
}

export default function ToolGrid() {
  return (
    <div className="space-y-16">
      {CATEGORIES.map((category) => {
        const categoryTools = TOOLS.filter((t) => t.category === category.id)
        const Icon = iconMap[category.icon] || FileText

        return (
          <section key={category.id} id={category.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${category.color}`} />
              </div>
              <h3 className="text-xl font-bold">{category.name}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryTools.map((tool) => {
                const ToolIcon = iconMap[tool.icon] || FileText

                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="tool-card group"
                  >
                    <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <ToolIcon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    
                    <h4 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {tool.name}
                    </h4>
                    
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center gap-1 text-sm text-primary-400 font-medium">
                      <span>使用工具</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
