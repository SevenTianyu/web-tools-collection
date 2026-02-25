import { Link } from 'react-router-dom';
import { 
  FileJson, Search, Code, Database, Minimize2, GitBranch,
  Send, Key, Fingerprint, Clock, Hash, Calendar, Wrench, ArrowRight
} from 'lucide-react';
import { tools } from '@/utils/tools';
import type { Tool } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileJson,
  Search,
  Code,
  Database,
  Minimize2,
  GitBranch,
  Send,
  Key,
  Fingerprint,
  Clock,
  Hash,
  Calendar,
};

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = iconMap[tool.icon] || Wrench;
  
  return (
    <Link
      to={tool.path}
      className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {tool.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {tool.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <div className="text-center py-12 lg:py-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
        <Wrench className="w-4 h-4" />
        <span>Free Online Developer Tools</span>
      </div>
      
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Developer Tools
        <span className="text-blue-600 dark:text-blue-400"> Online</span>
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
        A collection of free online developer tools including JSON formatter, 
        regex tester, Base64 decoder, SQL formatter, and more. 
        All tools work offline in your browser.
      </p>

      <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          No server required
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Works offline
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Free forever
        </span>
      </div>
    </div>
  );
}

function CategorySection({ category, tools }: { category: string; tools: Tool[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        {category}
        <span className="text-sm font-normal text-gray-500">({tools.length})</span>
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const categories = [...new Set(tools.map(t => t.category))];
  
  return (
    <div className="animate-fade-in">
      <Hero />
      
      <div className="mt-8">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            tools={tools.filter(t => t.category === category)}
          />
        ))}
      </div>

      {/* SEO Content */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Free Developer Tools Online
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Dev Toolkit provides a comprehensive collection of free online developer tools 
            that run entirely in your browser. No data is sent to any server, ensuring your 
            sensitive information remains private and secure.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Format Tools</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Convert between JSON, XML, and YAML formats with our powerful converter. 
                Validate and format your data with syntax highlighting and error detection.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Encoding & Decoding</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Encode and decode Base64, URL-encoded strings, and HTML entities. 
                Perfect for web development and data processing tasks.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Development Tools</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Test regular expressions, format SQL queries, minify CSS and JavaScript, 
                and generate code snippets with our development utilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">API & Security</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Test APIs, decode JWT tokens, generate UUIDs, and work with timestamps. 
                Essential tools for modern web development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
