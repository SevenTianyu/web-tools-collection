import { useRef, useCallback } from 'react';
import { Upload, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface DropZoneProps {
  folderMode?: boolean;
}

export const DropZone = ({ folderMode = false }: DropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isDragging,
    isLoading,
    progress,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
  } = useImageUpload();

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFolderClick = useCallback(() => {
    folderInputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${isLoading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
            ${isDragging 
              ? 'bg-primary-500 shadow-lg shadow-primary-500/30' 
              : 'bg-primary-100'
            }
          `}>
            {isLoading ? (
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className={`
                w-10 h-10 transition-colors duration-300
                ${isDragging ? 'text-white' : 'text-primary-600'}
              `} />
            )}
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Loading Images...' : 'Drop images here'}
          </h3>
          <p className="text-gray-500 mb-4 max-w-md">
            {isLoading 
              ? `Processing... ${progress}%`
              : 'Drag and drop images or folders, or click to browse'
            }
          </p>

          {/* Supported Formats */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
            <span className="px-2 py-1 bg-gray-100 rounded">JPEG</span>
            <span className="px-2 py-1 bg-gray-100 rounded">PNG</span>
            <span className="px-2 py-1 bg-gray-100 rounded">WebP</span>
            <span className="px-2 py-1 bg-gray-100 rounded">AVIF</span>
            <span className="px-2 py-1 bg-gray-100 rounded">GIF</span>
          </div>

          {/* Action Buttons */}
          {!isLoading && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="btn-primary"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Select Images
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderClick();
                }}
                className="btn-secondary"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Select Folder
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full max-w-xs mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
