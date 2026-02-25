import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ExternalLink, Star, Check, X, ThumbsUp, ChevronRight, 
  Globe, Calendar, Building, DollarSign, Download, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Tabs } from '@/components/ui/Tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ToolCard } from '@/components/ToolCard';
import { getToolBySlug } from '@/data/tools';
import { getCategoryName } from '@/data/categories';
import { cn, formatDate, getPricingLabel } from '@/utils';

export function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name}评测 - ${tool.metaTitle || tool.shortDescription}`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', tool.metaDescription || tool.description);
      }
    }
    window.scrollTo(0, 0);
  }, [tool]);

  if (!tool) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">工具未找到</h1>
        <p className="mt-2 text-gray-600">该工具不存在或已被移除</p>
        <Button className="mt-4">
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: '概览',
      content: (
        <div className="space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">工具介绍</h3>
            <p className="text-gray-700 leading-relaxed">{tool.description}</p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">核心功能</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.keyFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">适用场景</h3>
            <div className="flex flex-wrap gap-2">
              {tool.useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </span>
                  优点
                </h4>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-1">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-600" />
                  </span>
                  缺点
                </h4>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 mt-1">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'pricing',
      label: '定价',
      content: (
        <div className="space-y-6">
          {tool.pricingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tool.pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    'relative',
                    plan.isPopular && 'ring-2 ring-primary-500'
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="primary">最受欢迎</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period !== 'lifetime' && plan.price !== '免费' && (
                        <span className="text-gray-500">/{plan.period === 'monthly' ? '月' : '年'}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-gray-700">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                      {plan.limitations?.map((limitation) => (
                        <li key={limitation} className="flex items-center gap-2 text-gray-400">
                          <X className="w-4 h-4" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无详细定价信息
            </div>
          )}

          {/* Free vs Paid Comparison */}
          {tool.freeVsPaid && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">免费版 vs 付费版</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">对比项</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">免费版</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-600">付费版</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700 font-medium">功能</td>
                      <td className="py-3 px-4">
                        <ul className="space-y-1">
                          {tool.freeVsPaid.freeFeatures.map((f) => (
                            <li key={f} className="text-sm text-gray-600">• {f}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 px-4">
                        <ul className="space-y-1">
                          {tool.freeVsPaid.paidFeatures.map((f) => (
                            <li key={f} className="text-sm text-gray-600">• {f}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700 font-medium">限制</td>
                      <td className="py-3 px-4">
                        <ul className="space-y-1">
                          {tool.freeVsPaid.freeLimitations.map((f) => (
                            <li key={f} className="text-sm text-red-600">• {f}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 px-4 text-sm text-green-600">无限制</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'reviews',
      label: `评价 (${tool.reviewCount})`,
      content: (
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-gray-900">{tool.averageRating}</div>
                  <div>
                    <Rating value={tool.averageRating} size="lg" />
                    <p className="text-gray-500 mt-1">{tool.reviewCount} 条评价</p>
                  </div>
                </div>
                {tool.ratings && (
                  <div className="mt-6 space-y-2">
                    {Object.entries(tool.ratings).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-20">
                          {key === 'overall' && '总体'}
                          {key === 'easeOfUse' && '易用性'}
                          {key === 'features' && '功能'}
                          {key === 'valueForMoney' && '性价比'}
                          {key === 'customerSupport' && '客服'}
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 w-10">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {tool.reviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{review.userName}</span>
                          {review.isVerified && (
                            <Badge variant="success" size="sm">已验证</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">使用时长: {review.usagePeriod}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Rating value={review.rating} showValue={false} />
                      <p className="text-sm text-gray-500 mt-1">{formatDate(review.date)}</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mt-4">{review.title}</h4>
                  <p className="text-gray-700 mt-2">{review.content}</p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="w-4 h-4" />
                      有帮助 ({review.helpful})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 py-4">
          <Link to="/" className="hover:text-primary-600">首页</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/categories" className="hover:text-primary-600">分类</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${tool.category}`} className="hover:text-primary-600">
            {getCategoryName(tool.category)}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Logo & Basic Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-4xl font-bold text-white">{tool.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                    {tool.isNew && <Badge variant="success">NEW</Badge>}
                    {tool.isFeatured && <Badge variant="warning">精选</Badge>}
                  </div>
                  <p className="text-gray-600 mt-2 text-lg">{tool.shortDescription}</p>
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <Rating value={tool.averageRating} reviewCount={tool.reviewCount} size="md" />
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      getPricingLabel(tool.pricingType).className
                    )}>
                      {getPricingLabel(tool.pricingType).text}
                    </span>
                    {tool.hasFreeVersion && (
                      <Badge variant="info">有免费版</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
              <Button size="lg" className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  访问网站
                </a>
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex flex-wrap gap-6 py-4 border-y border-gray-200 text-sm">
          {tool.company && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span>{tool.company}</span>
            </div>
          )}
          {tool.foundedYear && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>成立于 {tool.foundedYear}</span>
            </div>
          )}
          {tool.startingPrice && (
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>起价 {tool.startingPrice}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="w-4 h-4" />
            <span>{tool.languages?.length || 1} 种语言</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Left: Tabs Content */}
          <div className="lg:col-span-2">
            <Tabs tabs={tabs} defaultTab="overview" />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            {tool.platforms && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">支持平台</h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.platforms.map((platform) => (
                      <Badge key={platform} variant="default">{platform}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integrations */}
            {tool.integrations && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">集成</h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.integrations.map((integration) => (
                      <Badge key={integration} variant="default">{integration}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternatives */}
            {tool.alternatives && tool.alternatives.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">替代品</h4>
                  <div className="space-y-2">
                    {tool.alternatives.map((altSlug) => {
                      const altTool = getToolBySlug(altSlug);
                      if (!altTool) return null;
                      return (
                        <Link
                          key={altSlug}
                          to={`/tool/${altSlug}`}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="font-medium text-gray-900">{altTool.name}</span>
                          <Rating value={altTool.averageRating} size="sm" />
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
