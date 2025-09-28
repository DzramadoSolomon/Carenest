import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageSquare, Brain, Zap } from 'lucide-react';

const ChatBotExplanation: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            How the Carenest AI Chatbot Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                <h3 className="font-semibold">Intent Recognition</h3>
              </div>
              <p className="text-sm text-gray-600">
                The chatbot analyzes your messages to understand what you're asking about - whether it's test instructions, health concerns, or general questions.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="w-4 h-4 mr-2 text-green-600" />
                <h3 className="font-semibold">Knowledge Base</h3>
              </div>
              <p className="text-sm text-gray-600">
                Responses are generated from a curated knowledge base of kidney health information, testing procedures, and medical guidance.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                <h3 className="font-semibold">Instant Responses</h3>
              </div>
              <p className="text-sm text-gray-600">
                Get immediate answers to common questions about kidney health, test procedures, and result interpretations.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Bot className="w-4 h-4 mr-2 text-orange-600" />
                <h3 className="font-semibold">Context Awareness</h3>
              </div>
              <p className="text-sm text-gray-600">
                The bot remembers your conversation context to provide more relevant and personalized responses throughout your session.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Supported Question Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Test Instructions</Badge>
            <Badge variant="secondary">Health Symptoms</Badge>
            <Badge variant="secondary">Result Interpretation</Badge>
            <Badge variant="secondary">Prevention Tips</Badge>
            <Badge variant="secondary">General Health</Badge>
            <Badge variant="secondary">App Navigation</Badge>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Example Questions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "How do I take a kidney test?"</li>
              <li>• "What does red discoloration mean?"</li>
              <li>• "How accurate are the test results?"</li>
              <li>• "What should I do if I see blood in my urine?"</li>
              <li>• "How often should I test my kidneys?"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBotExplanation;