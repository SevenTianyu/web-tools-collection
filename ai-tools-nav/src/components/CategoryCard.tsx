import { Link } from 'react-router-dom';
import { ArrowRight, PenTool, Image, Video, Code, Mic, MessageSquare, Zap, Palette, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { cn } from '@/utils';
import type { Category } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  PenTool,
  Image,
  Video,
  Code,
  Mic,
  MessageSquare,
  Zap,
  Palette,
  TrendingUp,
  Search,
};

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'compact';
}

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Search;

  if (variant === 'compact') {
    return (
      <Link to={`/category/${category.id}`}>
        <Card hover className="h-full">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              category.color
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.toolCount} 个工具</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/category/${category.id}`}>
      <Card hover className="h-full group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
              category.color
            )}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-200">
              {category.toolCount}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mt-4">{category.name}</h3>
          <p className="text-gray-600 mt-2 line-clamp-2 text-sm">
            {category.description}
          </p>
          
          <div className="flex items-center gap-2 mt-4 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
            <span>浏览工具</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
