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
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return; // Disable send button while loading

    const newUserMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true); // Set loading true

    // Add a "bot is typing" message
    const typingMessageId = messages.length + 2;
    setMessages((prevMessages) => [...prevMessages, { id: typingMessageId, sender: 'bot', text: '...' }]);

    try {
      // Simulate API call to FastAPI backend RAG service
      const botResponseText = await conceptualBackendCall(newUserMessage.text); // Simulate the API call

      // Replace the "typing" message with the actual response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === typingMessageId ? { ...msg, text: botResponseText } : msg
        )
      );
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Replace typing message with an error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === typingMessageId ? { ...msg, text: 'Error: Could not get a response from the conceptual FastAPI RAG backend.' } : msg
        )
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Layout title="Chatbot AI" description="Chat with an AI assistant about the Physical AI & Humanoid Robotics book content, conceptually powered by RAG, OpenAI Agent SDK, FastAPI, and Neon Postgres.">
      <main className="container margin-vert--lg">
        <h1>Chat with the Book AI</h1>
        <div
          style={{
            height: '60vh',
            maxHeight: '600px',
            border: '1px solid var(--ifm-toc-border-color)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--ifm-background-color)',
          }}
        >
          <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '10px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === 'user' ? 'var(--ifm-color-primary)' : 'var(--ifm-background-color-secondary)',
                    color: msg.sender === 'user' ? 'white' : 'inherit',
                    padding: '0.6rem 1rem',
                    borderRadius: '1.2rem',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                </div>
              </div>
            ))}
            {isLoading && ( // Show typing indicator
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ backgroundColor: 'var(--ifm-background-color-secondary)', padding: '0.6rem 1rem', borderRadius: '1.2rem', maxWidth: '70%', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
                  <strong>Bot:</strong> ... (typing)
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
              disabled={isLoading} // Disable input while loading
            />
            <button type="submit" className="button button--primary button--md" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
          This is a conceptual chatbot demonstrating RAG with OpenAI Agent SDK, FastAPI, and Neon Serverless Postgres. A full implementation requires a deployed FastAPI backend, a configured Neon Postgres database, and API integration.
        </p>
      </main>
    </Layout>
  );
}

export default ChatbotPage;