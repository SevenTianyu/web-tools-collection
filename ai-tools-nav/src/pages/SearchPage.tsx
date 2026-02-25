import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { ToolCard } from '@/components/ToolCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { tools, searchTools } from '@/data/tools';
import { categories } from '@/data/categories';
import { blogPosts } from '@/data/blog';
import type { AITool } from '@/types';

interface SearchResult {
  tools: AITool[];
  categories: typeof categories;
  posts: typeof blogPosts;
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult>({ tools: [], categories: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.title = query ? `"${query}" 搜索结果 - AI Tools Nav` : '搜索 - AI Tools Nav';
  }, [query]);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ tools: [], categories: [], posts: [] });
      return;
    }

    setIsSearching(true);
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // Search tools
    const matchedTools = tools.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.shortDescription.toLowerCase().includes(lowerQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    // Search categories
    const matchedCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes(lowerQuery) ||
      cat.description.toLowerCase().includes(lowerQuery)
    );

    // Search blog posts
    const matchedPosts = blogPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    setResults({
      tools: matchedTools,
      categories: matchedCategories,
      posts: matchedPosts,
    });
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch(query);
  };

  const totalResults = results.tools.length + results.categories.length + results.posts.length;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">搜索</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索AI工具、分类、文章..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 py-3 text-lg"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults({ tools: [], categories: [], posts: [] });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500">热门搜索：</span>
            {['ChatGPT', 'Midjourney', 'AI写作', '免费', '视频生成'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  setSearchParams({ q: tag });
                  performSearch(tag);
                }}
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="py-4">
            <p className="text-gray-600 mb-6">
              "{query}" 的搜索结果 ({totalResults} 条)
            </p>

            {totalResults === 0 && !isSearching && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900">未找到相关结果</h3>
                <p className="text-gray-600 mt-2">尝试使用其他关键词</p>
              </div>
            )}

            {/* Tools Results */}
            {results.tools.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  工具
                  <Badge variant="default">{results.tools.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {results.categories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  分类
                  <Badge variant="default">{results.categories.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md transition-all"
                    >
                      <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center`}>
                        <span className="text-2xl text-white">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{cat.toolCount} 个工具</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Results */}
            {results.posts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  文章
                  <Badge variant="default">{results.posts.length}</Badge>
                </h2>
                <div className="space-y-4">
                  {results.posts.map((post) => (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md transition-all"
                    >
                      <Badge variant="primary" size="sm">{post.category}</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">{post.title}</h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span>{post.author.name}</span>
                        <span>{post.readTime} 分钟阅读</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔎</div>
            <h3 className="text-lg font-medium text-gray-900">输入关键词开始搜索</h3>
            <p className="text-gray-600 mt-2">搜索AI工具、分类或评测文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
