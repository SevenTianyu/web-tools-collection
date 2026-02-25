import { useState, useRef } from 'react'
import { Droplet, Download, Type, Move, Palette, Opacity } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, removeFileExtension } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_IMAGE_TYPES } from '@utils/constants'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

export default function ImageWatermark() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [text, setText] = useState('Watermark')
  const [position, setPosition] = useState<Position>('bottom-right')
  const [fontSize, setFontSize] = useState(48)
  const [opacity, setOpacity] = useState(50)
  const [color, setColor] = useState('#ffffff')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const positions: { value: Position; label: string }[] = [
    { value: 'top-left', label: '左上' },
    { value: 'top-right', label: '右上' },
    { value: 'center', label: '居中' },
    { value: 'bottom-left', label: '左下' },
    { value: 'bottom-right', label: '右下' },
  ]

  const generatePreview = async () => {
    if (files.length === 0) return

    try {
      const blob = await addWatermark(files[0].file)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Preview error:', error)
    }
  }

  const addWatermark = async (file: File): Promise<Blob> => {
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

        // Draw original image
        ctx.drawImage(img, 0, 0)

        // Calculate font size relative to image width
        const relativeFontSize = Math.max(12, (img.width / 1000) * fontSize)

        // Set watermark style
        ctx.font = `bold ${relativeFontSize}px sans-serif`
        ctx.fillStyle = color
        ctx.globalAlpha = opacity / 100

        // Calculate position
        const metrics = ctx.measureText(text)
        const textWidth = metrics.width
        const textHeight = relativeFontSize

        let x = 0
        let y = 0
        const padding = relativeFontSize

        switch (position) {
          case 'top-left':
            x = padding
            y = textHeight + padding
            break
          case 'top-right':
            x = img.width - textWidth - padding
            y = textHeight + padding
            break
          case 'center':
            x = (img.width - textWidth) / 2
            y = (img.height + textHeight) / 2
            break
          case 'bottom-left':
            x = padding
            y = img.height - padding
            break
          case 'bottom-right':
            x = img.width - textWidth - padding
            y = img.height - padding
            break
        }

        // Draw shadow for better visibility
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillText(text, x + 2, y + 2)
        ctx.restore()

        // Draw watermark text
        ctx.fillStyle = color
        ctx.fillText(text, x, y)

        ctx.globalAlpha = 1

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        }, file.type)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const processWatermark = async () => {
    if (files.length === 0) {
      toast.error('请先上传图片')
      return
    }

    if (!text.trim()) {
      toast.error('请输入水印文字')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在添加水印...',
    })

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const blob = await addWatermark(file.file)

        const fileName = removeFileExtension(file.name)
        downloadFile(blob, `${fileName}-watermarked.${file.name.split('.').pop()}`)

        setStatus({
          status: 'processing',
          progress: ((i + 1) / files.length) * 100,
          message: `正在处理第 ${i + 1}/${files.length} 张图片...`,
        })
      }

      setStatus({
        status: 'success',
        progress: 100,
        message: '处理完成！',
      })

      toast.success(`成功为 ${files.length} 张图片添加水印`)
    } catch (error) {
      console.error('Watermark error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '处理失败，请重试',
      })
      toast.error('添加水印失败，请重试')
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
          <div className="bg-dark-900 rounded-xl border border-dark-700 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-primary-400" />
              <h4 className="font-medium">水印设置</h4>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">水印文字</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入水印文字"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">位置</label>
              <div className="grid grid-cols-5 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setPosition(pos.value)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      position === pos.value
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-dark-600 text-gray-400 hover:border-dark-500'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  <Type className="w-4 h-4 inline mr-1" />
                  字体大小: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  <Opacity className="w-4 h-4 inline mr-1" />
                  透明度: {opacity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  颜色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg bg-transparent border border-dark-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="input-field flex-1 py-2"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generatePreview}
              className="btn-outline w-full py-2 text-sm"
            >
              生成预览
            </button>
          </div>

          {previewUrl && (
            <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
              <h4 className="font-medium mb-4">预览</h4>
              <div className="max-w-md mx-auto">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
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
              onClick={processWatermark}
              disabled={status.status === 'processing'}
              className="btn-primary flex items-center gap-2"
            >
              <Droplet className="w-5 h-5" />
              添加水印
            </button>

            <button
              onClick={() => {
                setFiles([])
                setPreviewUrl(null)
              }}
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
