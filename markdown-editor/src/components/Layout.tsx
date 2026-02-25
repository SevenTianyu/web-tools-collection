import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useEditorStore } from '../store';

export default function Layout() {
  const { isSidebarOpen } = useEditorStore();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <Sidebar />
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
