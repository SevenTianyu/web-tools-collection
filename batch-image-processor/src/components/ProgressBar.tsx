import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { useImageStore } from '@/store/useImageStore';

export const ProgressBar = () => {
  const progress = useImageStore((state) => state.progress);
  const isProcessing = useImageStore((state) => state.isProcessing);

  if (!isProcessing && progress.completed === 0) {
    return null;
  }

  const percentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isProcessing ? (
            <>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Processing... {percentage}%
                </p>
                {progress.currentFile && (
                  <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-md">
                    {progress.currentFile}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Processing Complete
                </p>
                <p className="text-xs text-gray-500">
                  {progress.completed} of {progress.total} images processed
                  {progress.failed > 0 && (
                    <span className="text-red-500 ml-2">
                      ({progress.failed} failed)
                    </span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`
            absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out
            ${isProcessing ? 'bg-primary-500' : 'bg-green-500'}
          `}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Failed indicator */}
        {progress.failed > 0 && progress.total > 0 && (
          <div 
            className="absolute inset-y-0 bg-red-500 rounded-full"
            style={{ 
              left: `${((progress.completed - progress.failed) / progress.total) * 100}%`,
              width: `${(progress.failed / progress.total) * 100}%`
            }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-600">
            Completed: {progress.completed - progress.failed}
          </span>
        </div>
        {progress.failed > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-600">
              Failed: {progress.failed}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span className="text-gray-600">
            Total: {progress.total}
          </span>
        </div>
      </div>
    </div>
  );
};
