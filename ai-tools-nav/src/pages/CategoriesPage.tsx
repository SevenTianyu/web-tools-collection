import { useEffect } from 'react';
import { CategoryCard } from '@/components/CategoryCard';
import { categories } from '@/data/categories';

export function CategoriesPage() {
  useEffect(() => {
    document.title = 'AI工具分类 - AI Tools Nav';
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            AI工具分类
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            从写作到编程，从图像到视频，探索10大AI工具分类，找到满足你需求的完美工具
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
