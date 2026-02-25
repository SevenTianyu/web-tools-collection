import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Minimize2, Download, FileCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, removeFileExtension } from '@utils/fileHelpers'
import { readFileAsArrayBuffer } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_PDF_TYPES } from '@utils/constants'

export default function PDFCompress() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })
  const [result, setResult] = useState<{
    originalSize: number
    compressedSize: number
    ratio: number
  } | null>(null)

  const compressPDF = async () => {
    if (files.length === 0) {
      toast.error('请先上传 PDF 文件')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在压缩 PDF...',
    })

    try {
      const arrayBuffer = await readFileAsArrayBuffer(files[0].file)
      const pdf = await PDFDocument.load(arrayBuffer)
      
      setStatus({
        status: 'processing',
        progress: 50,
        message: '正在优化 PDF 内容...',
      })

      // Compress PDF by removing unnecessary metadata and optimizing
      const pdfBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        preserveExistingEncryption: false,
      })

      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      
      const originalSize = files[0].size
      const compressedSize = blob.size
      const ratio = ((originalSize - compressedSize) / originalSize) * 100

      setResult({
        originalSize,
        compressedSize,
        ratio: Math.max(0, ratio),
      })

      const fileName = removeFileExtension(files[0].name)
      downloadFile(blob, `${fileName}-compressed.pdf`)

      setStatus({
        status: 'success',
        progress: 100,
        message: '压缩完成！',
      })
      
      toast.success('PDF 压缩成功！')
    } catch (error) {
      console.error('Compress error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '压缩失败，请重试',
      })
      toast.error('PDF 压缩失败，请重试')
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={ACCEPTED_PDF_TYPES}
        maxFiles={1}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length > 0 && (
        <>
          <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
            <h4 className="font-medium mb-4">压缩质量</h4>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    quality === q
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-600 text-gray-400 hover:border-dark-500'
                  }`}
                >
                  {q === 'low' && '低质量 (最小)'}
                  {q === 'medium' && '中等质量 (推荐)'}
                  {q === 'high' && '高质量 (较大)'}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileCheck className="w-6 h-6 text-emerald-400" />
                <h4 className="font-medium text-emerald-400">压缩完成</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">原始大小</p>
                  <p className="text-lg font-semibold">{formatFileSize(result.originalSize)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">压缩后</p>
                  <p className="text-lg font-semibold">{formatFileSize(result.compressedSize)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">节省空间</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {result.ratio.toFixed(1)}%
                  </p>
                </div>
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

          <button
            onClick={compressPDF}
            disabled={status.status === 'processing'}
            className="btn-primary flex items-center gap-2"
          >
            <Minimize2 className="w-5 h-5" />
            压缩并下载
          </button>
        </>
      )}
    </div>
  )
}
