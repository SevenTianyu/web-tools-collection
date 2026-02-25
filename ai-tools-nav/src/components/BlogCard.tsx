import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatDate } from '@/utils';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={`/blog/${post.slug}`}>
        <Card hover className="h-full">
          <CardContent className="p-4">
            <Badge variant="primary" size="sm">{post.category}</Badge>
            <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} 分钟
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${post.slug}`}>
        <Card hover className="h-full overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <span className="text-6xl">📝</span>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="sm">{post.category}</Badge>
              <span className="text-sm text-gray-500">
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 mt-3 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime} 分钟阅读
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card hover className="h-full flex flex-col">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <Badge variant="primary" size="sm" className="self-start">
            {post.category}
          </Badge>
          <h3 className="font-bold text-gray-900 mt-3 line-clamp-2 flex-1">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400" />
              <span className="text-sm text-gray-600">{post.author.name}</span>
            </div>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} 分钟
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
