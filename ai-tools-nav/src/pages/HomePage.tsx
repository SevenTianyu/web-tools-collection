import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Star, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToolCard } from '@/components/ToolCard';
import { CategoryCard } from '@/components/CategoryCard';
import { BlogCard } from '@/components/BlogCard';
import { categories } from '@/data/categories';
import { tools, getFeaturedTools, getNewTools, getTopRatedTools } from '@/data/tools';
import { blogPosts, getFeaturedPosts } from '@/data/blog';

export function HomePage() {
  // SEO
  useEffect(() => {
    document.title = 'AI Tools Nav - 最佳AI工具导航与评测 | Best Free AI Tools 2025';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '发现最佳AI工具，深度对比评测。收录ChatGPT、Midjourney等热门AI工具，提供免费版vs付费版对比，真实用户评价，使用教程和案例分享。');
    }
  }, []);

  const featuredTools = getFeaturedTools();
  const newTools = getNewTools();
  const topRatedTools = getTopRatedTools(4);
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>收录 500+ 优质AI工具</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              发现最佳{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AI工具
              </span>
              <br />
              提升工作效率
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              深度对比评测 ChatGPT、Midjourney 等热门 AI 工具。
              免费版 vs 付费版详细对比，真实用户评价，帮你找到最适合的AI助手。
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Link to="/categories" className="flex items-center gap-2">
                  浏览所有工具
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/blog">查看评测文章</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">AI工具</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-500">分类</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-500">月访问</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">按分类浏览</h2>
              <p className="text-gray-600 mt-2">10大AI工具分类，满足各种需求</p>
            </div>
            <Link
              to="/categories"
              className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">精选工具</h2>
                <p className="text-gray-600 mt-1">编辑推荐的优质AI工具</p>
              </div>
            </div>
            <Link
              to="/ranking"
              className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              查看排行
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* New Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">最新收录</h2>
                <p className="text-gray-600 mt-1">每周更新的AI新工具</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">用户评分最高</h2>
                <p className="text-primary-100 mt-1">基于真实用户评价</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedTools.map((tool, index) => (
              <div key={tool.id} className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold z-10">
                  {index + 1}
                </div>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">评测与教程</h2>
              <p className="text-gray-600 mt-2">深度评测、使用技巧和最新资讯</p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            准备好发现你的下一个AI工具了吗？
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            加入我们，获取每周精选AI工具推荐和独家评测
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">
              <Link to="/categories">开始探索</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link to="/submit">提交工具</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
