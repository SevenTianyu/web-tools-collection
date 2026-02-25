import { useImageStore } from '@/store/useImageStore';
import { FileText, Info } from 'lucide-react';

const PLACEHOLDERS = [
  { key: '{original}', desc: 'Original filename (without extension)' },
  { key: '{index}', desc: 'Sequential number (001, 002, ...)' },
  { key: '{date}', desc: 'Current date (YYYYMMDD)' },
  { key: '{time}', desc: 'Current time (HHMMSS)' },
];

export const RenameOptions = () => {
  const options = useImageStore((state) => state.processingOptions.rename);
  const setProcessingOptions = useImageStore((state) => state.setProcessingOptions);

  if (!options) return null;

  // Preview example
  const previewFilename = options.pattern
    .replace(/\{original\}/g, 'vacation_photo')
    .replace(/\{index\}/g, '001')
    .replace(/\{date\}/g, new Date().toISOString().split('T')[0].replace(/-/g, ''))
    .replace(/\{time\}/g, new Date().toTimeString().split(' ')[0].replace(/:/g, ''));

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
          <FileText className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Rename Settings</h3>
          <p className="text-sm text-gray-500">Organize files with custom naming patterns</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pattern Input */}
        <div>
          <label className="label">Naming Pattern</label>
          <input
            type="text"
            placeholder="{original}_{index}"
            value={options.pattern}
            onChange={(e) =>
              setProcessingOptions({
                rename: { ...options, pattern: e.target.value },
              })
            }
            className="input font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Preview: <span className="font-mono text-primary-600">{previewFilename}.jpg</span>
          </p>
        </div>

        {/* Placeholders */}
        <div>
          <label className="label text-xs uppercase tracking-wider text-gray-400">Available Placeholders</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {PLACEHOLDERS.map((ph) => (
              <button
                key={ph.key}
                onClick={() =>
                  setProcessingOptions({
                    rename: { ...options, pattern: options.pattern + ph.key },
                  })
                }
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <code className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                  {ph.key}
                </code>
                <p className="text-xs text-gray-500 mt-1">{ph.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Start Index */}
        <div>
          <label className="label">Start Index</label>
          <input
            type="number"
            min="0"
            max="9999"
            value={options.startIndex}
            onChange={(e) =>
              setProcessingOptions({
                rename: { ...options, startIndex: parseInt(e.target.value) || 0 },
              })
            }
            className="input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Index will be padded to 3 digits (e.g., 1 → 001)
          </p>
        </div>

        {/* Custom Suffix */}
        <div>
          <label className="label">Custom Suffix (Optional)</label>
          <input
            type="text"
            placeholder="_edited"
            value={options.customSuffix || ''}
            onChange={(e) =>
              setProcessingOptions({
                rename: { ...options, customSuffix: e.target.value || undefined },
              })
            }
            className="input"
          />
        </div>

        {/* Preserve Original Name */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={options.preserveOriginal}
            onChange={(e) =>
              setProcessingOptions({
                rename: { ...options, preserveOriginal: e.target.checked },
              })
            }
            className="checkbox"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Preserve original names</span>
            <p className="text-xs text-gray-500">Keep original filename if pattern is empty</p>
          </div>
        </label>

        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-pink-50 p-3 rounded-lg">
          <Info className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Examples:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li>• vacation_&#123;index&#125; → vacation_001.jpg</li>
              <li>->&#123;date&#125;_&#123;original&#125; → 20240115_photo.jpg</li>
              <li>• IMG_&#123;index&#125;_edited → IMG_001_edited.jpg</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
