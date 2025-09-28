import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube, MessageCircle, History, Users } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: 'test' | 'chat' | 'history' | 'contact') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Carenest</h1>
        <p className="text-gray-600">Your AI-powered kidney health companion</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('test')}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <TestTube className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Take Kidney Test</CardTitle>
            <CardDescription>
              Upload or capture an image for AI-powered kidney analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => onNavigate('test')}>
              Start Test
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('chat')}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Ask Carenest AI</CardTitle>
            <CardDescription>
              Get instant answers about kidney health and testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => onNavigate('chat')}>
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('history')}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Test History</CardTitle>
            <CardDescription>
              View your previous kidney test results and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => onNavigate('history')}>
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('contact')}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">Contact Team</CardTitle>
            <CardDescription>
              Get in touch with the Carenest development team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => onNavigate('contact')}>
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How Carenest Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
              1
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Capture or Upload</h3>
            <p className="text-sm text-gray-600">Take a photo or upload an image for analysis</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
              2
            </div>
            <h3 className="font-medium text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Our AI model analyzes the image for potential issues</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
              3
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Get Results</h3>
            <p className="text-sm text-gray-600">Receive instant feedback and recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;