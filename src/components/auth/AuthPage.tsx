// AuthPage.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { loginAsGuest } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const continueAsGuest = async () => {
    setIsGuestMode(true);

    toast({
      title: "Guest Mode Activated",
      description: "⚠️ **Warning**: Your data will not be saved and all results will be lost upon leaving the app.",
      duration: 5000,
      variant: "default",
    });

    // Delay for UX - shows "Entering as Guest..." message
    setTimeout(async () => {
      try {
        // This will authenticate the user as a guest with full access
        await loginAsGuest();
        
        // Optional success toast
        toast({
          title: "Welcome, Guest!",
          description: "You now have full access to Carenest features.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to enter guest mode. Please try again.",
          variant: "destructive",
        });
        setIsGuestMode(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Carenest</h1>
          <p className="text-gray-600">Early Detection. Better Protection.</p>
        </div>
        {isLogin ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm onToggleMode={toggleMode} />
        )}
        
        {/* Guest Option */}
        <div className="mt-6">
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button
            variant="outline"
            className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={continueAsGuest}
            disabled={isGuestMode}
          >
            {isGuestMode ? "Entering as Guest..." : "Continue as Guest 🚀"}
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Results will be lost, and data will not be saved after leaving the app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
