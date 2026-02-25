import { useState, useRef } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, removeFileExtension } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_IMAGE_TYPES } from '@utils/constants'

const FORMATS = [
  { value: 'jpeg', label: 'JPEG', mime: 'image/jpeg' },
  { value: 'png', label: 'PNG', mime: 'image/png' },
  { value: 'webp', label: 'WebP', mime: 'image/webp' },
]

export default function ImageConvert() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [targetFormat, setTargetFormat] = useState('webp')
  const [quality, setQuality] = useState(90)
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const convertImage = async (file: File): Promise<Blob> => {
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

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const mimeType = FORMATS.find((f) => f.value === targetFormat)?.mime || 'image/webp'

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          mimeType,
          quality / 100
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const processConversion = async () => {
    if (files.length === 0) {
      toast.error('请先上传图片')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在转换格式...',
    })

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const blob = await convertImage(file.file)

        const fileName = removeFileExtension(file.name)
        downloadFile(blob, `${fileName}.${targetFormat}`)

        setStatus({
          status: 'processing',
          progress: ((i + 1) / files.length) * 100,
          message: `正在转换第 ${i + 1}/${files.length} 张图片...`,
        })
      }

      setStatus({
        status: 'success',
        progress: 100,
        message: '转换完成！',
      })

      toast.success(`成功转换 ${files.length} 张图片`)
    } catch (error) {
      console.error('Convert error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '转换失败，请重试',
      })
      toast.error('图片转换失败，请重试')
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={ACCEPTED_IMAGE_TYPES}
        maxFiles={10}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length > 0 && (
        <>
          <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
            <h4 className="font-medium mb-4">转换设置</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">目标格式</label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setTargetFormat(f.value)}
                      className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                        targetFormat === f.value
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-dark-600 text-gray-400 hover:border-dark-500'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  输出质量: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
              </div>
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
              onClick={processConversion}
              disabled={status.status === 'processing'}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              转换为 {targetFormat.toUpperCase()}
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
