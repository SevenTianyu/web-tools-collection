import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function downloadFile(blob: Blob, filename: string): void {
  saveAs(blob, filename)
}

export async function createZip(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const zip = new JSZip()
  
  files.forEach(({ name, blob }) => {
    zip.file(name, blob)
  })
  
  return await zip.generateAsync({ type: 'blob' })
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
}

export function removeFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename
}

export function generateUniqueFilename(originalName: string, suffix?: string): string {
  const name = removeFileExtension(originalName)
  const ext = getFileExtension(originalName)
  const timestamp = Date.now()
  const suffixStr = suffix ? `-${suffix}` : ''
  return `${name}${suffixStr}-${timestamp}.${ext}`
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type.includes('*')) {
      const [category] = type.split('/')
      return file.type.startsWith(`${category}/`)
    }
    return file.type === type
  })
}
