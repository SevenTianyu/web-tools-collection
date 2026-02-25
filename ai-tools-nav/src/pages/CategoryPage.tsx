import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getCategoryById } from '@/data/categories';
import { tools, getToolsByCategory } from '@/data/tools';
import type { FilterOptions, PricingType } from '@/types';

const pricingOptions: { value: PricingType; label: string }[] = [
  { value: 'free', label: '完全免费' },
  { value: 'freemium', label: '免费增值' },
  { value: 'paid', label: '付费' },
  { value: 'enterprise', label: '企业版' },
];

const sortOptions = [
  { value: 'rating', label: '评分最高' },
  { value: 'popular', label: '最受欢迎' },
  { value: 'newest', label: '最新发布' },
  { value: 'price', label: '价格最低' },
];

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const category = id ? getCategoryById(id) : undefined;
  
  const [filters, setFilters] = useState<FilterOptions>({
    pricingType: [],
    minRating: 0,
    hasFreeVersion: undefined,
    sortBy: 'rating',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (category) {
      document.title = `${category.name}工具推荐 - AI Tools Nav`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', category.metaDescription || category.description);
      }
    }
    // Reset filters when category changes
    setFilters({
      pricingType: [],
      minRating: 0,
      hasFreeVersion: undefined,
      sortBy: 'rating',
    });
  }, [category, id]);

  const categoryTools = useMemo(() => {
    if (!id) return [];
    return getToolsByCategory(id);
  }, [id]);

  const filteredTools = useMemo(() => {
    let result = [...categoryTools];

    // Apply filters
    if (filters.pricingType && filters.pricingType.length > 0) {
      result = result.filter(tool => filters.pricingType?.includes(tool.pricingType));
    }

    if (filters.minRating && filters.minRating > 0) {
      result = result.filter(tool => tool.averageRating >= filters.minRating!);
    }

    if (filters.hasFreeVersion !== undefined) {
      result = result.filter(tool => tool.hasFreeVersion === filters.hasFreeVersion);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
        break;
      case 'price':
        result.sort((a, b) => {
          const priceOrder = { free: 0, freemium: 1, paid: 2, enterprise: 3 };
          return priceOrder[a.pricingType] - priceOrder[b.pricingType];
        });
        break;
    }

    return result;
  }, [categoryTools, filters]);

  if (!category) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">分类未找到</h1>
        <p className="mt-2 text-gray-600">该分类不存在或已被移除</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}工具</h1>
              <p className="text-gray-600">{category.toolCount} 个工具</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                筛选
                {Object.values(filters).some(v => 
                  Array.isArray(v) ? v.length > 0 : v !== undefined && v !== 0
                ) && (
                  <Badge variant="primary" size="sm">!</Badge>
                )}
              </Button>
              
              {/* Active filters */}
              <div className="hidden sm:flex items-center gap-2">
                {filters.pricingType?.map(type => (
                  <Badge
                    key={type}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      pricingType: prev.pricingType?.filter(t => t !== type)
                    }))}
                  >
                    {pricingOptions.find(o => o.value === type)?.label} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">排序：</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Pricing Type */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">定价模式</h4>
                  <div className="space-y-2">
                    {pricingOptions.map(option => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.pricingType?.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                pricingType: [...(prev.pricingType || []), option.value]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                pricingType: prev.pricingType?.filter(t => t !== option.value)
                              }));
                            }
                          }}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">最低评分</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="minRating"
                          checked={filters.minRating === rating}
                          onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{rating}+ 星</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="minRating"
                        checked={filters.minRating === 0}
                        onChange={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">所有评分</span>
                    </label>
                  </div>
                </div>

                {/* Free Version */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">免费版本</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="freeVersion"
                        checked={filters.hasFreeVersion === true}
                        onChange={() => setFilters(prev => ({ ...prev, hasFreeVersion: true }))}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">有免费版</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="freeVersion"
                        checked={filters.hasFreeVersion === false}
                        onChange={() => setFilters(prev => ({ ...prev, hasFreeVersion: false }))}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">仅付费版</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="freeVersion"
                        checked={filters.hasFreeVersion === undefined}
                        onChange={() => setFilters(prev => ({ ...prev, hasFreeVersion: undefined }))}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">不限</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({
                    pricingType: [],
                    minRating: 0,
                    hasFreeVersion: undefined,
                    sortBy: 'rating',
                  })}
                >
                  重置筛选
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-500">
          找到 {filteredTools.length} 个工具
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">没有找到匹配的工具</h3>
            <p className="text-gray-600 mt-2">尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}
