import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Star, Users, Sparkles } from 'lucide-react';
import { ToolCard } from '@/components/ToolCard';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { tools } from '@/data/tools';
import type { AITool } from '@/types';

interface RankingList {
  title: string;
  description: string;
  tools: AITool[];
}

export function RankingPage() {
  const [rankings, setRankings] = useState<{
    topRated: RankingList;
    mostReviewed: RankingList;
    trending: RankingList;
    newArrivals: RankingList;
  } | null>(null);

  useEffect(() => {
    document.title = 'AI工具排行榜 - AI Tools Nav';
    
    // Calculate rankings
    const sortedByRating = [...tools].sort((a, b) => b.averageRating - a.averageRating).slice(0, 12);
    const sortedByReviews = [...tools].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 12);
    const sortedByNewest = [...tools].sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()).slice(0, 12);
    const featuredTools = tools.filter(t => t.isFeatured).slice(0, 12);

    setRankings({
      topRated: {
        title: '评分最高',
        description: '基于用户评分的AI工具排行榜',
        tools: sortedByRating,
      },
      mostReviewed: {
        title: '评价最多',
        description: '获得最多用户评价的热门工具',
        tools: sortedByReviews,
      },
      trending: {
        title: '热门推荐',
        description: '编辑精选的优质AI工具',
        tools: featuredTools,
      },
      newArrivals: {
        title: '最新发布',
        description: '最近收录的新工具',
        tools: sortedByNewest,
      },
    });
  }, []);

  if (!rankings) return null;

  const tabs = [
    {
      id: 'top-rated',
      label: (
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          评分最高
        </div>
      ),
      content: (
        <RankingSection 
          title={rankings.topRated.title}
          description={rankings.topRated.description}
          tools={rankings.topRated.tools}
          showRank
        />
      ),
    },
    {
      id: 'most-reviewed',
      label: (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          评价最多
        </div>
      ),
      content: (
        <RankingSection 
          title={rankings.mostReviewed.title}
          description={rankings.mostReviewed.description}
          tools={rankings.mostReviewed.tools}
        />
      ),
    },
    {
      id: 'trending',
      label: (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          热门推荐
        </div>
      ),
      content: (
        <RankingSection 
          title={rankings.trending.title}
          description={rankings.trending.description}
          tools={rankings.trending.tools}
        />
      ),
    },
    {
      id: 'new',
      label: (
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          最新发布
        </div>
      ),
      content: (
        <RankingSection 
          title={rankings.newArrivals.title}
          description={rankings.newArrivals.description}
          tools={rankings.newArrivals.tools}
          showNewBadge
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            <span>2025年AI工具排行</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            AI工具排行榜
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            基于用户评价、使用量和专业评测的综合排名，帮你找到最值得使用的AI工具
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard
            icon={Trophy}
            value="50+"
            label="收录工具"
          />
          <StatCard
            icon={Star}
            value="4.7"
            label="平均评分"
          />
          <StatCard
            icon={Users}
            value="30K+"
            label="用户评价"
          />
          <StatCard
            icon={TrendingUp}
            value="10"
            label="分类覆盖"
          />
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="top-rated" />
      </div>
    </div>
  );
}

interface RankingSectionProps {
  title: string;
  description: string;
  tools: AITool[];
  showRank?: boolean;
  showNewBadge?: boolean;
}

function RankingSection({ title, description, tools, showRank, showNewBadge }: RankingSectionProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <div key={tool.id} className="relative">
            {showRank && index < 3 && (
              <div className={`
                absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold z-10
                ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                ${index === 1 ? 'bg-gray-300 text-gray-800' : ''}
                ${index === 2 ? 'bg-amber-600 text-white' : ''}
              `}>
                {index + 1}
              </div>
            )}
            {showNewBadge && <Badge variant="success" className="absolute -top-2 -right-2 z-10">NEW</Badge>}
            <ToolCard tool={tool} variant="featured" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-3">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
