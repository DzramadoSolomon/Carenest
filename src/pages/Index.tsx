import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import MainApp from '@/components/MainApp';

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;