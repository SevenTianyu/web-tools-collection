import { Link } from 'react-router-dom';
import { ExternalLink, Check, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Rating } from './ui/Rating';
import { cn, getCategoryBgColor, getPricingLabel } from '@/utils';
import type { AITool } from '@/types';

interface ToolCardProps {
  tool: AITool;
  variant?: 'default' | 'compact' | 'featured';
}

export function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={`/tool/${tool.slug}`}>
        <Card hover className="h-full">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary-600">
                  {tool.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {tool.name}
                  </h3>
                  {tool.isNew && (
                    <Badge variant="success" size="sm">NEW</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {tool.shortDescription}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Rating value={tool.averageRating} size="sm" showValue />
                  <span className="text-xs text-gray-400">
                    {tool.pricingType === 'free' ? '免费' : tool.startingPrice}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/tool/${tool.slug}`}>
        <Card hover className="h-full relative overflow-visible">
          {tool.isFeatured && (
            <div className="absolute -top-3 left-4">
              <Badge variant="warning" size="sm" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                精选
              </Badge>
            </div>
          )}
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {tool.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">
                    {tool.name}
                  </h3>
                  <div className="flex gap-1">
                    {tool.isNew && (
                      <Badge variant="success" size="sm">NEW</Badge>
                    )}
                    {tool.hasFreeVersion && (
                      <Badge variant="info" size="sm">有免费版</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {tool.shortDescription}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Rating value={tool.averageRating} reviewCount={tool.reviewCount} />
                  <span className={cn(
                    'text-sm font-medium px-3 py-1 rounded-full',
                    getPricingLabel(tool.pricingType).className
                  )}>
                    {getPricingLabel(tool.pricingType).text}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/tool/${tool.slug}`}>
      <Card hover className="h-full flex flex-col">
        <CardContent className="p-5 flex-1">
          <div className="flex items-start justify-between">
            {/* Logo */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">
                {tool.name.charAt(0)}
              </span>
            </div>
            
            {/* Badges */}
            <div className="flex flex-col gap-1 items-end">
              {tool.isNew && (
                <Badge variant="success" size="sm">NEW</Badge>
              )}
              {tool.isFeatured && (
                <Badge variant="warning" size="sm">精选</Badge>
              )}
            </div>
          </div>
          
          <h3 className="font-bold text-gray-900 mt-4">{tool.name}</h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {tool.shortDescription}
          </p>
          
          {/* Category */}
          <div className="mt-3">
            <span className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full',
              getCategoryBgColor(tool.category)
            )}>
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
            </span>
          </div>
          
          {/* Features preview */}
          <ul className="mt-4 space-y-1.5">
            {tool.keyFeatures.slice(0, 2).map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{tool.averageRating}</span>
              <span className="text-gray-500 text-sm">({tool.reviewCount})</span>
            </div>
            <span className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full',
              getPricingLabel(tool.pricingType).className
            )}>
              {getPricingLabel(tool.pricingType).text}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
