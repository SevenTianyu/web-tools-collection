import { useImageStore } from '@/store/useImageStore';
import { Type, Image as ImageIcon, Info, Upload, Bold, Italic } from 'lucide-react';
import { useRef, useCallback } from 'react';

const POSITIONS = [
  { value: 'center', label: 'Center' },
  { value: 'topLeft', label: 'Top Left' },
  { value: 'topRight', label: 'Top Right' },
  { value: 'bottomLeft', label: 'Bottom Left' },
  { value: 'bottomRight', label: 'Bottom Right' },
  { value: 'random', label: 'Random' },
  { value: 'tile', label: 'Tile' },
];

const FONTS = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Helvetica',
  'Impact',
];

export const WatermarkOptions = () => {
  const options = useImageStore((state) => state.processingOptions.watermark);
  const setProcessingOptions = useImageStore((state) => state.setProcessingOptions);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProcessingOptions({
        watermark: { ...options!, imageFile: file },
      });
    }
  }, [options, setProcessingOptions]);

  if (!options) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Type className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Watermark Settings</h3>
          <p className="text-sm text-gray-500">Add text or image watermark</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Watermark Type */}
        <div>
          <label className="label">Watermark Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                setProcessingOptions({
                  watermark: { ...options, type: 'text' },
                })
              }
              className={`
                flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
                ${options.type === 'text'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Type className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() =>
                setProcessingOptions({
                  watermark: { ...options, type: 'image' },
                })
              }
              className={`
                flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
                ${options.type === 'image'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <ImageIcon className="w-4 h-4" />
              Image
            </button>
          </div>
        </div>

        {/* Text Watermark Options */}
        {options.type === 'text' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="label">Watermark Text</label>
              <input
                type="text"
                placeholder="Enter watermark text..."
                value={options.text || ''}
                onChange={(e) =>
                  setProcessingOptions({
                    watermark: { ...options, text: e.target.value },
                  })
                }
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Font</label>
                <select
                  value={options.textOptions?.font || 'Arial'}
                  onChange={(e) =>
                    setProcessingOptions({
                      watermark: {
                        ...options,
                        textOptions: { ...options.textOptions!, font: e.target.value },
                      },
                    })
                  }
                  className="select"
                >
                  {FONTS.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={options.textOptions?.fontSize || 48}
                  onChange={(e) =>
                    setProcessingOptions({
                      watermark: {
                        ...options,
                        textOptions: {
                          ...options.textOptions!,
                          fontSize: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={options.textOptions?.color || '#ffffff'}
                    onChange={(e) =>
                      setProcessingOptions({
                        watermark: {
                          ...options,
                          textOptions: { ...options.textOptions!, color: e.target.value },
                        },
                      })
                    }
                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    {options.textOptions?.color || '#ffffff'}
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() =>
                    setProcessingOptions({
                      watermark: {
                        ...options,
                        textOptions: { ...options.textOptions!, bold: !options.textOptions?.bold },
                      },
                    })
                  }
                  className={`
                    flex-1 p-2 rounded-lg border transition-all
                    ${options.textOptions?.bold
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Bold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() =>
                    setProcessingOptions({
                      watermark: {
                        ...options,
                        textOptions: { ...options.textOptions!, italic: !options.textOptions?.italic },
                      },
                    })
                  }
                  className={`
                    flex-1 p-2 rounded-lg border transition-all
                    ${options.textOptions?.italic
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Italic className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Watermark Options */}
        {options.type === 'image' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="label">Watermark Image</label>
              {options.imageFile ? (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <img
                    src={URL.createObjectURL(options.imageFile)}
                    alt="Watermark"
                    className="w-12 h-12 object-contain bg-gray-100 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{options.imageFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(options.imageFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setProcessingOptions({
                        watermark: { ...options, imageFile: undefined },
                      })
                    }
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload watermark image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG with transparency recommended</p>
                </button>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Scale</label>
                <span className="text-sm text-gray-600">{options.scale}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={options.scale}
                onChange={(e) =>
                  setProcessingOptions({
                    watermark: { ...options, scale: parseInt(e.target.value) },
                  })
                }
                className="slider"
              />
            </div>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="label">Position</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                onClick={() =>
                  setProcessingOptions({
                    watermark: { ...options, position: pos.value as typeof options.position },
                  })
                }
                className={`
                  p-2 rounded-lg border text-sm transition-all
                  ${options.position === pos.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Opacity</label>
            <span className="text-sm text-gray-600">{options.opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={options.opacity}
            onChange={(e) =>
              setProcessingOptions({
                watermark: { ...options, opacity: parseInt(e.target.value) },
              })
            }
            className="slider"
          />
        </div>

        {/* Rotation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Rotation</label>
            <span className="text-sm text-gray-600">{options.rotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={options.rotation}
            onChange={(e) =>
              setProcessingOptions({
                watermark: { ...options, rotation: parseInt(e.target.value) },
              })
            }
            className="slider"
          />
        </div>

        {/* Random Offset */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={options.randomOffset}
            onChange={(e) =>
              setProcessingOptions({
                watermark: { ...options, randomOffset: e.target.checked },
              })
            }
            className="checkbox"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Random offset</span>
            <p className="text-xs text-gray-500">Add slight random variation to watermark position</p>
          </div>
        </label>

        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-amber-50 p-3 rounded-lg">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p>
            Use PNG with transparency for image watermarks. "Random" position helps prevent easy cropping. "Tile" covers the entire image.
          </p>
        </div>
      </div>
    </div>
  );
};
