# Markdown Editor

极简在线 Markdown 编辑器 - 支持实时预览、PDF 导出、思维导图生成

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-3178C6.svg)
![Vite](https://img.shields.io/badge/vite-5.0-646CFF.svg)

## 功能特性

- ✨ **实时预览**：所见即所得的编辑体验，分屏/纯编辑/纯预览三种模式
- 📄 **多格式导出**：支持 PDF、Word、HTML、Markdown 导出
- 🧠 **思维导图**：从 Markdown 标题结构自动生成思维导图
- 📊 **表格生成器**：可视化编辑表格，自动生成 Markdown 代码
- 📝 **模板库**：丰富的文档模板（简历、报告、README、博客等）
- 💾 **自动保存**：本地存储，永不丢失数据
- 📱 **PWA 支持**：可离线使用，支持安装为桌面应用
- ⌨️ **快捷键**：完整的键盘快捷键支持

## 技术栈

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- Zustand（状态管理）
- Marked（Markdown 解析）
- html2pdf.js（PDF 导出）
- D3.js（思维导图）

## 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd markdown-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
markdown-editor/
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   ├── pages/           # 页面
│   ├── hooks/           # 自定义 Hooks
│   ├── utils/           # 工具函数
│   ├── store/           # 状态管理
│   ├── templates/       # 文档模板
│   ├── types/           # TypeScript 类型
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl/Cmd + S | 保存文档 |
| Ctrl/Cmd + N | 新建文档 |
| Ctrl/Cmd + O | 导入文件 |
| Ctrl/Cmd + E | 导出文档 |
| Ctrl/Cmd + B | 粗体 |
| Ctrl/Cmd + I | 斜体 |
| Ctrl/Cmd + K | 插入链接 |
| Ctrl/Cmd + H | 插入标题 |
| Ctrl/Cmd + P | 切换预览模式 |
| Ctrl/Cmd + Z | 撤销 |
| Ctrl/Cmd + Shift + Z | 重做 |

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## SEO

本项目针对以下关键词进行优化：
- online markdown editor
- free markdown editor
- markdown to pdf
- markdown editor
- markdown preview

## 许可证

MIT License
