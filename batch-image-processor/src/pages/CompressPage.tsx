import { useImageStore } from '@/store/useImageStore';
import { DropZone } from '@/components/DropZone';
import { ImageGrid } from '@/components/ImageGrid';
import { ProgressBar } from '@/components/ProgressBar';
import { ActionBar } from '@/components/ActionBar';
import { CompressOptions } from '@/components/options/CompressOptions';
import { Minimize2, Info } from 'lucide-react';

export const CompressPage = () => {
  const images = useImageStore((state) => state.images);
  const processingOptions = useImageStore((state) => state.processingOptions);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Minimize2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Batch Image Compressor
              </h1>
              <p className="text-gray-600">
                Reduce file size while maintaining quality. Your images never leave your browser.
              </p>
            </div>
          </div>

          {/* SEO Notice */}
          <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Compress images without uploading!</strong> This tool processes all images locally in your browser. 
              Perfect for batch image compression with privacy protection. Supports JPEG, PNG, WebP, and AVIF formats.
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
                  Upload images to start compressing
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Drag and drop or click the upload area above
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Options */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CompressOptions />
              
              {/* Quick Tips */}
              <div className="card p-4">
                <h4 className="font-medium text-gray-900 mb-2">Quick Tips</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Quality 80-90% is ideal for web use</li>
                  <li>• Enable EXIF preservation to keep metadata</li>
                  <li>• Set max dimensions to resize while compressing</li>
                  <li>• Processed images maintain original format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <ActionBar processingOptions={{ compress: processingOptions.compress, maintainFolderStructure: processingOptions.maintainFolderStructure }} />
      </div>
    </div>
  );
};
