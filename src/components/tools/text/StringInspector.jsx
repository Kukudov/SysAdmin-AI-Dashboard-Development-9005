import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiEye } = FiIcons;

function StringInspector() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeString = (text) => {
    if (!text) {
      setAnalysis(null);
      return;
    }

    const chars = text.split('');
    const lines = text.split('\n');
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    
    // Character frequency
    const charFreq = {};
    chars.forEach(char => {
      charFreq[char] = (charFreq[char] || 0) + 1;
    });

    // Character types
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    const digitCount = (text.match(/\d/g) || []).length;
    const spaceCount = (text.match(/\s/g) || []).length;
    const punctuationCount = (text.match(/[^\w\s]/g) || []).length;
    const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
    const lowercaseCount = (text.match(/[a-z]/g) || []).length;
    const specialCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;

    // Encoding detection
    const hasUnicode = /[^\x00-\x7F]/.test(text);
    const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text);
    
    // Most frequent characters
    const sortedChars = Object.entries(charFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Calculate entropy (simplified)
    const entropy = Object.values(charFreq)
      .map(freq => freq / text.length)
      .reduce((sum, p) => sum - p * Math.log2(p), 0);

    // Detect patterns
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g.test(text),
      url: /(https?:\/\/[^\s]+)/g.test(text),
      phone: /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g.test(text),
      creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g.test(text),
      ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g.test(text),
      hexColor: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g.test(text),
      base64: /^[A-Za-z0-9+/]*={0,2}$/.test(text.trim()) && text.length % 4 === 0,
    };

    setAnalysis({
      basic: {
        totalChars: text.length,
        totalLines: lines.length,
        totalWords: words.length,
        avgWordsPerLine: lines.length > 0 ? (words.length / lines.length).toFixed(2) : 0,
        avgCharsPerWord: words.length > 0 ? (text.length / words.length).toFixed(2) : 0,
        longestLine: Math.max(...lines.map(line => line.length)),
        shortestLine: Math.min(...lines.map(line => line.length)),
        emptyLines: lines.filter(line => line.trim() === '').length,
      },
      characters: {
        letters: letterCount,
        digits: digitCount,
        spaces: spaceCount,
        punctuation: punctuationCount,
        uppercase: uppercaseCount,
        lowercase: lowercaseCount,
        special: specialCount,
        unique: Object.keys(charFreq).length,
      },
      encoding: {
        isAscii: !hasUnicode,
        hasUnicode,
        hasEmoji,
        estimatedEncoding: hasUnicode ? 'UTF-8' : 'ASCII',
      },
      patterns,
      frequency: sortedChars,
      entropy: entropy.toFixed(2),
      readability: {
        averageWordLength: words.length > 0 ? (words.reduce((sum, word) => sum + word.length, 0) / words.length).toFixed(2) : 0,
        longWords: words.filter(word => word.length > 6).length,
        sentences: (text.match(/[.!?]+/g) || []).length,
      }
    });
  };

  React.useEffect(() => {
    analyzeString(input);
  }, [input]);

  const copyAnalysis = () => {
    if (!analysis) return;
    
    const report = `String Analysis Report
======================

Basic Statistics:
- Total Characters: ${analysis.basic.totalChars}
- Total Lines: ${analysis.basic.totalLines}
- Total Words: ${analysis.basic.totalWords}
- Average Words per Line: ${analysis.basic.avgWordsPerLine}
- Average Characters per Word: ${analysis.basic.avgCharsPerWord}

Character Types:
- Letters: ${analysis.characters.letters}
- Digits: ${analysis.characters.digits}
- Spaces: ${analysis.characters.spaces}
- Punctuation: ${analysis.characters.punctuation}
- Uppercase: ${analysis.characters.uppercase}
- Lowercase: ${analysis.characters.lowercase}
- Special: ${analysis.characters.special}
- Unique Characters: ${analysis.characters.unique}

Encoding:
- ASCII Only: ${analysis.encoding.isAscii ? 'Yes' : 'No'}
- Has Unicode: ${analysis.encoding.hasUnicode ? 'Yes' : 'No'}
- Has Emoji: ${analysis.encoding.hasEmoji ? 'Yes' : 'No'}
- Estimated Encoding: ${analysis.encoding.estimatedEncoding}

Entropy: ${analysis.entropy} bits

Detected Patterns:
${Object.entries(analysis.patterns).map(([pattern, found]) => `- ${pattern}: ${found ? 'Yes' : 'No'}`).join('\n')}

Top 10 Most Frequent Characters:
${analysis.frequency.map(([char, count], i) => `${i + 1}. "${char}" - ${count} times`).join('\n')}`;

    navigator.clipboard.writeText(report);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">String Inspector</h3>
      
      <div>
        <label className="form-label">Text to Analyze</label>
        <textarea
          className="form-input font-mono"
          rows="8"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to analyze..."
        />
        <div className="text-xs text-gray-500 mt-1">
          {input.length} characters
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={copyAnalysis}
              className="btn-secondary text-sm flex items-center"
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4 mr-2" />
              Copy Full Report
            </button>
          </div>

          {/* Basic Statistics */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Basic Statistics</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analysis.basic.totalChars}</div>
                <div className="text-xs text-gray-500">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analysis.basic.totalWords}</div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis.basic.totalLines}</div>
                <div className="text-xs text-gray-500">Lines</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analysis.characters.unique}</div>
                <div className="text-xs text-gray-500">Unique Chars</div>
              </div>
            </div>
          </div>

          {/* Character Types */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Character Breakdown</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analysis.characters).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Encoding & Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">Encoding Information</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ASCII Only:</span>
                  <span className={`text-sm font-medium ${analysis.encoding.isAscii ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.encoding.isAscii ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Has Unicode:</span>
                  <span className={`text-sm font-medium ${analysis.encoding.hasUnicode ? 'text-blue-600' : 'text-gray-600'}`}>
                    {analysis.encoding.hasUnicode ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Has Emoji:</span>
                  <span className={`text-sm font-medium ${analysis.encoding.hasEmoji ? 'text-purple-600' : 'text-gray-600'}`}>
                    {analysis.encoding.hasEmoji ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Encoding:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysis.encoding.estimatedEncoding}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Entropy:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analysis.entropy} bits
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">Pattern Detection</h4>
              </div>
              <div className="space-y-2">
                {Object.entries(analysis.patterns).map(([pattern, found]) => (
                  <div key={pattern} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {pattern.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className={`text-sm font-medium ${found ? 'text-green-600' : 'text-gray-400'}`}>
                      {found ? '✓ Found' : '✗ Not Found'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Character Frequency */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Most Frequent Characters
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {analysis.frequency.map(([char, count], index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                  <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                    {char === ' ' ? '␣' : char === '\n' ? '↵' : char === '\t' ? '⇥' : char}
                  </div>
                  <div className="text-xs text-gray-500">
                    {count} times
                  </div>
                  <div className="text-xs text-gray-400">
                    {((count / input.length) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Comprehensive character and word analysis</li>
          <li>• Pattern detection (emails, URLs, phone numbers, etc.)</li>
          <li>• Encoding detection and Unicode analysis</li>
          <li>• Character frequency analysis with entropy calculation</li>
          <li>• Readability metrics and statistics</li>
          <li>• Export detailed analysis report</li>
        </ul>
      </div>
    </div>
  );
}

export default StringInspector;