import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import { FilePlus, Download, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, generateUniqueFilename } from '@utils/fileHelpers'
import { readFileAsArrayBuffer } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_PDF_TYPES } from '@utils/constants'

export default function PDFMerge() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= files.length) return
    
    const newFiles = [...files]
    const [movedFile] = newFiles.splice(index, 1)
    newFiles.splice(newIndex, 0, movedFile)
    setFiles(newFiles)
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error('请至少上传 2 个 PDF 文件')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在合并 PDF 文件...',
    })

    try {
      const mergedPdf = await PDFDocument.create()
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await readFileAsArrayBuffer(file.file)
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        
        pages.forEach((page) => mergedPdf.addPage(page))
        
        setStatus({
          status: 'processing',
          progress: ((i + 1) / files.length) * 100,
          message: `正在处理第 ${i + 1}/${files.length} 个文件...`,
        })
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      
      downloadFile(blob, generateUniqueFilename('merged.pdf'))
      
      setStatus({
        status: 'success',
        progress: 100,
        message: '合并完成！',
      })
      
      toast.success('PDF 合并成功！')
    } catch (error) {
      console.error('Merge error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '合并失败，请重试',
      })
      toast.error('PDF 合并失败，请重试')
    }
  }

  const totalSize = files.reduce((acc, f) => acc + f.size, 0)

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={ACCEPTED_PDF_TYPES}
        maxFiles={20}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length > 0 && (
        <>
          <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
            <div className="px-4 py-3 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
              <span className="text-sm font-medium">
                已选择 {files.length} 个文件
              </span>
              <span className="text-sm text-gray-500">
                总计: {formatFileSize(totalSize)}
              </span>
            </div>
            
            <div className="divide-y divide-dark-700">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-dark-800/50 transition-colors"
                >
                  <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
              onClick={mergePDFs}
              disabled={files.length < 2 || status.status === 'processing'}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              合并并下载
            </button>
            
            <button
              onClick={() => setFiles([])}
              disabled={status.status === 'processing'}
              className="btn-outline flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              清空列表
            </button>
          </div>
        </>
      )}
    </div>
  )
}
