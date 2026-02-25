import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Scissors, Download, Trash2, Plus, File } from 'lucide-react'
import toast from 'react-hot-toast'
import FileDropzone from '@components/common/FileDropzone'
import { formatFileSize, downloadFile, removeFileExtension } from '@utils/fileHelpers'
import { readFileAsArrayBuffer } from '@utils/fileHelpers'
import type { FileInfo, ProcessingStatus } from '@types'
import { ACCEPTED_PDF_TYPES } from '@utils/constants'

interface PageRange {
  id: string
  start: number
  end: number
}

export default function PDFSplit() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [ranges, setRanges] = useState<PageRange[]>([
    { id: '1', start: 1, end: 1 },
  ])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: '',
  })

  const handleFilesChange = async (newFiles: FileInfo[]) => {
    setFiles(newFiles)
    if (newFiles.length > 0) {
      try {
        const arrayBuffer = await readFileAsArrayBuffer(newFiles[0].file)
        const pdf = await PDFDocument.load(arrayBuffer)
        setTotalPages(pdf.getPageCount())
        setRanges([{ id: '1', start: 1, end: pdf.getPageCount() }])
      } catch (error) {
        toast.error('无法读取 PDF 文件')
      }
    } else {
      setTotalPages(0)
      setRanges([{ id: '1', start: 1, end: 1 }])
    }
  }

  const addRange = () => {
    setRanges([
      ...ranges,
      { id: Math.random().toString(36).substr(2, 9), start: 1, end: totalPages },
    ])
  }

  const removeRange = (id: string) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter((r) => r.id !== id))
    }
  }

  const updateRange = (id: string, field: 'start' | 'end', value: number) => {
    setRanges(
      ranges.map((r) => ({
        ...r,
        [field]: Math.max(1, Math.min(totalPages, value)),
      }))
    )
  }

  const splitPDF = async () => {
    if (files.length === 0) {
      toast.error('请先上传 PDF 文件')
      return
    }

    setStatus({
      status: 'processing',
      progress: 0,
      message: '正在拆分 PDF...',
    })

    try {
      const arrayBuffer = await readFileAsArrayBuffer(files[0].file)
      const pdf = await PDFDocument.load(arrayBuffer)
      const fileName = removeFileExtension(files[0].name)

      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i]
        const newPdf = await PDFDocument.create()
        
        const pageIndices = []
        for (let p = range.start - 1; p < range.end; p++) {
          pageIndices.push(p)
        }
        
        const pages = await newPdf.copyPages(pdf, pageIndices)
        pages.forEach((page) => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        
        downloadFile(blob, `${fileName}-pages-${range.start}-${range.end}.pdf`)
        
        setStatus({
          status: 'processing',
          progress: ((i + 1) / ranges.length) * 100,
          message: `正在生成第 ${i + 1}/${ranges.length} 个文件...`,
        })
      }

      setStatus({
        status: 'success',
        progress: 100,
        message: '拆分完成！',
      })
      
      toast.success(`PDF 拆分成功！已生成 ${ranges.length} 个文件`)
    } catch (error) {
      console.error('Split error:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: '拆分失败，请重试',
      })
      toast.error('PDF 拆分失败，请重试')
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={ACCEPTED_PDF_TYPES}
        maxFiles={1}
        files={files}
        onFilesChange={handleFilesChange}
      />

      {files.length > 0 && totalPages > 0 && (
        <>
          <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
            <div className="flex items-center gap-3 mb-4">
              <File className="w-8 h-8 text-red-400" />
              <div>
                <p className="font-medium">{files[0].name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(files[0].size)} · 共 {totalPages} 页
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">拆分范围</h4>
                <button
                  onClick={addRange}
                  className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加范围
                </button>
              </div>

              {ranges.map((range, index) => (
                <div
                  key={range.id}
                  className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg"
                >
                  <span className="text-sm text-gray-500 w-16">范围 {index + 1}</span>
                  
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={range.start}
                      onChange={(e) => updateRange(range.id, 'start', parseInt(e.target.value))}
                      className="input-field w-20 py-2"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={range.end}
                      onChange={(e) => updateRange(range.id, 'end', parseInt(e.target.value))}
                      className="input-field w-20 py-2"
                    />
                    <span className="text-sm text-gray-500">页</span>
                  </div>

                  {ranges.length > 1 && (
                    <button
                      onClick={() => removeRange(range.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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

          <button
            onClick={splitPDF}
            disabled={status.status === 'processing'}
            className="btn-primary flex items-center gap-2"
          >
            <Scissors className="w-5 h-5" />
            拆分并下载
          </button>
        </>
      )}
    </div>
  )
}
