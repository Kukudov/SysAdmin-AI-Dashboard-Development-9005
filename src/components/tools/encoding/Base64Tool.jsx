import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');

  const processBase64 = () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setOutput('');
    }
  };

  React.useEffect(() => {
    processBase64();
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Base64 Encoder/Decoder</h3>
      
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="encode"
            checked={mode === 'encode'}
            onChange={(e) => setMode(e.target.value)}
            className="mr-2"
          />
          <span>Encode</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="decode"
            checked={mode === 'decode'}
            onChange={(e) => setMode(e.target.value)}
            className="mr-2"
          />
          <span>Decode</span>
        </label>
      </div>

      <div>
        <label className="form-label">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>
        <textarea
          className="form-input font-mono"
          rows="6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        />
        <div className="text-xs text-gray-500 mt-1">
          {input.length} characters
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}

      {output && !error && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">
              {mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'}
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="btn-secondary text-xs"
            >
              <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <textarea
            className="form-input font-mono"
            rows="6"
            value={output}
            readOnly
          />
          <div className="text-xs text-gray-500 mt-1">
            {output.length} characters
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">About Base64:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Base64 is a encoding scheme that converts binary data to text</li>
          <li>• Commonly used for data transmission and storage</li>
          <li>• Uses 64 characters: A-Z, a-z, 0-9, +, /</li>
          <li>• Safe for transmission over text-based protocols</li>
          <li>• Used in email attachments, data URIs, and APIs</li>
        </ul>
      </div>
    </div>
  );
}

export default Base64Tool;