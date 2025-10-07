// src/pages/MainApp.tsx

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthPage from './auth/AuthPage';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Home, TestTube, MessageCircle, Phone, History } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
// Import routing components
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MainApp: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  
  // Hooks for routing
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleLogout = () => {
    logout();
    navigate('/'); // Navigate to login page on logout
  };
  
  // This function now uses the navigate hook
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Define navigation items for easier mapping
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/test', label: 'Kidney Test', icon: TestTube },
    { path: '/history', label: 'Test History', icon: History },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-2">
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer" 
                  onClick={() => navigate('/dashboard')}>
                Carenest
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isMobile && (
                <nav className="flex space-x-1">
                   {navItems.map(item => (
                     <Button key={item.path} variant="ghost" size="sm" onClick={() => navigate(item.path)}>
                       {item.label}
                     </Button>
                   ))}
                </nav>
              )}
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map(item => (
                <Button 
                  key={item.path}
                  // Highlight button if its path matches the current location
                  variant={location.pathname === item.path ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
          {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}/>}
        </>
      )}
      
      {/* Main Content - Renders the matched child route */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          © Renolab 2025. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainApp;
