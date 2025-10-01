// AuthPage.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Define a prop for handling the successful login/guest entry to the main app
interface AuthPageProps {
  // This prop will now be the function from the parent App.tsx
  onGuestLogin: () => void;
}

// Update the component signature to accept the new prop
const AuthPage: React.FC<AuthPageProps> = ({ onGuestLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const continueAsGuest = () => {
    setIsGuestMode(true);

    toast({
      title: "Guest Mode Activated",
      description: "⚠️ **Warning**: Your data will not be saved and all results will be lost upon leaving the app.",
      duration: 5000,
      variant: "default",
    });

    // --- REAL NAVIGATION LOGIC STARTS HERE ---
    // The delay is kept for the 'Entering as Guest...' message to be visible
    setTimeout(() => {
      onGuestLogin(); // This function call now updates the app's view state!
      // In the conceptual App.tsx, this call changes the view to the Dashboard.
    }, 500);
    // The `setIsGuestMode(false)` is not strictly necessary here because 
    // the component will unmount once `onGuestLogin` triggers the view change.
  };

  return (
    // ... (rest of the JSX from the previous step remains the same)
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
