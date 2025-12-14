import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import './chatbot.css';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  sources?: string[];
}

const BotAvatar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bot-avatar">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM8.5 12.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3.5 3c-1.63 0-3.07-.8-4-2h8c-.93 1.2-2.37 2-4 2z" />
  </svg>
);

const ChatMessage = ({ message, onRegenerate }: { message: Message; onRegenerate?: () => void }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
  };

  if (message.sender === 'bot') {
    return (
      <div className="message-container">
        <BotAvatar />
        <div className="message bot">
          <p>{message.text}</p>
          {message.sources && message.sources.length > 0 && (
            <div className="message-sources">
              <strong>Sources:</strong>
              <ul>
                {message.sources.map((src, index) => (
                  <li key={index}>
                    <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="message-actions">
            <button onClick={copyToClipboard}>Copy</button>
            {onRegenerate && <button onClick={onRegenerate}>Regenerate</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-container user">
      <div className="message user">{message.text}</div>
    </div>
  );
};

const initialMessage: Message = {
  id: 1,
  sender: 'bot',
  text: 'Hello! I am your Physical AI & Humanoid Robotics book assistant. How can I help you today?',
};

function ChatbotPage() {
  const { siteConfig } = useDocusaurusContext();
  const { API_BASE_URL } = siteConfig.customFields as { API_BASE_URL: string };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const clearHistory = () => {
    setMessages([initialMessage]);
  };

  const sendMessage = useCallback(async (messageText: string) => {
    if (messageText.trim() === '') return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.answer,
        sources: data.sources,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm sorry, something went wrong. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const handleSendMessage = () => {
    const messageText = input;
    setInput('');
    setMessages((prevMessages) => [...prevMessages, { id: Date.now(), sender: 'user', text: messageText }]);
    sendMessage(messageText);
  };

  const handleRegenerate = (messageIndex: number) => {
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex >= 0 && messages[userMessageIndex]?.sender === 'user') {
      const userMessage = messages[userMessageIndex];
      setMessages(prev => prev.slice(0, userMessageIndex + 1));
      sendMessage(userMessage.text);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout title="AI Chatbot" description="Chat with an AI assistant about the book.">
      <div className="chatbot-page-container">
        <div className="chatbot-header">
          <h1 className="chatbot-page-header">Physical AI Book Assistant</h1>
          <button onClick={clearHistory} className="clear-history-button">
            Clear History
          </button>
        </div>
        <div className="chatbot-container">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRegenerate={msg.sender === 'bot' ? () => handleRegenerate(index) : undefined}
              />
            ))}
            {loading && (
              <div className="message-container">
                <BotAvatar />
                <div className="message bot loading">
                  <div className="spinner"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              disabled={loading}
              rows={1}
            />
            <button onClick={handleSendMessage} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChatbotPage;
