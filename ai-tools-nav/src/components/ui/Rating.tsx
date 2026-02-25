import { Star } from 'lucide-react';
import { cn } from '@/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = 'sm',
  showValue = true,
  reviewCount,
  className,
}: RatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const partial = !filled && i < value;
          
          return (
            <Star
              key={i}
              className={cn(
                sizes[size],
                filled && 'fill-yellow-400 text-yellow-400',
                partial && 'fill-yellow-400/50 text-yellow-400',
                !filled && !partial && 'fill-gray-200 text-gray-200'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-semibold text-gray-700 ml-1', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-gray-500 text-sm ml-1">
          ({reviewCount.toLocaleString()} 评价)
        </span>
      )}
    </div>
  );
}
