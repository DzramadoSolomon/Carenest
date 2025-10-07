import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title = 'Renolab', 
  showBackButton = false, 
  onBack 
}) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            {showBackButton && onBack ? (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <X className="w-5 h-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${isMobile ? 'pt-0' : 'pt-4'} pb-4`}>
        <div className="container mx-auto px-4 max-w-7xl">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
