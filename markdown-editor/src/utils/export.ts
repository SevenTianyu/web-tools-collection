import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import { exportToHTML, renderMarkdown } from './markdown';
import type { ExportSettings } from '../types';

// 导出为 PDF
export const exportToPDF = async (
  content: string, 
  filename: string,
  settings?: Partial<ExportSettings>
): Promise<void> => {
  const htmlContent = renderMarkdown(content);
  
  const container = document.createElement('div');
  container.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 40px;
      }
      h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; page-break-after: avoid; }
      h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
      h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
      code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: Consolas, monospace; }
      pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; page-break-inside: avoid; }
      pre code { background: none; padding: 0; }
      blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; margin-left: 0; color: #6a737d; }
      table { border-collapse: collapse; width: 100%; margin: 16px 0; page-break-inside: avoid; }
      th, td { border: 1px solid #dfe2e5; padding: 12px; }
      th { background: #f6f8fa; font-weight: 600; }
      tr:nth-child(2n) { background: #f6f8fa; }
      img { max-width: 100%; height: auto; }
      a { color: #0366d6; text-decoration: none; }
      ul, ol { padding-left: 2em; }
      hr { border: none; border-top: 1px solid #e1e4e8; margin: 24px 0; }
      p { page-break-inside: avoid; }
    </style>
    <div class="markdown-body">
      ${htmlContent}
    </div>
  `;
  
  document.body.appendChild(container);
  
  const opt = {
    margin: settings?.margins || [15, 15, 15, 15],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: settings?.pageSize?.toUpperCase() || 'A4', 
      orientation: settings?.orientation || 'portrait' 
    }
  };
  
  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
};

// 导出为 Word (DOC)
export const exportToWord = (content: string, filename: string): void => {
  const htmlContent = renderMarkdown(content);
  
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        body { font-family: 'Microsoft YaHei', 'SimSun', sans-serif; line-height: 1.6; }
        h1 { font-size: 24pt; color: #333; }
        h2 { font-size: 20pt; color: #444; }
        h3 { font-size: 16pt; color: #555; }
        code { font-family: Consolas, monospace; background: #f5f5f5; padding: 2px 4px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f5f5f5; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
  
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  
  saveAs(blob, `${filename}.doc`);
};

// 导出为 HTML 文件
export const exportToHTMLFile = (content: string, filename: string): void => {
  const html = exportToHTML(content, filename);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${filename}.html`);
};

// 导出为 Markdown 文件
export const exportToMarkdown = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${filename}.md`);
};

// 导出为图片（使用 html2canvas）
export const exportToImage = async (
  element: HTMLElement, 
  filename: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> => {
  const { default: html2canvas } = await import('html2canvas');
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });
  
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `${filename}.${format}`);
    }
  }, `image/${format}`);
};

// 批量导出
export const batchExport = async (
  items: { content: string; filename: string }[],
  format: 'pdf' | 'word' | 'html' | 'md'
): Promise<void> => {
  for (const item of items) {
    switch (format) {
      case 'pdf':
        await exportToPDF(item.content, item.filename);
        break;
      case 'word':
        exportToWord(item.content, item.filename);
        break;
      case 'html':
        exportToHTMLFile(item.content, item.filename);
        break;
      case 'md':
        exportToMarkdown(item.content, item.filename);
        break;
    }
  }
};

// 读取文件内容
export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// 导入 Markdown 文件
export const importMarkdownFile = async (file: File): Promise<{ content: string; filename: string }> => {
  if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
    throw new Error('请选择 Markdown 文件 (.md 或 .markdown)');
  }
  
  const content = await readFile(file);
  const filename = file.name.replace(/\.md$|\.markdown$/, '');
  
  return { content, filename };
};
