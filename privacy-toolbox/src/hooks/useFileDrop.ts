import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileInfo } from '@types'

interface UseFileDropOptions {
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  onDrop?: (files: FileInfo[]) => void
}

export function useFileDrop(options: UseFileDropOptions = {}) {
  const { accept, maxFiles = 10, maxSize = 100 * 1024 * 1024, onDrop } = options
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const createFileInfo = async (file: File): Promise<FileInfo> => {
    const fileInfo: FileInfo = {
      file,
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
    }

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      fileInfo.preview = URL.createObjectURL(file)
    }

    return fileInfo
  }

  const onDropCallback = useCallback(
    async (acceptedFiles: File[]) => {
      const fileInfos = await Promise.all(acceptedFiles.map(createFileInfo))
      setFiles(fileInfos)
      onDrop?.(fileInfos)
    },
    [onDrop]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    onDrop: onDropCallback,
  })

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const clearFiles = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }

  const addFiles = async (newFiles: File[]) => {
    const fileInfos = await Promise.all(newFiles.map(createFileInfo))
    setFiles((prev) => [...prev, ...fileInfos])
  }

  return {
    files,
    setFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragging,
    setIsDragging,
    removeFile,
    clearFiles,
    addFiles,
    fileRejections,
    totalSize: files.reduce((acc, file) => acc + file.size, 0),
  }
}
