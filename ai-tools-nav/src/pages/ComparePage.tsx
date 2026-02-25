import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { tools, getToolBySlug } from '@/data/tools';
import { cn, getPricingLabel } from '@/utils';
import type { AITool } from '@/types';

export function ComparePage() {
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'AI工具对比 - AI Tools Nav';
    
    // Load from localStorage
    const saved = localStorage.getItem('compareTools');
    if (saved) {
      const slugs = JSON.parse(saved);
      const loadedTools = slugs
        .map((slug: string) => getToolBySlug(slug))
        .filter(Boolean);
      setSelectedTools(loadedTools);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    const slugs = selectedTools.map(t => t.slug);
    localStorage.setItem('compareTools', JSON.stringify(slugs));
  }, [selectedTools]);

  const addTool = (tool: AITool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
      setIsSelectorOpen(false);
      setSearchQuery('');
    }
  };

  const removeTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const filteredTools = tools.filter(tool => 
    !selectedTools.find(t => t.id === tool.id) &&
    (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900">AI工具对比</h1>
          <p className="text-gray-600 mt-2">
            并排对比不同AI工具的功能、定价和用户评价，找到最适合你的工具
          </p>
        </div>

        {/* Empty State */}
        {selectedTools.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-xl font-bold text-gray-900">开始对比AI工具</h3>
            <p className="text-gray-600 mt-2 mb-6">选择2-3个工具进行详细对比</p>
            <Button size="lg" onClick={() => setIsSelectorOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              添加工具
            </Button>
          </div>
        )}

        {/* Comparison Table */}
        {selectedTools.length > 0 && (
          <div className="space-y-6">
            {/* Add Button */}
            {selectedTools.length < 3 && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsSelectorOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加对比工具 ({selectedTools.length}/3)
                </Button>
              </div>
            )}

            {/* Comparison Cards - Mobile */}
            <div className="lg:hidden space-y-4">
              {selectedTools.map((tool) => (
                <ComparisonCard 
                  key={tool.id} 
                  tool={tool} 
                  onRemove={() => removeTool(tool.id)}
                />
              ))}
            </div>

            {/* Comparison Table - Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-4 bg-gray-50 rounded-l-lg">对比项</th>
                    {selectedTools.map((tool) => (
                      <th key={tool.id} className="py-4 px-4 bg-gray-50 min-w-[280px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{tool.name}</span>
                          <button
                            onClick={() => removeTool(tool.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Logo & Rating */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">评分</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">{tool.name.charAt(0)}</span>
                          </div>
                          <div>
                            <Rating value={tool.averageRating} reviewCount={tool.reviewCount} />
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">分类</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        <Badge variant="primary">
                          {tool.category === 'writing' && 'AI写作'}
                          {tool.category === 'image' && 'AI图像'}
                          {tool.category === 'video' && 'AI视频'}
                          {tool.category === 'code' && 'AI编程'}
                          {tool.category === 'audio' && 'AI音频'}
                          {tool.category === 'chat' && 'AI对话'}
                          {tool.category === 'productivity' && '生产力'}
                          {tool.category === 'design' && 'AI设计'}
                          {tool.category === 'marketing' && 'AI营销'}
                          {tool.category === 'research' && 'AI研究'}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Pricing */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">定价</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          getPricingLabel(tool.pricingType).className
                        )}>
                          {getPricingLabel(tool.pricingType).text}
                        </span>
                        {tool.startingPrice && (
                          <p className="text-sm text-gray-600 mt-1">起价 {tool.startingPrice}</p>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Free Version */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">免费版本</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        {tool.hasFreeVersion ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <Check className="w-4 h-4" /> 有
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500">
                            <X className="w-4 h-4" /> 无
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Free Trial */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700">免费试用</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        {tool.hasFreeTrial ? (
                          <span className="text-green-600">{tool.freeTrialDays} 天</span>
                        ) : (
                          <span className="text-gray-400">无</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Key Features */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-700 align-top">核心功能</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        <ul className="space-y-1">
                          {tool.keyFeatures.slice(0, 4).map((feature) => (
                            <li key={feature} className="text-sm text-gray-700 flex items-start gap-1">
                              <Check className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Action */}
                  <tr>
                    <td className="py-4 px-4"></td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4">
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <a 
                              href={tool.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1"
                            >
                              访问网站 <ArrowRight className="w-3 h-3" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Link to={`/tool/${tool.slug}`}>查看详情</Link>
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Tool Selector Modal */}
      <Modal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        title="选择要对比的工具"
        size="lg"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="搜索工具..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <div className="max-h-[400px] overflow-y-auto">
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => addTool(tool)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">{tool.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{tool.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{tool.shortDescription}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                没有找到匹配的工具
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ComparisonCard({ tool, onRemove }: { tool: AITool; onRemove: () => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{tool.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{tool.name}</h3>
              <Rating value={tool.averageRating} size="sm" />
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">定价</span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              getPricingLabel(tool.pricingType).className
            )}>
              {getPricingLabel(tool.pricingType).text}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">免费版</span>
            <span className={tool.hasFreeVersion ? 'text-green-600' : 'text-red-500'}>
              {tool.hasFreeVersion ? '✓ 有' : '✗ 无'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">免费试用</span>
            <span>{tool.hasFreeTrial ? `${tool.freeTrialDays} 天` : '无'}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button size="sm" className="w-full">
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              访问网站
            </a>
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Link to={`/tool/${tool.slug}`}>查看详情</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
