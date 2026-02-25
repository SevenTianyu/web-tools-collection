import { useState, useCallback } from 'react';
import { useImageStore } from '@/store/useImageStore';
import { 
  X, 
  Check, 
  AlertCircle, 
  Loader2,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Grid3X3,
  List
} from 'lucide-react';
import { formatFileSize, calculateCompressionRatio } from '@/utils/imageProcessor';

export const ImageGrid = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const images = useImageStore((state) => state.images);
  const selectedImages = useImageStore((state) => state.selectedImages);
  const removeImage = useImageStore((state) => state.removeImage);
  const selectImage = useImageStore((state) => state.selectImage);
  const deselectImage = useImageStore((state) => state.deselectImage);
  const selectAll = useImageStore((state) => state.selectAll);
  const deselectAll = useImageStore((state) => state.deselectAll);

  const handleToggleSelect = useCallback((id: string) => {
    if (selectedImages.has(id)) {
      deselectImage(id);
    } else {
      selectImage(id);
    }
  }, [selectedImages, selectImage, deselectImage]);

  const allSelected = images.length > 0 && selectedImages.size === images.length;
  const someSelected = selectedImages.size > 0 && selectedImages.size < images.length;

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={() => allSelected ? deselectAll() : selectAll()}
              className="checkbox"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedImages.size} of {images.length} selected
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {selectedImages.size > 0 && (
            <button
              onClick={() => {
                selectedImages.forEach(id => removeImage(id));
              }}
              className="btn-danger text-sm"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove ({selectedImages.size})
            </button>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4' 
          : 'flex flex-col gap-2'
        }
      `}>
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedImages.has(image.id)}
            isListView={viewMode === 'list'}
            onToggleSelect={() => handleToggleSelect(image.id)}
            onRemove={() => removeImage(image.id)}
            onPreview={() => setPreviewImage(image.processedPreview || image.preview)}
            index={index}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

interface ImageCardProps {
  image: ReturnType<typeof useImageStore.getState>['images'][0];
  isSelected: boolean;
  isListView: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  onPreview: () => void;
  index: number;
}

const ImageCard = ({ 
  image, 
  isSelected, 
  isListView, 
  onToggleSelect, 
  onRemove, 
  onPreview,
  index 
}: ImageCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isListView) {
    return (
      <div className={`
        flex items-center gap-4 p-3 bg-white rounded-lg border transition-all duration-200
        ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}
        animate-fade-in
      `} style={{ animationDelay: `${index * 0.03}s` }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="checkbox"
        />
        
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          )}
          <img
            src={image.preview}
            alt={image.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {image.status === 'completed' && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
          <p className="text-xs text-gray-500">
            {image.width}×{image.height} • {formatFileSize(image.originalSize)}
            {image.processedSize && (
              <span className="ml-2 text-green-600">
                → {formatFileSize(image.processedSize)} ({calculateCompressionRatio(image.originalSize, image.processedSize)})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPreview}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      group relative bg-white rounded-xl border overflow-hidden transition-all duration-200
      ${isSelected ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-200 hover:border-gray-300'}
      animate-fade-in
    `} style={{ animationDelay: `${index * 0.03}s` }}>
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="checkbox"
        />
      </div>

      {/* Status Badge */}
      {image.status !== 'pending' && (
        <div className={`
          absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium
          ${image.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
          ${image.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
          ${image.status === 'error' ? 'bg-red-100 text-red-700' : ''}
        `}>
          {image.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {image.status === 'completed' && <Check className="w-3 h-3" />}
          {image.status === 'error' && <AlertCircle className="w-3 h-3" />}
        </div>
      )}

      {/* Image */}
      <div 
        className="relative aspect-square cursor-pointer bg-gray-100"
        onClick={onPreview}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
        <img
          src={image.processedPreview || image.preview}
          alt={image.name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-medium text-gray-900 truncate" title={image.name}>
          {image.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {image.width}×{image.height}
          </span>
          <span className="text-xs text-gray-500">
            {formatFileSize(image.originalSize)}
          </span>
        </div>
        {image.processedSize && (
          <div className="mt-1 text-xs text-green-600 font-medium">
            {formatFileSize(image.processedSize)} ({calculateCompressionRatio(image.originalSize, image.processedSize)})
          </div>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        title="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
