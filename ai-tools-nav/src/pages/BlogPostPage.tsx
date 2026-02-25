import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getBlogPostBySlug, getRelatedPosts } from '@/data/blog';
import { getToolBySlug } from '@/data/tools';
import { ToolCard } from '@/components/ToolCard';
import { formatDate } from '@/utils';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug) : [];

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || post.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.metaDescription || post.excerpt);
      }
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">文章未找到</h1>
        <p className="mt-2 text-gray-600">该文章不存在或已被移除</p>
        <Button className="mt-4">
          <Link to="/blog">返回博客</Link>
        </Button>
      </div>
    );
  }

  // Parse markdown content (simple version)
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.slice(4)}</h3>;
      }
      
      // Code blocks
      if (line.startsWith('\`\`\`')) {
        return null; // Handle code blocks separately
      }
      
      // Lists
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={index} className="ml-6 text-gray-700 leading-relaxed">{line.slice(2)}</li>;
      }
      if (line.startsWith('  - ') || line.startsWith('    - ')) {
        return <li key={index} className="ml-12 text-gray-700 leading-relaxed">{line.trim().slice(2)}</li>;
      }
      
      // Bold text
      const boldText = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      
      // Tables
      if (line.startsWith('|')) {
        return <div key={index} className="font-mono text-sm bg-gray-50 p-2 my-2 rounded">{line}</div>;
      }
      
      // Empty lines
      if (!line.trim()) {
        return <div key={index} className="h-4" />;
      }
      
      // Regular paragraphs
      return <p key={index} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: boldText }} />;
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors py-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回博客
        </Link>

        {/* Article Header */}
        <article>
          <header className="py-8 border-b border-gray-100">
            <Badge variant="primary" size="md">{post.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">{post.title}</h1>
            <p className="text-xl text-gray-600 mt-4">{post.excerpt}</p>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400" />
                <span className="font-medium text-gray-900">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} 分钟阅读
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                收藏
              </Button>
            </div>
          </header>

          {/* Cover Image */}
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl my-8 flex items-center justify-center">
            <span className="text-8xl">📝</span>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none py-8">
            {renderContent(post.content)}
          </div>

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-xl p-6 my-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                <p className="text-gray-600 mt-1">{post.author.bio}</p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Tools */}
        {post.relatedTools && post.relatedTools.length > 0 && (
          <section className="py-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">相关工具</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {post.relatedTools.map((toolSlug) => {
                const tool = getToolBySlug(toolSlug);
                if (!tool) return null;
                return <ToolCard key={toolSlug} tool={tool} variant="compact" />;
              })}
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">相关文章</h3>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Badge variant="primary" size="sm">{relatedPost.category}</Badge>
                  <h4 className="font-semibold text-gray-900 mt-2">{relatedPost.title}</h4>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
