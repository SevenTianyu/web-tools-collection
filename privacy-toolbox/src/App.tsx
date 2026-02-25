import { Routes, Route } from 'react-router-dom'
import Layout from '@components/common/Layout'
import HomePage from '@pages/HomePage'
import ToolPage from '@pages/ToolPage'
import NotFoundPage from '@pages/NotFoundPage'
import { TOOLS } from '@utils/constants'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {TOOLS.map((tool) => (
          <Route
            key={tool.id}
            path={tool.path}
            element={<ToolPage tool={tool} />}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
