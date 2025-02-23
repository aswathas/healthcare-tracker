'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, PaperClipIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { generateHealthAdvice, analyzeMedicalDocument } from '@/lib/gemini';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export default function AIDoctorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access the AI Doctor.',
        variant: 'destructive',
      });
    }
  }, [user, loading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateHealthAdvice(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate health advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      setIsLoading(true);
      try {
        const analysis = await analyzeMedicalDocument(text);
        setMessages(prev => [...prev, 
          { role: 'user', content: `Uploaded document: ${file.name}` },
          { role: 'assistant', content: analysis }
        ]);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to analyze the document. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will redirect
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">AI Health Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label className="flex items-center justify-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
          <PaperClipIcon className="h-6 w-6 text-gray-600" />
          <input
            type="file"
            className="hidden"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}
