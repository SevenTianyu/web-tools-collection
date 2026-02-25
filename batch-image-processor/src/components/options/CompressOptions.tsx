import { useImageStore } from '@/store/useImageStore';
import { Minimize2, Info } from 'lucide-react';

export const CompressOptions = () => {
  const options = useImageStore((state) => state.processingOptions.compress);
  const setProcessingOptions = useImageStore((state) => state.setProcessingOptions);

  if (!options) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Minimize2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compression Settings</h3>
          <p className="text-sm text-gray-500">Reduce file size while maintaining quality</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quality Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">Quality</label>
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {options.quality}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={options.quality}
            onChange={(e) =>
              setProcessingOptions({
                compress: { ...options, quality: parseInt(e.target.value) },
              })
            }
            className="slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>

        {/* Max Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Max Width (px)</label>
            <input
              type="number"
              placeholder="Unlimited"
              value={options.maxWidth || ''}
              onChange={(e) =>
                setProcessingOptions({
                  compress: {
                    ...options,
                    maxWidth: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })
              }
              className="input"
            />
          </div>
          <div>
            <label className="label">Max Height (px)</label>
            <input
              type="number"
              placeholder="Unlimited"
              value={options.maxHeight || ''}
              onChange={(e) =>
                setProcessingOptions({
                  compress: {
                    ...options,
                    maxHeight: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })
              }
              className="input"
            />
          </div>
        </div>

        {/* Preserve EXIF */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={options.preserveExif}
            onChange={(e) =>
              setProcessingOptions({
                compress: { ...options, preserveExif: e.target.checked },
              })
            }
            className="checkbox"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Preserve EXIF data</span>
            <p className="text-xs text-gray-500">Keep metadata like camera info, GPS, date taken</p>
          </div>
        </label>

        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p>
            Higher quality (80-95%) is recommended for photography. Lower quality (60-80%) works well for web use.
          </p>
        </div>
      </div>
    </div>
  );
};
