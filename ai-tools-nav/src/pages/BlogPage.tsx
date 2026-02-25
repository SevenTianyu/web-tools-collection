import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { blogPosts, getFeaturedPosts, getRecentPosts } from '@/data/blog';
import { formatDate } from '@/utils';

const categories = ['全部', '推荐清单', '深度对比', '教程指南', '行业应用', '深度评测'];

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('全部');

  useEffect(() => {
    document.title = 'AI工具评测与教程 - AI Tools Nav Blog';
  }, []);

  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts();

  const filteredPosts = activeCategory === '全部'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            AI工具评测与教程
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            深度评测、使用技巧和最新AI资讯，帮助你更好地使用AI工具
          </p>
        </div>

        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <Link to={`/blog/${featuredPosts[0].slug}`}>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
                <div className="relative px-8 py-12 md:px-12 md:py-16">
                  <div className="max-w-2xl">
                    <Badge variant="warning" className="mb-4">精选文章</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold">{featuredPosts[0].title}</h2>
                    <p className="mt-4 text-lg text-primary-100">{featuredPosts[0].excerpt}</p>
                    <div className="flex items-center gap-4 mt-6 text-sm text-primary-200">
                      <span>{formatDate(featuredPosts[0].publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPosts[0].readTime} 分钟阅读
                      </span>
                    </div>
                    <Button variant="secondary" className="mt-6">
                      阅读全文 <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900">该分类暂无文章</h3>
            <p className="text-gray-600 mt-2">请尝试其他分类</p>
          </div>
        )}
      </div>
    </div>
  );
}
