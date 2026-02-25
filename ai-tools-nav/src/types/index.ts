// AI工具分类
export type ToolCategory = 
  | 'writing'
  | 'image'
  | 'video'
  | 'code'
  | 'audio'
  | 'chat'
  | 'productivity'
  | 'design'
  | 'marketing'
  | 'research';

// 定价模式
export type PricingType = 'free' | 'freemium' | 'paid' | 'enterprise';

// 用户评分
export interface Rating {
  overall: number;
  easeOfUse: number;
  features: number;
  valueForMoney: number;
  customerSupport: number;
}

// 用户评价
export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  isVerified: boolean;
  usagePeriod: string;
}

// 定价计划
export interface PricingPlan {
  name: string;
  price: string;
  period: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
}

// AI工具数据结构
export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  categories?: ToolCategory[];
  tags: string[];
  url: string;
  logoUrl?: string;
  screenshots?: string[];
  
  // 基本信息
  foundedYear?: number;
  company?: string;
  headquarters?: string;
  
  // 定价信息
  pricingType: PricingType;
  startingPrice?: string;
  hasFreeVersion: boolean;
  hasFreeTrial: boolean;
  freeTrialDays?: number;
  pricingPlans?: PricingPlan[];
  
  // 对比信息 - 免费版 vs 付费版
  freeVsPaid?: {
    freeFeatures: string[];
    paidFeatures: string[];
    freeLimitations: string[];
  };
  
  // 评分和评价
  averageRating: number;
  reviewCount: number;
  ratings?: Rating;
  reviews?: Review[];
  
  // 功能特点
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  
  // 使用案例
  useCases: string[];
  
  // 集成
  integrations?: string[];
  
  // 支持平台
  platforms?: string[];
  
  // 语言支持
  languages?: string[];
  
  // 学习资源
  tutorials?: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'documentation';
  }[];
  
  // 替代品
  alternatives?: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  
  // 状态
  isFeatured?: boolean;
  isNew?: boolean;
  addedDate: string;
  lastUpdated: string;
}

// 博客文章
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  featured?: boolean;
  relatedTools?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

// 分类信息
export interface Category {
  id: ToolCategory;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  toolCount: number;
  featuredTools: string[];
  metaTitle?: string;
  metaDescription?: string;
}

// 筛选选项
export interface FilterOptions {
  category?: ToolCategory;
  pricingType?: PricingType[];
  minRating?: number;
  hasFreeVersion?: boolean;
  searchQuery?: string;
  sortBy?: 'rating' | 'newest' | 'popular' | 'price';
}

// 对比工具
export interface ComparisonData {
  tool1: AITool;
  tool2: AITool;
  tool3?: AITool;
}
