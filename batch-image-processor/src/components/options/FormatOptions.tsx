import { useImageStore } from '@/store/useImageStore';
import { FileType, Info } from 'lucide-react';
import { FORMAT_OPTIONS } from '@/types';

export const FormatOptions = () => {
  const options = useImageStore((state) => state.processingOptions.format);
  const setProcessingOptions = useImageStore((state) => state.setProcessingOptions);

  if (!options) return null;

  const formatInfo: Record<string, { desc: string; pros: string[]; cons: string[] }> = {
    'image/jpeg': {
      desc: 'Best for photos and complex images',
      pros: ['Small file size', 'Universal support', 'Good compression'],
      cons: ['No transparency', 'Lossy compression'],
    },
    'image/png': {
      desc: 'Best for graphics with transparency',
      pros: ['Lossless quality', 'Transparency support', 'Sharp text'],
      cons: ['Larger file size', 'Not ideal for photos'],
    },
    'image/webp': {
      desc: 'Modern format with superior compression',
      pros: ['Smaller than JPEG/PNG', 'Transparency support', 'Lossy & lossless'],
      cons: ['Limited browser support in older versions'],
    },
    'image/avif': {
      desc: 'Next-gen format with best compression',
      pros: ['Smallest file size', 'Excellent quality', 'HDR support'],
      cons: ['Limited browser support', 'Slower encoding'],
    },
  };

  const currentInfo = formatInfo[options.targetFormat];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <FileType className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Format Settings</h3>
          <p className="text-sm text-gray-500">Convert images to different formats</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="label">Target Format</label>
          <div className="grid grid-cols-2 gap-3">
            {FORMAT_OPTIONS.map((format) => (
              <button
                key={format.value}
                onClick={() =>
                  setProcessingOptions({
                    format: { ...options, targetFormat: format.value },
                  })
                }
                className={`
                  p-4 rounded-xl border text-left transition-all
                  ${options.targetFormat === format.value
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-semibold text-lg">{format.label}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  .{format.extension}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Format Info */}
        {currentInfo && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">{currentInfo.desc}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Pros</p>
                <ul className="space-y-1">
                  {currentInfo.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-green-500">✓</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 mb-1">Cons</p>
                <ul className="space-y-1">
                  {currentInfo.cons.map((con, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-red-500">×</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quality Slider (for lossy formats) */}
        {options.targetFormat !== 'image/png' && (
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
                  format: { ...options, quality: parseInt(e.target.value) },
                })
              }
              className="slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-green-50 p-3 rounded-lg">
          <Info className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Recommendations:</p>
            <ul className="space-y-1">
              <li>• <strong>WebP</strong> - Best for web use (30% smaller than JPEG)</li>
              <li>• <strong>AVIF</strong> - Best compression but slower processing</li>
              <li>• <strong>PNG</strong> - Use only when transparency is needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
