import { useImageStore } from '@/store/useImageStore';
import { DropZone } from '@/components/DropZone';
import { ImageGrid } from '@/components/ImageGrid';
import { ProgressBar } from '@/components/ProgressBar';
import { ActionBar } from '@/components/ActionBar';
import { FormatOptions } from '@/components/options/FormatOptions';
import { FileType, Info } from 'lucide-react';

export const ConvertPage = () => {
  const images = useImageStore((state) => state.images);
  const processingOptions = useImageStore((state) => state.processingOptions);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FileType className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Batch Format Converter
              </h1>
              <p className="text-gray-600">
                Convert images between formats. Support for JPEG, PNG, WebP, and AVIF.
              </p>
            </div>
          </div>

          {/* SEO Notice */}
          <div className="flex items-start gap-2 p-4 bg-green-50 rounded-lg text-sm text-green-700">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Convert images to any format!</strong> Batch convert between JPEG, PNG, WebP, and AVIF. 
              WebP offers 30% smaller files than JPEG. AVIF provides the best compression. 
              All conversions happen in your browser - no upload required.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <DropZone />

            {/* Progress Bar */}
            <ProgressBar />

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Images ({images.length})
                </h2>
                <ImageGrid />
              </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">
                  Upload images to convert format
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Select target format from the options panel
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Options */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <FormatOptions />
              
              {/* Format Comparison */}
              <div className="card p-4">
                <h4 className="font-medium text-gray-900 mb-2">Format Guide</h4>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">WebP</div>
                    <p className="text-xs text-gray-600">Best for web. 30% smaller than JPEG.</p>
                  </div>
                  <div>
                    <div className="font-medium text-sm">AVIF</div>
                    <p className="text-xs text-gray-600">Next-gen format. Smallest file size.</p>
                  </div>
                  <div>
                    <div className="font-medium text-sm">PNG</div>
                    <p className="text-xs text-gray-600">Lossless quality. Use for transparency.</p>
                  </div>
                  <div>
                    <div className="font-medium text-sm">JPEG</div>
                    <p className="text-xs text-gray-600">Universal support. Best for photos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <ActionBar processingOptions={{ format: processingOptions.format, maintainFolderStructure: processingOptions.maintainFolderStructure }} />
      </div>
    </div>
  );
};
