import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bot, User, ArrowLeft, Info } from 'lucide-react';
import ChatBotExplanation from '../chatbot/ChatBotExplanation';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  onBack: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Carenest AI, your kidney health assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('test') || lowerMessage.includes('how')) {
      return "To take a kidney test: 1) Go to the Test page, 2) Upload an image or use your camera, 3) Click 'Start Scan' to analyze the image. Our AI will provide results in seconds!";
    }
    
    if (lowerMessage.includes('red') || lowerMessage.includes('discoloration') || lowerMessage.includes('color')) {
      return "Red discoloration in urine can indicate various conditions like UTIs, kidney stones, or other kidney issues. However, our AI analysis is not a substitute for professional medical advice. Please consult a healthcare provider for proper diagnosis.";
    }
    
    if (lowerMessage.includes('kidney') || lowerMessage.includes('health')) {
      return "For optimal kidney health: drink 8-10 glasses of water daily, limit sodium intake, exercise regularly, avoid excessive protein, and get regular check-ups. Early detection is key to preventing serious kidney problems!";
    }
    
    if (lowerMessage.includes('accurate') || lowerMessage.includes('reliable')) {
      return "Our AI model is trained on medical data, but it's designed for screening purposes only. Always consult with healthcare professionals for definitive diagnosis and treatment. Think of our tool as an early warning system.";
    }
    
    if (lowerMessage.includes('symptoms')) {
      return "Common kidney problem symptoms include: changes in urination, swelling in legs/ankles, fatigue, nausea, back pain, and high blood pressure. If you experience these, please see a doctor promptly.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help with your kidney health questions. You can ask me about taking tests, understanding symptoms, or general kidney health tips.";
    }
    
    // Default response
    return "I'm here to help with kidney health questions! You can ask me about: taking tests, understanding symptoms, kidney health tips, or what our AI analysis means. What would you like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Carenest AI Assistant</h1>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="explanation" className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            How It Works
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-600" />
                Chat with Carenest AI
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isBot ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {message.isBot ? (
                          <Bot className="w-4 h-4 text-blue-600" />
                        ) : (
                          <User className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.isBot 
                          ? 'bg-white border border-gray-200' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isBot ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about kidney health, testing, or symptoms..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputText.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="explanation">
          <ChatBotExplanation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatBot;