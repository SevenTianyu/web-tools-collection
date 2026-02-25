import { useCallback } from 'react'
import { Upload, X, File } from 'lucide-react'
import { useFileDrop } from '@hooks/useFileDrop'
import { formatFileSize } from '@utils/fileHelpers'
import type { FileInfo } from '@types'

interface FileDropzoneProps {
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  onFilesChange: (files: FileInfo[]) => void
  files: FileInfo[]
}

export default function FileDropzone({
  accept,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024,
  onFilesChange,
  files,
}: FileDropzoneProps) {
  const handleDrop = useCallback(
    (newFiles: FileInfo[]) => {
      onFilesChange([...files, ...newFiles].slice(0, maxFiles))
    },
    [files, maxFiles, onFilesChange]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useFileDrop({
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
    onDrop: handleDrop,
  })

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-400" />
            </div>
            <p className="text-lg font-medium mb-2">
              {isDragActive ? '松开以上传文件' : '拖拽文件到此处，或点击上传'}
            </p>
            <p className="text-sm text-gray-500">
              支持批量上传，最多 {maxFiles} 个文件，单个文件最大 {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">
            部分文件无法上传：{fileRejections[0].errors[0].message}
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl border border-dark-700"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              
              <button
                onClick={() => removeFile(file.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
