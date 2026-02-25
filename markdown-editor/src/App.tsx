import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useEditorStore } from './store';
import Layout from './components/Layout';
import EditorPage from './pages/EditorPage';
import TemplatesPage from './pages/TemplatesPage';
import ExportPage from './pages/ExportPage';
import './App.css';

function App() {
  const { createDocument, documents } = useEditorStore();
  
  // 初始化：如果没有文档，创建一个空的
  useEffect(() => {
    if (documents.length === 0) {
      createDocument('欢迎使用', `# 欢迎使用 Markdown 编辑器

这是一个**简洁、强大**的在线 Markdown 编辑器。

## 功能特性

- ✨ **实时预览**：所见即所得的编辑体验
- 📄 **多格式导出**：支持 PDF、Word、HTML 导出
- 🧠 **思维导图**：从标题自动生成思维导图
- 📊 **表格生成器**：可视化编辑表格
- 📝 **模板库**：丰富的文档模板
- 💾 **自动保存**：本地存储，永不丢失

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl/Cmd + S | 保存 |
| Ctrl/Cmd + N | 新建文档 |
| Ctrl/Cmd + B | 粗体 |
| Ctrl/Cmd + I | 斜体 |
| Ctrl/Cmd + K | 插入链接 |

## 开始使用

点击左侧的 **"新建文档"** 按钮开始创作，或浏览 **模板库** 快速开始！

---

> 💡 **提示**：所有数据都保存在浏览器本地，清理浏览器数据会导致丢失。建议定期导出备份！
`);
    }
  }, [documents.length, createDocument]);
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EditorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="export" element={<ExportPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
