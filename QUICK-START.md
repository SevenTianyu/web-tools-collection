# 🚀 快速启动指南

## 环境要求

- **Node.js** 18.x 或更高版本
- **npm** 9.x 或更高版本

## 安装 Node.js

### 方法1：官网下载（推荐）
1. 访问 https://nodejs.org/
2. 下载 **LTS** 版本（长期支持版）
3. 运行安装程序，保持默认设置
4. 安装完成后重启命令行

### 方法2：使用 nvm-windows（高级用户）
```powershell
# 安装 nvm-windows
# 访问 https://github.com/coreybutler/nvm-windows/releases

# 使用 nvm 安装 Node.js
nvm install 20
nvm use 20
```

## 验证安装

```bash
node --version  # 应显示 v20.x.x 或更高
npm --version   # 应显示 10.x.x 或更高
```

## 运行项目

### 方式1：双击运行脚本（最简单）
双击 `setup-and-run.bat`，按提示选择要运行的项目。

### 方式2：命令行运行

```bash
# 进入项目目录
cd d:\006Code\gefei\webtest\privacy-toolbox

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 浏览器访问 http://localhost:5173
```

## 项目端口列表

| 项目 | 端口 | 访问地址 |
|------|------|----------|
| privacy-toolbox | 5173 | http://localhost:5173 |
| ai-tools-nav | 5174 | http://localhost:5174 |
| markdown-editor | 5175 | http://localhost:5175 |
| batch-image-processor | 5176 | http://localhost:5176 |
| dev-toolkit | 5177 | http://localhost:5177 |

## 常用命令

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 部署到生产环境

详见 `deploy-guide.md`

## 常见问题

### Q1: 端口被占用
编辑 `vite.config.ts`，修改端口：
```typescript
export default defineConfig({
  server: {
    port: 3000  // 改为其他端口
  }
})
```

### Q2: 安装依赖很慢
使用淘宝镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

### Q3: 内存不足
增加 Node.js 内存限制：
```bash
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev
```
