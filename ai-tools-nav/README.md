# AI Tools Nav - AI工具导航与评测网站

一个基于 React + TypeScript + Vite 构建的现代化AI工具导航平台，帮助用户发现、对比和评测最佳AI工具。

## 核心功能

- 🔍 **AI工具分类目录**：写作、图像、视频、代码、音频等10大分类
- 📊 **详细对比评测**：免费版 vs 付费版对比表格
- 📚 **使用教程和案例分享**：深度评测文章和使用指南
- ⭐ **用户评分和评价系统**：真实用户评价和反馈
- 🆕 **每日/每周新工具推荐**：最新AI工具发现
- 🔎 **搜索和筛选功能**：多维度工具筛选

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **路由**：React Router DOM
- **图标**：Lucide React
- **UI组件**：自定义组件库

## 项目结构

```
ai-tools-nav/
├── src/
│   ├── components/          # 组件
│   │   ├── ui/             # 基础UI组件
│   │   ├── Header.tsx      # 导航头部
│   │   ├── Footer.tsx      # 页脚
│   │   ├── ToolCard.tsx    # 工具卡片
│   │   ├── CategoryCard.tsx # 分类卡片
│   │   └── BlogCard.tsx    # 博客卡片
│   ├── pages/              # 页面
│   │   ├── HomePage.tsx    # 首页
│   │   ├── CategoryPage.tsx # 分类页
│   │   ├── ToolDetailPage.tsx # 工具详情
│   │   ├── ComparePage.tsx # 对比页
│   │   ├── BlogPage.tsx    # 博客列表
│   │   ├── BlogPostPage.tsx # 博客详情
│   │   ├── SearchPage.tsx  # 搜索页
│   │   └── RankingPage.tsx # 排行榜
│   ├── data/               # 数据文件
│   │   ├── categories.ts   # 分类数据
│   │   ├── tools.ts        # 工具数据
│   │   └── blog.ts         # 博客数据
│   ├── types/              # TypeScript类型
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建后的文件位于 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## SEO优化

- 每个页面都有独立的 title 和 meta description
- 支持关键词优化："best free ai tools 2025", "ai tools comparison", "chatgpt alternatives"
- 工具详情页包含丰富的结构化数据
- 响应式设计，支持移动端

## 待办事项

- [ ] 添加更多AI工具数据
- [ ] 实现后端API接口
- [ ] 添加用户登录和收藏功能
- [ ] 实现真实的评价系统
- [ ] 添加暗黑模式
- [ ] 多语言支持（i18n）

## 许可证

MIT License
