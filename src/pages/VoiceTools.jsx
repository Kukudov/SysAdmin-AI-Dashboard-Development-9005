import React, { useState, useRef, useEffect } from 'react';
import { VoiceRecognition, TextToSpeech } from '../lib/voice';
import { useAI } from '../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMic, FiMicOff, FiVolume2, FiVolumeX, FiDownload, FiUpload } = FiIcons;

const VoiceTools = () => {
  const { hasApiKey, sendMessage } = useAI();
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [activeTab, setActiveTab] = useState('transcription');
  const [ttsText, setTtsText] = useState('');

  const voiceRecognition = useRef(null);
  const textToSpeech = useRef(null);

  useEffect(() => {
    // Initialize voice recognition
    voiceRecognition.current = new VoiceRecognition();
    textToSpeech.current = new TextToSpeech();

    if (voiceRecognition.current.isSupported()) {
      voiceRecognition.current.onResult = (final, interim) => {
        setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      voiceRecognition.current.onStart = () => setIsListening(true);
      voiceRecognition.current.onEnd = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      voiceRecognition.current.onError = (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      };
    }

    return () => {
      if (voiceRecognition.current) {
        voiceRecognition.current.stop();
      }
      if (textToSpeech.current) {
        textToSpeech.current.stop();
      }
    };
  }, []);

  const handleStartListening = () => {
    if (voiceRecognition.current && voiceRecognition.current.isSupported()) {
      voiceRecognition.current.start();
    }
  };

  const handleStopListening = () => {
    if (voiceRecognition.current) {
      voiceRecognition.current.stop();
    }
  };

  const handleSpeak = (text) => {
    if (textToSpeech.current && textToSpeech.current.isSupported()) {
      setIsSpeaking(true);
      const utterance = textToSpeech.current.speak(text, {
        voice: selectedVoice,
        rate: speechRate,
      });
      
      if (utterance) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }
    }
  };

  const handleStopSpeaking = () => {
    if (textToSpeech.current) {
      textToSpeech.current.stop();
      setIsSpeaking(false);
    }
  };

  const handleVoiceToAI = async () => {
    if (!hasApiKey || !transcript.trim()) return;

    try {
      const response = await sendMessage(transcript);
      handleSpeak(response);
    } catch (error) {
      console.error('Error with voice-to-AI:', error);
    }
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'transcription', label: 'Voice Transcription' },
    { id: 'tts', label: 'Text to Speech' },
    { id: 'voice-ai', label: 'Voice AI Chat' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Voice Tools
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Voice Transcription Tab */}
      {activeTab === 'transcription' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Voice to Text Transcription
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  disabled={!voiceRecognition.current?.isSupported()}
                  className={`
                    p-4 rounded-full text-white text-xl
                    ${isListening 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-primary-600 hover:bg-primary-700'
                    }
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                  `}
                >
                  <SafeIcon icon={isListening ? FiMicOff : FiMic} className="w-8 h-8" />
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isListening ? 'Listening...' : 'Click to start recording'}
                  </p>
                  {!voiceRecognition.current?.isSupported() && (
                    <p className="text-xs text-red-600 mt-1">
                      Speech recognition not supported in this browser
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="form-label">Transcript</label>
                <textarea
                  className="form-input min-h-[200px]"
                  value={transcript + interimTranscript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your speech will appear here..."
                />
                {interimTranscript && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Interim: {interimTranscript}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadTranscript}
                  disabled={!transcript.trim()}
                  className="btn-secondary flex items-center"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                  Download
                </button>
                
                <label className="btn-secondary flex items-center cursor-pointer">
                  <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                  Upload Text
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={() => setTranscript('')}
                  className="btn-danger"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text to Speech Tab */}
      {activeTab === 'tts' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Text to Speech
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Text to Speak</label>
                <textarea
                  className="form-input min-h-[150px]"
                  placeholder="Enter text to convert to speech..."
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Voice</label>
                  <select
                    className="form-input"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  >
                    <option value="">Default Voice</option>
                    {textToSpeech.current?.getVoices().map((voice, index) => (
                      <option key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Speech Rate: {speechRate}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleSpeak(ttsText)}
                  disabled={!ttsText.trim() || isSpeaking}
                  className="btn-primary flex items-center"
                >
                  <SafeIcon icon={FiVolume2} className="w-4 h-4 mr-2" />
                  {isSpeaking ? 'Speaking...' : 'Speak Text'}
                </button>
                
                <button
                  onClick={handleStopSpeaking}
                  disabled={!isSpeaking}
                  className="btn-danger flex items-center"
                >
                  <SafeIcon icon={FiVolumeX} className="w-4 h-4 mr-2" />
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice AI Chat Tab */}
      {activeTab === 'voice-ai' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Voice AI Assistant
              </h3>
            </div>

            {!hasApiKey ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure your OpenRouter API key to use Voice AI features.
                </p>
                <button className="btn-primary">
                  Go to AI Assistant Settings
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Speak your question, and the AI will respond with both text and voice.
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={isListening ? handleStopListening : handleStartListening}
                    disabled={!voiceRecognition.current?.isSupported()}
                    className={`
                      p-6 rounded-full text-white text-xl
                      ${isListening 
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                        : 'bg-primary-600 hover:bg-primary-700'
                      }
                      disabled:bg-gray-400 disabled:cursor-not-allowed
                    `}
                  >
                    <SafeIcon icon={isListening ? FiMicOff : FiMic} className="w-10 h-10" />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isListening ? 'Listening for your question...' : 'Click to ask AI a question'}
                  </p>
                </div>

                {transcript && (
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Your Question</label>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {transcript}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleVoiceToAI}
                      disabled={!transcript.trim()}
                      className="btn-primary w-full"
                    >
                      Send to AI Assistant
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceTools;