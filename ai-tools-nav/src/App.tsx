import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ToolDetailPage } from '@/pages/ToolDetailPage';
import { ComparePage } from '@/pages/ComparePage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { SearchPage } from '@/pages/SearchPage';
import { RankingPage } from '@/pages/RankingPage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/tool/:slug" element={<ToolDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
