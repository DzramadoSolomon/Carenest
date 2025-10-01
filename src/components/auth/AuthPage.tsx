import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
// Assuming this is where your main application's routing or state is handled
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Define a prop for handling the successful login/guest entry to the main app
interface AuthPageProps {
  onGuestLogin: () => void; // Function to call when guest mode is selected
}

// Update the component signature to accept the new prop
const AuthPage: React.FC<AuthPageProps> = ({ onGuestLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  // Note: The `useAuth` is typically only needed in LoginForm/SignupForm,
  // but if you have a global state for the guest, you might need it here too.
  // For this implementation, I'll stick to a simple function call.

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const continueAsGuest = () => {
    setIsGuestMode(true);

    toast({
      title: "Guest Mode Activated",
      description: "⚠️ **Warning**: Your data will not be saved and all results will be lost upon leaving the app.",
      duration: 5000,
      variant: "default", // You can define a warning variant if available
    });

    // Simulate a brief loading, then navigate to the main interface
    setTimeout(() => {
      onGuestLogin(); // Leads the user to the main interface
      setIsGuestMode(false); // Reset loading state
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
        
        {/* --- */}

        {/* New Guest Option */}
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
            {isGuestMode ? "Entering as Guest..." : "Continue as Guest"} 🚀
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
