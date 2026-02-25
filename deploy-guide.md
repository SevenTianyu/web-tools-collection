# 部署指南

## 项目结构

```
web-tools-collection/
├── privacy-toolbox/          # 隐私优先的 All-in-One 工具箱
├── ai-tools-nav/             # AI工具导航与评测网站
├── markdown-editor/          # 极简在线Markdown编辑器
├── batch-image-processor/    # 批量图片处理工具
├── dev-toolkit/              # 开发者工具集合站
└── README.md
```

## 本地开发

### 安装所有依赖
```bash
npm run install:all
```

### 启动各个项目

```bash
# 隐私工具箱 (端口 5173)
npm run dev:privacy

# AI工具导航 (端口 5174)
npm run dev:ai

# Markdown编辑器 (端口 5175)
npm run dev:markdown

# 批量图片处理 (端口 5176)
npm run dev:image

# 开发者工具 (端口 5177)
npm run dev:devkit
```

## 生产构建

```bash
npm run build:all
```

构建后的文件位于各项目的 `dist/` 目录中。

## 部署到 Vercel

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 部署各个项目
```bash
# 进入项目目录并部署
cd privacy-toolbox
vercel --prod

cd ../ai-tools-nav
vercel --prod

# ... 其他项目
```

### 3. 配置自定义域名
在 Vercel Dashboard 中为每个项目配置子域名：
- `tools.yourdomain.com` -> privacy-toolbox
- `ai.yourdomain.com` -> ai-tools-nav
- `md.yourdomain.com` -> markdown-editor
- `img.yourdomain.com` -> batch-image-processor
- `dev.yourdomain.com` -> dev-toolkit

## 部署到 Cloudflare Pages

```bash
# 安装 Wrangler
npm i -g wrangler

# 登录 Cloudflare
wrangler login

# 部署项目
cd privacy-toolbox
wrangler pages deploy dist
```

## SEO 优化检查清单

- [ ] 每个页面都有独立的 title 和 meta description
- [ ] 添加了 Open Graph 和 Twitter Card 标签
- [ ] 生成 sitemap.xml
- [ ] 配置 robots.txt
- [ ] 添加结构化数据 (JSON-LD)
- [ ] 确保移动端友好
- [ ] 优化页面加载速度

## 关键词策略

### privacy-toolbox
- "free pdf editor no upload"
- "compress image without uploading"
- "offline pdf tools"
- "privacy first file converter"

### ai-tools-nav
- "best free ai tools 2025"
- "ai tools comparison"
- "chatgpt alternatives"
- "free ai for students"

### markdown-editor
- "online markdown editor"
- "free markdown editor"
- "markdown to pdf"

### batch-image-processor
- "batch image compressor"
- "bulk image resize"
- "compress image without uploading"

### dev-toolkit
- "developer tools online"
- "json formatter"
- "regex tester"
- "base64 decode"
