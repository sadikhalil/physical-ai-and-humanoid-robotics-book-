import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import './chatbot.css'; // Assuming you'll create a simple CSS file

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  sources?: string[];
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Default to localhost

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot message
    setMessages([{ id: 1, sender: 'bot', text: 'Hello! Ask me anything about Physical AI & Humanoid Robotics.' }]);
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: messages.length + 1, sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: messages.length + 2,
        sender: 'bot',
        text: data.answer,
        sources: data.sources,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: 'bot',
        text: "I'm sorry, I couldn't get an answer right now. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <Layout title="AI Chatbot" description="Chat with an AI assistant about the book.">
      <h1 className="chatbot-page-header">Physical AI Book Assistant</h1>
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="message-sources">
                  <strong>Sources:</strong>
                  <ul>
                    {msg.sources.map((src, index) => (
                      <li key={index}><a href={src} target="_blank" rel="noopener noreferrer">{src}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="message bot loading">
              <p>Thinking...</p>
            </div>
          )}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ChatbotPage;
