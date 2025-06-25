import React, { createContext, useContext, useState, useCallback } from 'react';
import { openRouterAPI } from '../lib/openrouter';

const AIContext = createContext({});

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openrouter_api_key') || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const saveApiKey = useCallback((key) => {
    setApiKey(key);
    localStorage.setItem('openrouter_api_key', key);
  }, []);

  const sendMessage = useCallback(async (message, context = '') => {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    setIsLoading(true);
    try {
      const response = await openRouterAPI.chat({
        apiKey,
        message,
        context,
        history: chatHistory,
      });

      const newMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, newMessage, aiResponse]);
      return response;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, chatHistory]);

  const analyzeLog = useCallback(async (logContent) => {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const prompt = `Analyze this system log and provide insights about potential issues, errors, and recommendations:

${logContent}

Please provide:
1. Summary of key events
2. Any errors or warnings found
3. Potential causes
4. Recommended actions
5. Risk assessment (Low/Medium/High)`;

    return await sendMessage(prompt, 'log_analysis');
  }, [apiKey, sendMessage]);

  const generateScript = useCallback(async (description) => {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const prompt = `Generate a system administration script based on this description: ${description}

Please provide:
1. A complete, working script
2. Comments explaining each section
3. Prerequisites and dependencies
4. Usage instructions
5. Safety considerations`;

    return await sendMessage(prompt, 'script_generation');
  }, [apiKey, sendMessage]);

  const explainVulnerability = useCallback(async (cveId, description) => {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const prompt = `Explain this vulnerability and provide remediation steps:

CVE ID: ${cveId}
Description: ${description}

Please provide:
1. Plain English explanation of the vulnerability
2. Potential impact and risk level
3. Step-by-step remediation guide
4. Prevention strategies
5. Related vulnerabilities to watch for`;

    return await sendMessage(prompt, 'vulnerability_analysis');
  }, [apiKey, sendMessage]);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  const exportHistory = useCallback(() => {
    const data = {
      export_date: new Date().toISOString(),
      chat_history: chatHistory,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chatHistory]);

  const value = {
    apiKey,
    saveApiKey,
    isLoading,
    chatHistory,
    sendMessage,
    analyzeLog,
    generateScript,
    explainVulnerability,
    clearHistory,
    exportHistory,
    hasApiKey: !!apiKey,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};