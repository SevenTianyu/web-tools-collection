import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HomePage } from '@/pages/HomePage';
import { CompressPage } from '@/pages/CompressPage';
import { ResizePage } from '@/pages/ResizePage';
import { WatermarkPage } from '@/pages/WatermarkPage';
import { ConvertPage } from '@/pages/ConvertPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compress" element={<CompressPage />} />
          <Route path="/resize" element={<ResizePage />} />
          <Route path="/watermark" element={<WatermarkPage />} />
          <Route path="/convert" element={<ConvertPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
