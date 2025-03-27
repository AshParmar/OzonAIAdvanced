import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  imageData?: {
    mime_type: string;
    data: string;
  };
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCn13xHLgVkC5_ggJhE4gq7QaTpkj1o3bo"
function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ mime_type: string; data: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 5) {
      scrollToBottom();
    }
  }, [messages]);
  const generateAIResponse = async (userMessage: string, imageData?: { mime_type: string; data: string }) => {
    setIsLoading(true);
    
    const requestBody: any = {
      contents: [
        {
          parts: [
            {
              text: userMessage
            }
          ]
        }
      ]
    };

    // Add image to request if present
    if (imageData) {
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: imageData.mime_type,
          data: imageData.data
        }
      });
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    };

    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = {
          id: Date.now().toString(),
          text: data.candidates[0].content.parts[0].text.trim(),
          sender: 'ai' as const,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: Date.now().toString(),
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !currentImage) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date(),
      imageData: currentImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    await generateAIResponse(message, currentImage || undefined);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result?.toString().split(',')[1];
      if (base64String) {
        setCurrentImage({
          mime_type: file.type,
          data: base64String
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Main chat container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6 mt-20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-4 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            } animate-fade-in`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                msg.sender === 'ai'
                  ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                  : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              }`}
            >
              {msg.sender === 'ai' ? (
                <Bot className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div
                className={`${
                  msg.sender === 'ai'
                    ? 'bg-gray-800 shadow-[0_0_20px_rgba(147,51,234,0.2)]'
                    : 'bg-green-500/10 ml-auto shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                } rounded-2xl p-4 max-w-[80%] ${msg.sender === 'user' ? 'float-right' : ''}`}
              >
                <p className={msg.sender === 'ai' ? 'text-purple-300' : 'text-green-300'}>
                  {msg.text}
                </p>
                {msg.imageData && (
                  <img
                    src={`data:${msg.imageData.mime_type};base64,${msg.imageData.data}`}
                    alt="Uploaded content"
                    className="mt-2 rounded-lg max-w-full h-auto"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-800 rounded-2xl p-4 shadow-[0_0_20px_rgba(147,51,234,0.2)] w-16">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview of selected image */}
      {currentImage && (
        <div className="px-4 pb-2">
          <div className="bg-gray-800 p-2 rounded-lg inline-block relative">
            <img
              src={`data:${currentImage.mime_type};base64,${currentImage.data}`}
              alt="Selected image"
              className="max-h-32 rounded"
            />
            <button
              onClick={() => setCurrentImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-800 text-gray-100 rounded-2xl px-6 py-4 pr-32 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
            <div className="absolute right-2 flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerImageUpload}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 text-green-400 hover:text-green-300"
              >
                <Image className="w-6 h-6" />
              </button>
              <button
                type="submit"
                disabled={(!message.trim() && !currentImage) || isLoading}
                className={`p-2 rounded-full ${
                  (message.trim() || currentImage) && !isLoading
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-700'
                } transition-colors duration-200 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;