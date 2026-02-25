import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getToolById } from '@/utils/tools';

interface ToolPageProps {
  toolId: string;
  title?: string;
  description?: string;
  keywords?: string;
  children: React.ReactNode;
}

export default function ToolPage({ toolId, title, description, keywords, children }: ToolPageProps) {
  const location = useLocation();
  const tool = getToolById(toolId);
  
  const pageTitle = title || tool?.name || 'Tool';
  const pageDescription = description || tool?.description || '';
  const pageKeywords = keywords || tool?.keywords?.join(', ') || '';

  useEffect(() => {
    document.title = `${pageTitle} - Dev Toolkit`;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && pageKeywords) {
      metaKeywords.setAttribute('content', pageKeywords);
    }

    return () => {
      document.title = 'Dev Toolkit - Developer Tools Online';
    };
  }, [pageTitle, pageDescription, pageKeywords]);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-100">{pageTitle}</span>
      </nav>

      {/* Back Button (Mobile) */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 lg:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to tools
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {pageTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          {pageDescription}
        </p>
        {pageKeywords && (
          <div className="mt-3 flex flex-wrap gap-2">
            {pageKeywords.split(', ').slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tool Content */}
      {children}
    </div>
  );
}
