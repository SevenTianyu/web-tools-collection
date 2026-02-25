import { useImageStore } from '@/store/useImageStore';
import { Maximize2, Info, Check } from 'lucide-react';
import { SIZE_PRESETS } from '@/types';
import { useState } from 'react';

export const ResizeOptions = () => {
  const options = useImageStore((state) => state.processingOptions.resize);
  const setProcessingOptions = useImageStore((state) => state.setProcessingOptions);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  if (!options) return null;

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = SIZE_PRESETS[presetKey];
    if (preset) {
      setProcessingOptions({
        resize: {
          ...options,
          width: preset.width,
          height: preset.height,
          preset: presetKey,
        },
      });
    }
  };

  // Group presets by category
  const groupedPresets = Object.entries(SIZE_PRESETS).reduce((acc, [key, preset]) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push({ key, ...preset });
    return acc;
  }, {} as Record<string, Array<{ key: string; width: number; height: number; name: string; category: string }>>);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Maximize2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Resize Settings</h3>
          <p className="text-sm text-gray-500">Change image dimensions</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Resize Mode */}
        <div>
          <label className="label">Resize Mode</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { value: 'max', label: 'Max Size', desc: 'Fit within bounds' },
              { value: 'exact', label: 'Exact', desc: 'Force dimensions' },
              { value: 'fit', label: 'Fit', desc: 'Contain in box' },
              { value: 'fill', label: 'Fill', desc: 'Cover & crop' },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() =>
                  setProcessingOptions({
                    resize: { ...options, mode: mode.value as typeof options.mode },
                  })
                }
                className={`
                  p-3 rounded-lg border text-left transition-all
                  ${options.mode === mode.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-medium text-sm">{mode.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="label">Size Presets</label>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin pr-2">
            {Object.entries(groupedPresets).map(([category, presets]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => handlePresetChange(preset.key)}
                      className={`
                        flex items-center gap-2 p-2 rounded-lg border text-left transition-all
                        ${selectedPreset === preset.key
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`
                        w-4 h-4 rounded border flex items-center justify-center
                        ${selectedPreset === preset.key
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedPreset === preset.key && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{preset.name}</div>
                        <div className="text-xs text-gray-500">
                          {preset.width}×{preset.height}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Dimensions */}
        <div>
          <label className="label">Custom Dimensions</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Width (px)"
                value={options.width || ''}
                onChange={(e) => {
                  setSelectedPreset('');
                  setProcessingOptions({
                    resize: {
                      ...options,
                      width: e.target.value ? parseInt(e.target.value) : undefined,
                      preset: undefined,
                    },
                  });
                }}
                className="input"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Height (px)"
                value={options.height || ''}
                onChange={(e) => {
                  setSelectedPreset('');
                  setProcessingOptions({
                    resize: {
                      ...options,
                      height: e.target.value ? parseInt(e.target.value) : undefined,
                      preset: undefined,
                    },
                  });
                }}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Maintain Aspect Ratio */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={options.maintainAspectRatio}
            onChange={(e) =>
              setProcessingOptions({
                resize: { ...options, maintainAspectRatio: e.target.checked },
              })
            }
            className="checkbox"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Maintain aspect ratio</span>
            <p className="text-xs text-gray-500">Keep original proportions when resizing</p>
          </div>
        </label>

        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-purple-50 p-3 rounded-lg">
          <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Max Size:</strong> Scales down if larger than specified. <strong>Exact:</strong> Forces exact dimensions. <strong>Fit:</strong> Fits inside the box. <strong>Fill:</strong> Fills and crops to fit.
          </p>
        </div>
      </div>
    </div>
  );
};
