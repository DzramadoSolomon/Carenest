import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthPage from './auth/AuthPage';
import Dashboard from './dashboard/Dashboard';
import KidneyTest from './test/KidneyTest';
import ChatBot from './chat/ChatBot';
import TestHistory from './history/TestHistory';
import ContactPage from './contact/ContactPage';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Home, TestTube, MessageCircle, Phone } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

type Page = 'dashboard' | 'test' | 'chat' | 'history' | 'contact';

const MainApp: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard');
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'test':
        return <KidneyTest onBack={() => setCurrentPage('test')} />;
      case 'chat':
        return <ChatBot onBack={() => setCurrentPage('chat')} />;
      case 'history':
        return <TestHistory onBack={() => setCurrentPage('history')} />;
      case 'contact':
        return <ContactPage onBack={() => setCurrentPage('contact')} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-2">
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer" 
                  onClick={() => setCurrentPage('dashboard')}>
                Renolab
              </h1>
              {!isMobile && (
                <p className="text-sm text-gray-500 ml-2 hidden sm:block">Early Detection. Better Protection.</p>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isMobile && (
                <nav className="flex space-x-2 sm:space-x-4">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPage('dashboard')}>
                    Home
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPage('test')}>
                    Test
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPage('chat')}>
                    Chat
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPage('contact')}>
                    Contact
                  </Button>
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
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <Button 
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => handleNavigation('dashboard')}
              >
                <Home className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
              <Button 
                variant={currentPage === 'test' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => handleNavigation('test')}
              >
                <TestTube className="w-4 h-4 mr-3" />
                Kidney Test
              </Button>
              <Button 
                variant={currentPage === 'chat' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => handleNavigation('chat')}
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                AI Chat
              </Button>
              <Button 
                variant={currentPage === 'contact' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => handleNavigation('contact')}
              >
                <Phone className="w-4 h-4 mr-3" />
                Contact
              </Button>
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-sm text-gray-600 mb-2">Welcome, {user?.name}</div>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleSidebar}
            />
          )}
        </>
      )}
      
      <main className="min-h-[calc(100vh-140px)] pb-16 sm:pb-0">
        {renderPage()}
      </main>
      
      <footer className="bg-white border-t py-3 sm:py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm text-gray-500">
          © Renolab 2025. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainApp;
