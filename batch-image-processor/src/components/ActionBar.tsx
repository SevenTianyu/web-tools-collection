import { Play, Download, Trash2, RotateCcw, Package } from 'lucide-react';
import { useImageStore } from '@/store/useImageStore';
import { useBatchProcessing } from '@/hooks/useBatchProcessing';
import { formatFileSize } from '@/utils/imageProcessor';

interface ActionBarProps {
  processingOptions: Parameters<typeof useBatchProcessing>[0];
}

export const ActionBar = ({ processingOptions }: ActionBarProps) => {
  const images = useImageStore((state) => state.images);
  const clearImages = useImageStore((state) => state.clearImages);
  
  const {
    isProcessing,
    progress,
    totalSaved,
    processAll,
    downloadAll,
    cancelProcessing,
  } = useBatchProcessing(processingOptions);

  const pendingCount = images.filter(img => img.status === 'pending').length;
  const completedCount = images.filter(img => img.status === 'completed').length;
  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-4 z-40 mx-4 sm:mx-0">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <p className="text-xl font-bold text-gray-900">{images.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-xl font-bold text-gray-900">{formatFileSize(totalOriginalSize)}</p>
            </div>
            {totalSaved > 0 && (
              <div>
                <p className="text-sm text-gray-500">Space Saved</p>
                <p className="text-xl font-bold text-green-600">{formatFileSize(totalSaved)}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <button
                onClick={downloadAll}
                className="btn-success"
                disabled={isProcessing}
              >
                <Package className="w-4 h-4 mr-2" />
                Download All
              </button>
            )}

            {pendingCount > 0 && (
              <>
                {isProcessing ? (
                  <button
                    onClick={cancelProcessing}
                    className="btn-danger"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={processAll}
                    className="btn-primary"
                    disabled={isProcessing}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Process {pendingCount} Images
                  </button>
                )}
              </>
            )}

            <button
              onClick={clearImages}
              className="btn-secondary"
              disabled={isProcessing}
              title="Clear all images"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini Progress */}
        {isProcessing && progress.total > 0 && (
          <div className="mt-4">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.round((progress.completed / progress.total) * 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Processing {progress.completed} of {progress.total} images...
              {progress.currentFile && ` (${progress.currentFile})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
