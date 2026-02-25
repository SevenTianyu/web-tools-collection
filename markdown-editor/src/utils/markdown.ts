import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import type { MindMapNode } from '../types';

// 配置 marked
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
  sanitize: false
});

// 渲染 Markdown 为 HTML
export const renderMarkdown = (content: string): string => {
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return `<p class="text-red-500">Error parsing markdown: ${error}</p>`;
  }
};

// 从 Markdown 提取标题结构生成思维导图
export const extractMindMapData = (content: string): MindMapNode => {
  const lines = content.split('\n');
  const root: MindMapNode = {
    id: 'root',
    text: '文档结构',
    level: 0,
    children: []
  };
  
  const stack: MindMapNode[] = [root];
  let currentTitle = '';
  
  // 尝试从第一行获取文档标题
  const firstLine = lines[0].trim();
  if (firstLine.startsWith('# ')) {
    currentTitle = firstLine.replace('# ', '').trim();
    root.text = currentTitle;
  }
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      
      const node: MindMapNode = {
        id: `node-${index}`,
        text,
        level,
        children: []
      };
      
      // 找到正确的父节点
      while (stack.length > level) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1];
      parent.children.push(node);
      stack.push(node);
    }
  });
  
  return root;
};

// 生成目录
export const generateTableOfContents = (content: string): string => {
  const lines = content.split('\n');
  let toc = '## 目录\n\n';
  
  lines.forEach((line) => {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const indent = '  '.repeat(level - 2);
      const anchor = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc += `${indent}- [${text}](#${anchor})\n`;
    }
  });
  
  return toc;
};

// 生成表格 Markdown
export const generateTableMarkdown = (rows: number, cols: number, data?: string[][]): string => {
  let table = '';
  
  // 表头
  for (let c = 0; c < cols; c++) {
    table += `| 列${c + 1} `;
  }
  table += '|\n';
  
  // 分隔符
  for (let c = 0; c < cols; c++) {
    table += '| --- ';
  }
  table += '|\n';
  
  // 数据行
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = data?.[r]?.[c] || '';
      table += `| ${cell} `;
    }
    table += '|\n';
  }
  
  return table;
};

// 统计文档信息
export const getDocumentStats = (content: string) => {
  const lines = content.split('\n');
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const chars = content.length;
  const readingTime = Math.ceil(words / 200); // 假设阅读速度 200 字/分钟
  
  // 统计各级标题数量
  const headings = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  let codeBlocks = 0;
  let tables = 0;
  
  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,6})\s/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      headings[`h${level}`]++;
    }
    if (line.startsWith('```')) codeBlocks++;
    if (line.includes('|')) tables++;
  });
  
  return {
    lines: lines.length,
    words,
    chars,
    readingTime,
    headings,
    codeBlocks: Math.floor(codeBlocks / 2),
    tables: Math.floor(tables / 2)
  };
};

// 导出为 HTML（完整文档）
export const exportToHTML = (content: string, title: string = 'Document'): string => {
  const htmlContent = renderMarkdown(content);
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: Consolas, monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; margin-left: 0; color: #6a737d; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #dfe2e5; padding: 12px; }
    th { background: #f6f8fa; font-weight: 600; }
    tr:nth-child(2n) { background: #f6f8fa; }
    img { max-width: 100%; height: auto; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul, ol { padding-left: 2em; }
    hr { border: none; border-top: 1px solid #e1e4e8; margin: 24px 0; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
};

// 清理 Markdown（移除 frontmatter 等）
export const cleanMarkdown = (content: string): string => {
  // 移除 YAML frontmatter
  return content.replace(/^---\n[\s\S]*?\n---\n/, '');
};
