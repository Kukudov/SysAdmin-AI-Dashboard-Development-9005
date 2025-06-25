import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function URITool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [encodingType, setEncodingType] = useState('component');
  const [error, setError] = useState('');

  const processURI = () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        let encoded;
        switch (encodingType) {
          case 'component':
            encoded = encodeURIComponent(input);
            break;
          case 'uri':
            encoded = encodeURI(input);
            break;
          case 'custom':
            // Custom encoding for special characters
            encoded = input.replace(/[^A-Za-z0-9\-_.~]/g, (char) => {
              return '%' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
            });
            break;
          default:
            encoded = encodeURIComponent(input);
        }
        setOutput(encoded);
      } else {
        let decoded;
        try {
          decoded = decodeURIComponent(input);
        } catch (e) {
          // Fallback for malformed URI
          decoded = input.replace(/%[0-9A-Fa-f]{2}/g, (match) => {
            try {
              return String.fromCharCode(parseInt(match.slice(1), 16));
            } catch {
              return match;
            }
          });
        }
        setOutput(decoded);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setOutput('');
    }
  };

  React.useEffect(() => {
    processURI();
  }, [input, mode, encodingType]);

  const sampleTexts = {
    encode: 'Hello World! @#$%^&*()+={}[]|\\:";\'<>?,./~`',
    decode: 'Hello%20World%21%20%40%23%24%25%5E%26%2A%28%29%2B%3D%7B%7D%5B%5D%7C%5C%3A%22%3B%27%3C%3E%3F%2C.%2F~%60'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">URI Encoder/Decoder</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Mode</label>
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
        </div>

        {mode === 'encode' && (
          <div>
            <label className="form-label">Encoding Type</label>
            <select
              className="form-input"
              value={encodingType}
              onChange={(e) => setEncodingType(e.target.value)}
            >
              <option value="component">encodeURIComponent (recommended)</option>
              <option value="uri">encodeURI</option>
              <option value="custom">Custom encoding</option>
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={() => setInput(sampleTexts[mode])}
            className="btn-secondary text-sm"
          >
            Load Sample
          </button>
        </div>
      </div>

      <div>
        <label className="form-label">
          {mode === 'encode' ? 'Text to Encode' : 'URI to Decode'}
        </label>
        <textarea
          className="form-input font-mono"
          rows="6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URI-encoded text to decode...'}
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
              {mode === 'encode' ? 'URI Encoded' : 'Decoded Text'}
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
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">URI Encoding Types:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>encodeURIComponent:</strong> Encodes all characters except: A-Z a-z 0-9 - _ . ~ ! * ' ( )</li>
          <li>• <strong>encodeURI:</strong> Encodes fewer characters, preserves URI structure (: / ? # [ ] @)</li>
          <li>• <strong>Custom:</strong> Encodes all characters except: A-Z a-z 0-9 - _ . ~</li>
          <li>• Use encodeURIComponent for query parameters and form data</li>
          <li>• Use encodeURI for complete URLs while preserving structure</li>
        </ul>
      </div>
    </div>
  );
}

export default URITool;