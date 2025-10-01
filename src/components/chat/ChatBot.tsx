import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bot, User, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
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
  // --- IMPORTANT ---
  // PASTE YOUR GOOGLE AI STUDIO API KEY HERE
  const API_KEY = 'PASTE_YOUR_API_KEY_HERE';

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
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
      setApiKeyMissing(true);
    }
  }, [API_KEY]);

  // This function now calls the Gemini API
  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key=${API_KEY}`;
    
    // System instruction to guide the AI's behavior
    const systemInstruction = {
      parts: [{
        text: "You are Carenest AI, a friendly and helpful kidney health assistant. Provide concise, informative, and safe advice regarding kidney health. Always remind users that you are an AI assistant, not a medical professional, and they should consult a doctor for any medical concerns or diagnosis. Do not provide a diagnosis."
      }]
    };

    const payload = {
      contents: [{ parts: [{ text: userMessage }] }],
      systemInstruction: systemInstruction,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      return "Sorry, something went wrong. Please check your API key and internet connection, then try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);
    
    const botResponseText = await getGeminiResponse(currentInput);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
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
              {apiKeyMissing && (
                 <div className="p-3 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    <div className="flex">
                        <div className="py-1"><AlertTriangle className="h-5 w-5 text-yellow-500 mr-3"/></div>
                        <div>
                            <p className="font-bold">Configuration Required</p>
                            <p className="text-sm">Please insert your Google AI Studio API key in the `ChatBot.tsx` file to enable the AI.</p>
                        </div>
                    </div>
                </div>
              )}
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
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
                  disabled={isTyping || apiKeyMissing}
                />
                <Button onClick={handleSendMessage} disabled={!inputText.trim() || isTyping || apiKeyMissing}>
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
