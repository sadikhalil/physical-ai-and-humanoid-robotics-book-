import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

// Conceptual Backend API Call Simulation
// In a real application, this would be a fetch/axios call to your FastAPI backend.
async function conceptualBackendCall(query: string): Promise<string> {
  console.log(`[Frontend] Conceptually sending query to FastAPI backend: "${query}"`);

  // Simulate network delay for a backend API call
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  // --- Conceptual RAG Logic (simulated response from FastAPI backend) ---
  // This function simulates the response from a FastAPI backend that would:
  // 1. Receive the user's query.
  // 2. Use OpenAI embeddings to embed the query.
  // 3. Query a Neon Serverless Postgres vector database (or similar) to retrieve relevant book content.
  // 4. Use the OpenAI Agent SDK to process the retrieved context and the query to generate a response.

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return 'FastAPI RAG Backend: Hello! I am the Physical AI & Humanoid Robotics book assistant, conceptually powered by a FastAPI RAG system with OpenAI Agent SDK. How can I help you today?';
  }
  if (lowerQuery.includes('physical ai')) {
    return 'FastAPI RAG Backend: According to the book content, Physical AI is a branch of AI focusing on intelligent systems embodied in physical forms, interacting with the real world through sensors and actuators. It combines software intelligence with physical presence. (Relevant content from Chapter 1 and 2 would be retrieved here by the Agent SDK.)';
  }
  if (lowerQuery.includes('humanoid robots')) {
    return 'FastAPI RAG Backend: Based on my RAG knowledge base from the book, humanoid robots are machines designed to mimic the human form and often human movements. They are developed for various purposes, including research, assistance, and exploration. (Relevant content from Chapter 3 would be retrieved here by the Agent SDK.)';
  }
  if (lowerQuery.includes('rag chatbot')) {
    return 'FastAPI RAG Backend: RAG (Retrieval-Augmented Generation) chatbots, as discussed in Chapter 18, combine information retrieval from a knowledge base (like book content in Neon Postgres) with generative AI (via OpenAI Agent SDK) to provide more accurate and context-aware responses, enhancing how robots interact with users.';
  }
  if (lowerQuery.includes('openai agent sdk')) {
    return 'FastAPI RAG Backend: The OpenAI Agent SDK, when integrated with a FastAPI RAG backend, would orchestrate the retrieval from Neon Postgres and generation process. It helps define tools, manage state, and execute steps to fulfill user requests by leveraging external knowledge sources like this book. (Conceptual integration based on your request.)';
  }
  if (lowerQuery.includes('book content')) {
    return 'FastAPI RAG Backend: I am conceptually powered by the content of "Physical AI & Humanoid Robotics" book, stored in a hypothetical Neon Postgres DB and accessed via FastAPI RAG. My purpose is to help you understand its chapters and concepts.';
  }
  if (lowerQuery.includes('fastapi') || lowerQuery.includes('neon postgres')) {
    return 'FastAPI RAG Backend: Yes, this conceptual backend would utilize FastAPI for API services and Neon Serverless Postgres as a vector database for efficient RAG retrieval of book content. This setup is excellent for scalable AI applications.';
  }
  if (lowerQuery.includes('thanks') || lowerQuery.includes('thank you')) {
    return 'FastAPI RAG Backend: You\'re welcome! Let me know if you have more questions from the book, processed conceptually by FastAPI RAG.';
  }

  return `FastAPI RAG Backend: I processed your query "${query}" using my conceptual RAG system. In a real setup with OpenAI Agent SDK, I would search the book for "${query}" and provide a relevant, generated answer. For now, try asking about "Physical AI", "humanoid robots", "control systems", or "RAG chatbot".`;
}

function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'bot', text: 'Hello! I am the Physical AI & Humanoid Robotics book chatbot, conceptually powered by a FastAPI RAG system with OpenAI Agent SDK and Neon Postgres. How can I assist you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent, message?: string) => {
    e.preventDefault();
    const messageToSend = message || inputMessage;
    if (messageToSend.trim() === '' || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageToSend.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponseText = await conceptualBackendCall(newUserMessage.text);
      const newBotMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorBotMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Error: Could not get a response from the conceptual FastAPI RAG backend.',
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { id: 1, sender: 'bot', text: 'Hello! I am the Physical AI & Humanoid Robotics book chatbot, conceptually powered by a FastAPI RAG system with OpenAI Agent SDK and Neon Postgres. How can I assist you today?' },
    ]);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const suggestedQuestions = [
    'What is Physical AI?',
    'Tell me about humanoid robots.',
    'What is a RAG chatbot?',
    'Explain the role of the OpenAI Agent SDK.',
  ];

  return (
    <Layout title="Chatbot AI" description="Chat with an AI assistant about the Physical AI & Humanoid Robotics book content, conceptually powered by RAG, OpenAI Agent SDK, FastAPI, and Neon Postgres.">
      <main className="container margin-vert--lg" style={{
        backgroundImage: 'url("/img/undraw_docusaurus_mountain.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem',
        borderRadius: '10px'
      }}>
        <div style={{
          backgroundColor: 'rgba(194, 152, 152, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2.5rem' }}>Chat with the Book AI</h1>
          <div
            style={{
              height: '80vh',
              maxHeight: '800px',
              border: '1px solid var(--ifm-toc-border-color)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#9fa2a4ff',
            }}
          >
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid var(--ifm-toc-border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/img/logo.svg" alt="Chatbot" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Physical AI & Humanoid Robotics Assistant</h2>
              </div>
              <button className="button button--secondary button--sm" onClick={handleClearChat}>Clear Chat</button>
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem',
                    alignItems: 'flex-start'
                  }}
                >
                  {msg.sender === 'bot' && <img src="/img/logo.svg" alt="Bot" style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />}
                  <div
                    style={{
                      backgroundColor: msg.sender === 'user' ? '#60756aff' : '#e5e5e5',
                      color: msg.sender === 'user' ? 'white' : '#333',
                      padding: '0.6rem 1rem',
                      borderRadius: '1.2rem',
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 1px 2px rgba(39, 38, 38, 0.1)',
                      position: 'relative'
                    }}
                  >
                    {msg.text}
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => handleCopyToClipboard(msg.text)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#787878ff'
                        }}
                      >
                        Copy
                      </button>
                    )}
                  </div>
                  {msg.sender === 'user' && <img src="https://docusaurus.io/img/docusaurus.png" alt="User" style={{ width: '30px', height: '30px', marginLeft: '10px', borderRadius: '50%' }} />}
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src="/img/logo.svg" alt="Bot" style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />
                  <div style={{
                    backgroundColor: '#e5e5e5',
                    color: 'black',
                    padding: '0.6rem 1rem',
                    borderRadius: '1.2rem',
                    maxWidth: '70%',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="dot-flashing" style={{ marginRight: '5px' }}></div>
                      <div className="dot-flashing" style={{ marginRight: '5px' }}></div>
                      <div className="dot-flashing"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid var(--ifm-toc-border-color)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
                {suggestedQuestions.map((question, index) => (
                  <button key={index} className="button button--outline button--primary button--sm" style={{ color: '#1a73e8' }} onClick={(e) => handleSendMessage(e, question)}>
                    {question}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about the book..."
                  style={{
                    flexGrow: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid var(--ifm-toc-border-color)',
                    marginRight: '0.5rem',
                    fontSize: '1rem',
                  }}
                  disabled={isLoading}
                />
                <button type="submit" className="button button--primary button--md" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '1.1rem', color: 'var(--ifm-color-emphasis-700)', fontWeight: 'bold' }}>
            This is a conceptual chatbot demonstrating RAG with OpenAI Agent SDK, FastAPI, and Neon Serverless Postgres. A full implementation requires a deployed FastAPI backend, a configured Neon Postgres database, and API integration.
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default ChatbotPage;