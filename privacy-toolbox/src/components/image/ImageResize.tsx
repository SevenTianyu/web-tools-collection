import { useState, useRef, useCallback } from 'react'
import { Maximize, Download, Lock, Unlock } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, removeFileExtension } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_IMAGE_TYPES } from '@utils/constants'

export default function ImageResize() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [format, setFormat] = useState<'original' | 'jpeg' | 'png' | 'webp'>('original')
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })
  const [aspectRatio, setAspectRatio] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = useCallback((newFiles: FileInfo[]) => {
    setFiles(newFiles)
    if (newFiles.length > 0) {
      // Load first image to get dimensions
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
        setAspectRatio(img.width / img.height)
      }
      img.src = newFiles[0].preview || ''
    }
  }, [])

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const resizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) {
          reject(new Error('Canvas not available'))
          return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        canvas.width = width
        canvas.height = height

        // Use better quality scaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(img, 0, 0, width, height)

        const outputFormat = format === 'original' ? file.type : `image/${format}`
        const mimeType = outputFormat === 'image/jpg' ? 'image/jpeg' : outputFormat

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          mimeType,
          0.92
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const processResize = async () => {
    if (files.length === 0) {
      toast.error('请先上传图片')
      return
    }

    if (width < 1 || height < 1) {
      toast.error('请输入有效的尺寸')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在调整图片尺寸...',
    })

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const blob = await resizeImage(file.file)

        const fileName = removeFileExtension(file.name)
        const ext = format === 'original' ? file.name.split('.').pop() : format
        downloadFile(blob, `${fileName}-${width}x${height}.${ext}`)

        setStatus({
          status: 'processing',
          progress: ((i + 1) / files.length) * 100,
          message: `正在处理第 ${i + 1}/${files.length} 张图片...`,
        })
      }

      setStatus({
        status: 'success',
        progress: 100,
        message: '调整完成！',
      })

      toast.success(`成功调整 ${files.length} 张图片尺寸`)
    } catch (error) {
      console.error('Resize error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '处理失败，请重试',
      })
      toast.error('图片调整失败，请重试')
    }
  }

  const presets = [
    { name: '原图尺寸', w: 0, h: 0 },
    { name: '1920x1080 (FHD)', w: 1920, h: 1080 },
    { name: '1280x720 (HD)', w: 1280, h: 720 },
    { name: '800x600', w: 800, h: 600 },
    { name: '512x512', w: 512, h: 512 },
    { name: '256x256', w: 256, h: 256 },
  ]

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={ACCEPTED_IMAGE_TYPES}
        maxFiles={10}
        files={files}
        onFilesChange={handleFileChange}
      />

      {files.length > 0 && (
        <>
          <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
            <h4 className="font-medium mb-4">尺寸设置</h4>

            <div className="flex flex-wrap gap-2 mb-6">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    if (preset.w === 0) {
                      // Reset to original
                      if (files[0]?.preview) {
                        const img = new Image()
                        img.onload = () => {
                          setWidth(img.width)
                          setHeight(img.height)
                          setAspectRatio(img.width / img.height)
                        }
                        img.src = files[0].preview || ''
                      }
                    } else {
                      setWidth(preset.w)
                      setHeight(preset.h)
                    }
                  }}
                  className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-sm rounded-lg transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">宽度 (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">高度 (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">输出格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof format)}
                  className="input-field"
                >
                  <option value="original">保持原格式</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {maintainAspectRatio ? (
                    <Lock className="w-4 h-4 text-primary-400" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  保持宽高比
                </button>
              </label>
            </div>
          </div>

          {status.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{status.message}</span>
                <span>{Math.round(status.progress)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={processResize}
              disabled={status.status === 'processing'}
              className="btn-primary flex items-center gap-2"
            >
              <Maximize className="w-5 h-5" />
              调整尺寸
            </button>

            <button
              onClick={() => setFiles([])}
              disabled={status.status === 'processing'}
              className="btn-outline flex items-center gap-2"
            >
              清空列表
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
