import { useState, useRef, useCallback } from 'react'
import { ImageMinus, Download, RotateCcw, Sliders } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, removeFileExtension } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_IMAGE_TYPES } from '@utils/constants'

export default function ImageCompress() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState<'original' | 'jpeg' | 'png' | 'webp'>('original')
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })
  const [results, setResults] = useState<
    { name: string; originalSize: number; compressedSize: number; preview: string }[]
  >([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const compressImage = useCallback(
    async (file: File): Promise<{ blob: Blob; preview: string }> => {
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

          const outputFormat = format === 'original' ? file.type : `image/${format}`
          const mimeType = outputFormat === 'image/jpg' ? 'image/jpeg' : outputFormat

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const preview = URL.createObjectURL(blob)
                resolve({ blob, preview })
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
    },
    [format, quality]
  )

  const processImages = async () => {
    if (files.length === 0) {
      toast.error('请先上传图片')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在压缩图片...',
    })

    const newResults: typeof results = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { blob, preview } = await compressImage(file.file)

        newResults.push({
          name: file.name,
          originalSize: file.size,
          compressedSize: blob.size,
          preview,
        })

        const fileName = removeFileExtension(file.name)
        const ext = format === 'original' ? file.name.split('.').pop() : format
        downloadFile(blob, `${fileName}-compressed.${ext}`)

        setStatus({
          status: 'processing',
          progress: ((i + 1) / files.length) * 100,
          message: `正在处理第 ${i + 1}/${files.length} 张图片...`,
        })
      }

      setResults(newResults)

      setStatus({
        status: 'success',
        progress: 100,
        message: '压缩完成！',
      })

      toast.success(`成功压缩 ${files.length} 张图片`)
    } catch (error) {
      console.error('Compress error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '压缩失败，请重试',
      })
      toast.error('图片压缩失败，请重试')
    }
  }

  const totalOriginalSize = results.reduce((acc, r) => acc + r.originalSize, 0)
  const totalCompressedSize = results.reduce((acc, r) => acc + r.compressedSize, 0)
  const totalSaved = totalOriginalSize - totalCompressedSize
  const totalRatio = totalOriginalSize > 0 ? (totalSaved / totalOriginalSize) * 100 : 0

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
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-primary-400" />
              <h4 className="font-medium">压缩设置</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  压缩质量: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>低质量 (小文件)</span>
                  <span>高质量 (大文件)</span>
                </div>
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
                  <option value="webp">WebP (推荐)</option>
                </select>
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="grid grid-cols-4 gap-4 text-center mb-4">
                <div>
                  <p className="text-xs text-gray-500">原始大小</p>
                  <p className="text-lg font-semibold">{formatFileSize(totalOriginalSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">压缩后</p>
                  <p className="text-lg font-semibold">{formatFileSize(totalCompressedSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">节省</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {formatFileSize(totalSaved)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">压缩率</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {totalRatio.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {results.map((result, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={result.preview}
                      alt={result.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center text-xs">
                      <p className="text-gray-300">{formatFileSize(result.originalSize)}</p>
                      <p className="text-emerald-400">→ {formatFileSize(result.compressedSize)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              onClick={processImages}
              disabled={status.status === 'processing'}
              className="btn-primary flex items-center gap-2"
            >
              <ImageMinus className="w-5 h-5" />
              压缩并下载
            </button>

            <button
              onClick={() => {
                setFiles([])
                setResults([])
              }}
              disabled={status.status === 'processing'}
              className="btn-outline flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              重新开始
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
