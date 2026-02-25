import type { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'resume-basic',
    name: '基础简历',
    description: '简洁的个人简历模板，适合求职使用',
    category: 'resume',
    icon: 'User',
    tags: ['简历', '求职', '个人'],
    content: `# 张三

> 软件工程师 | zhangsan@example.com | 138-0000-0000 | 北京

## 教育背景

### XX大学（2018 - 2022）
- 计算机科学与技术 本科
- GPA: 3.8/4.0

## 工作经历

### XX科技有限公司（2022 - 至今）
**高级前端工程师**

- 负责公司核心产品的前端架构设计和开发
- 优化页面性能，首屏加载时间减少 50%
- 带领 5 人团队完成多个重要项目

## 技能

- **前端**: React, Vue, TypeScript, Tailwind CSS
- **后端**: Node.js, Python, PostgreSQL
- **工具**: Git, Docker, AWS

## 项目经历

### 电商平台重构
- 使用 React + TypeScript 重构 legacy 系统
- 实现 SSR，提升 SEO 和首屏性能
- 日活跃用户 100K+
`
  },
  {
    id: 'resume-creative',
    name: '创意简历',
    description: '设计感强的创意简历，适合设计师',
    category: 'resume',
    icon: 'Palette',
    tags: ['简历', '设计', '创意'],
    content: `# 李明 — 产品设计师

🎨 设计 · 💡 创新 · 🚀 产品

---

## 关于我

热爱设计的产品设计师，5年工作经验，专注于用户体验和界面设计。善于将复杂问题转化为简洁优雅的设计方案。

## 工作经历

| 公司 | 职位 | 时间 |
|------|------|------|
| XX设计工作室 | 高级设计师 | 2021 - 至今 |
| XX互联网公司 | UI设计师 | 2019 - 2021 |

## 技能专长

- **设计工具**: Figma, Sketch, Adobe Creative Suite
- **原型工具**: Principle, Framer, ProtoPie
- **协作工具**: Notion, Miro, Slack

## 作品链接

- Dribbble: dribbble.com/username
- Behance: behance.net/username
- 个人网站: www.example.com
`
  },
  {
    id: 'readme-standard',
    name: '标准README',
    description: 'GitHub 标准 README 模板',
    category: 'readme',
    icon: 'BookOpen',
    tags: ['README', 'GitHub', '开源'],
    content: `# 项目名称

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)

> 简短的项目描述，说明这个项目的核心功能

## 特性

- ✨ 特性一：描述主要功能
- 🚀 特性二：描述性能优势
- 🛡️ 特性三：描述安全保障
- 📱 特性四：描述多端支持

## 安装

\`\`\`bash
# 克隆项目
git clone https://github.com/username/repo.git

# 进入目录
cd repo

# 安装依赖
npm install

# 启动项目
npm run dev
\`\`\`

## 使用说明

\`\`\`javascript
import { myLibrary } from 'my-library';

// 基本用法
const result = myLibrary.doSomething();
console.log(result);
\`\`\`

## 文档

详细文档请查看 [Documentation](https://docs.example.com)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](LICENSE) © 作者名称
`
  },
  {
    id: 'report-weekly',
    name: '周报模板',
    description: '工作周报模板，适合团队汇报',
    category: 'report',
    icon: 'ClipboardList',
    tags: ['周报', '汇报', '工作'],
    content: `# 工作周报 — 第X周（2024年X月X日 - X月X日）

汇报人：XXX  
部门：XXX部门

---

## 本周工作完成情况

### 重点项目

1. **项目A**
   - 完成进度：80%
   - 主要内容：完成了前端页面开发，正在进行接口联调
   - 遇到的问题：接口文档不完整，已协调后端补充

2. **项目B**
   - 完成进度：100%
   - 主要内容：完成需求评审和技术方案设计
   - 下周计划：开始编码开发

### 日常工作

- [x] 完成代码审查 15 次
- [x] 修复线上 Bug 3 个
- [x] 编写技术文档 2 篇
- [x] 参加团队会议 4 次

## 下周工作计划

| 优先级 | 任务 | 预计完成时间 |
|--------|------|-------------|
| P0 | 完成项目A开发 | 周三 |
| P1 | 项目B技术评审 | 周二 |
| P2 | 优化首页性能 | 周五 |

## 需要协调的事项

1. 需要设计资源支持项目B的UI设计
2. 申请测试环境用于压力测试

## 心得与总结

- 本周在技术方案设计上有新的收获
- 与产品沟通更加高效
- 需要加强对项目风险的前置评估
`
  },
  {
    id: 'report-technical',
    name: '技术方案',
    description: '技术方案设计文档模板',
    category: 'report',
    icon: 'FileCode',
    tags: ['技术方案', '设计文档', '架构'],
    content: `# 技术方案 — 系统重构项目

**版本**: v1.0  
**作者**: XXX  
**日期**: 2024年X月X日

---

## 1. 背景与目标

### 1.1 项目背景

当前系统存在的问题：
- 代码耦合严重，维护困难
- 性能瓶颈明显
- 技术栈老旧

### 1.2 项目目标

- 降低系统复杂度，提高可维护性
- 提升系统性能，响应时间减少 50%
- 引入现代化技术栈

## 2. 技术选型

| 模块 | 技术 | 选型理由 |
|------|------|----------|
| 前端 | React + TypeScript | 类型安全，生态丰富 |
| 后端 | Node.js + NestJS | 统一技术栈，开发效率高 |
| 数据库 | PostgreSQL | 功能强大，支持JSON |
| 缓存 | Redis | 高性能缓存 |

## 3. 架构设计

### 3.1 整体架构

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Gateway   │────▶│  Services   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │    Data     │
                                        └─────────────┘
\`\`\`

### 3.2 核心模块

1. **用户服务**: 负责用户认证和授权
2. **业务服务**: 核心业务逻辑处理
3. **通知服务**: 消息推送和通知

## 4. 实施计划

| 阶段 | 时间 | 里程碑 |
|------|------|--------|
| 第一阶段 | 第1-2周 | 基础架构搭建 |
| 第二阶段 | 第3-4周 | 核心功能迁移 |
| 第三阶段 | 第5-6周 | 测试与优化 |
| 第四阶段 | 第7周 | 灰度发布 |

## 5. 风险评估

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 数据迁移失败 | 高 | 制定详细迁移方案，做好备份 |
| 性能不达标 | 中 | 提前进行压力测试 |
| 人员变动 | 中 | 完善文档，交叉培训 |

## 6. 附录

- 详细API文档：[链接](#)
- 数据库设计：[链接](#)
- UI设计稿：[链接](#)
`
  },
  {
    id: 'blog-tech',
    name: '技术博客',
    description: '技术文章写作模板',
    category: 'blog',
    icon: 'PenTool',
    tags: ['博客', '技术文章', '写作'],
    content: `# 深入理解 React Hooks

> 本文将深入探讨 React Hooks 的原理和最佳实践

![封面图](https://example.com/cover.png)

## 引言

React Hooks 是 React 16.8 引入的新特性，它让我们在函数组件中使用状态和其他 React 特性...

## 什么是 Hooks

Hooks 是让你可以在不编写 class 的情况下使用 state 以及其他的 React 特性。

### 常用的 Hooks

- \`useState\`：状态管理
- \`useEffect\`：副作用处理
- \`useContext\`：上下文使用
- \`useRef\`：引用管理

## 深入原理

### useState 的工作原理

\`\`\`javascript
function useState(initialValue) {
  let state = initialValue;
  
  function setState(newValue) {
    state = newValue;
    reRender();
  }
  
  return [state, setState];
}
\`\`\`

## 最佳实践

1. **只在最顶层使用 Hooks**
   - 不要在循环、条件或嵌套函数中调用 Hooks

2. **只在 React 函数中调用 Hooks**
   - 在 React 的函数组件中调用 Hooks
   - 在自定义 Hooks 中调用其他 Hooks

3. **使用 ESLint 插件**
   - 安装 \`eslint-plugin-react-hooks\`

## 自定义 Hooks

\`\`\`javascript
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}
\`\`\`

## 总结

Hooks 改变了我们编写 React 组件的方式，让代码更加简洁和复用...

---

**参考资料**

- [React 官方文档](https://react.dev)
- [Hooks FAQ](https://react.dev/reference/react)

---

*如果本文对你有帮助，欢迎点赞和分享！*
`
  },
  {
    id: 'meeting-notes',
    name: '会议纪要',
    description: '标准会议纪要模板',
    category: 'other',
    icon: 'Users',
    tags: ['会议', '纪要', '记录'],
    content: `# 会议纪要

**会议主题**: 产品需求评审  
**时间**: 2024年X月X日 14:00 - 15:30  
**地点**: 会议室A / 线上  
**记录人**: XXX

## 参会人员

- 产品部：张三、李四
- 技术部：王五、赵六
- 设计部：孙七

## 会议议程

1. 产品需求讲解（15分钟）
2. 技术可行性评估（20分钟）
3. 设计方案展示（15分钟）
4. 排期确认（10分钟）

## 讨论内容

### 1. 需求范围确认

- **结论**: MVP 版本只包含核心功能
- **行动项**: 产品整理功能优先级列表

### 2. 技术方案

- **前端**: 使用 React + TypeScript
- **后端**: 使用 Node.js
- **数据库**: PostgreSQL

### 3. 设计规范

- 遵循公司设计系统 V2.0
- 移动端优先适配

## 决议事项

| 事项 | 负责人 | 截止日期 |
|------|--------|----------|
| 需求文档完善 | 张三 | X月X日 |
| 技术方案设计 | 王五 | X月X日 |
| UI 设计初稿 | 孙七 | X月X日 |

## 下次会议

**时间**: X月X日 14:00  
**议题**: 技术方案评审

---

**备注**: 会议录音已保存至 [链接](#)
`
  }
];

export const getTemplatesByCategory = (category: Template['category']) => {
  return templates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};
