import { useImageStore } from '@/store/useImageStore';
import { DropZone } from '@/components/DropZone';
import { ImageGrid } from '@/components/ImageGrid';
import { ProgressBar } from '@/components/ProgressBar';
import { ActionBar } from '@/components/ActionBar';
import { ResizeOptions } from '@/components/options/ResizeOptions';
import { Maximize2, Info } from 'lucide-react';

export const ResizePage = () => {
  const images = useImageStore((state) => state.images);
  const processingOptions = useImageStore((state) => state.processingOptions);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Bulk Image Resize
              </h1>
              <p className="text-gray-600">
                Resize multiple images at once. Choose from presets or set custom dimensions.
              </p>
            </div>
          </div>

          {/* SEO Notice */}
          <div className="flex items-start gap-2 p-4 bg-purple-50 rounded-lg text-sm text-purple-700">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Bulk image resize tool!</strong> Resize hundreds of images in seconds. 
              Includes presets for Instagram, Facebook, Twitter, YouTube, Amazon, Shopify and more. 
              All processing happens locally - no upload needed.
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
                  Upload images to start resizing
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Supports drag & drop and folder upload
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Options */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ResizeOptions />
              
              {/* Quick Tips */}
              <div className="card p-4">
                <h4 className="font-medium text-gray-900 mb-2">Resize Modes</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>Max Size:</strong> Scale down if larger than bounds</li>
                  <li><strong>Exact:</strong> Force exact dimensions</li>
                  <li><strong>Fit:</strong> Contain within box</li>
                  <li><strong>Fill:</strong> Cover and crop to fit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <ActionBar processingOptions={{ resize: processingOptions.resize, maintainFolderStructure: processingOptions.maintainFolderStructure }} />
      </div>
    </div>
  );
};
