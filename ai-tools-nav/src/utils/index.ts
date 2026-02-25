import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 格式化数字（如：1.2k）
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 生成评分星星
export function generateRatingStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 生成分类颜色
export function getCategoryColor(categoryId: string): string {
  const colors: Record<string, string> = {
    writing: 'bg-blue-500',
    image: 'bg-purple-500',
    video: 'bg-red-500',
    code: 'bg-green-500',
    audio: 'bg-yellow-500',
    chat: 'bg-indigo-500',
    productivity: 'bg-orange-500',
    design: 'bg-pink-500',
    marketing: 'bg-teal-500',
    research: 'bg-cyan-500',
  };
  return colors[categoryId] || 'bg-gray-500';
}

// 生成分类背景色
export function getCategoryBgColor(categoryId: string): string {
  const colors: Record<string, string> = {
    writing: 'bg-blue-50 text-blue-700',
    image: 'bg-purple-50 text-purple-700',
    video: 'bg-red-50 text-red-700',
    code: 'bg-green-50 text-green-700',
    audio: 'bg-yellow-50 text-yellow-700',
    chat: 'bg-indigo-50 text-indigo-700',
    productivity: 'bg-orange-50 text-orange-700',
    design: 'bg-pink-50 text-pink-700',
    marketing: 'bg-teal-50 text-teal-700',
    research: 'bg-cyan-50 text-cyan-700',
  };
  return colors[categoryId] || 'bg-gray-50 text-gray-700';
}

// 定价类型标签
export function getPricingLabel(type: string): { text: string; className: string } {
  const labels: Record<string, { text: string; className: string }> = {
    free: { text: '完全免费', className: 'bg-green-100 text-green-800' },
    freemium: { text: '免费增值', className: 'bg-blue-100 text-blue-800' },
    paid: { text: '付费', className: 'bg-purple-100 text-purple-800' },
    enterprise: { text: '企业版', className: 'bg-orange-100 text-orange-800' },
  };
  return labels[type] || { text: type, className: 'bg-gray-100 text-gray-800' };
}

// 随机选择数组元素
export function sample<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 检测设备类型
export function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// 本地存储工具
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
};

// 滚动到元素
export function scrollToElement(elementId: string, offset: number = 80): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}
