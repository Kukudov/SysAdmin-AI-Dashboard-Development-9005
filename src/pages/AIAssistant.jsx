import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend, FiMic, FiMicOff, FiDownload, FiTrash2, FiSettings } = FiIcons;

const AIAssistant = () => {
  const {
    hasApiKey,
    apiKey,
    saveApiKey,
    isLoading,
    chatHistory,
    sendMessage,
    clearHistory,
    exportHistory,
  } = useAI();

  const [message, setMessage] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(!hasApiKey);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleVoiceInput = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSaveApiKey = () => {
    saveApiKey(tempApiKey);
    setShowApiKeyModal(false);
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Assistant
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="btn-secondary flex items-center"
          >
            <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
            API Settings
          </button>
          <button
            onClick={exportHistory}
            disabled={chatHistory.length === 0}
            className="btn-secondary flex items-center"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={clearHistory}
            disabled={chatHistory.length === 0}
            className="btn-danger flex items-center"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {!hasApiKey ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              OpenRouter API Key Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please configure your OpenRouter API key to start using the AI assistant.
            </p>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="btn-primary"
            >
              Configure API Key
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Messages */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <p>Start a conversation with your AI assistant!</p>
                  <p className="text-sm mt-2">
                    Ask questions about system administration, log analysis, or get help with scripts.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-3xl p-3 rounded-lg
                        ${msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }
                      `}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {formatMessage(msg.content)}
                      </div>
                      <div className="text-xs opacity-75 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask your AI assistant anything..."
                  className="form-input pr-12"
                  disabled={isLoading}
                />
                {recognition.current && (
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`
                      absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded
                      ${isListening 
                        ? 'text-red-600 bg-red-100' 
                        : 'text-gray-400 hover:text-gray-600'
                      }
                    `}
                  >
                    <SafeIcon icon={isListening ? FiMicOff : FiMic} className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="btn-primary flex items-center"
              >
                <SafeIcon icon={FiSend} className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  OpenRouter API Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">API Key</label>
                    <input
                      type="password"
                      className="form-input"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Enter your OpenRouter API key"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get your API key from{' '}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500"
                      >
                        openrouter.ai/keys
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveApiKey}
                  disabled={!tempApiKey.trim()}
                  className="btn-primary sm:ml-3"
                >
                  Save
                </button>
                {hasApiKey && (
                  <button
                    onClick={() => setShowApiKeyModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;