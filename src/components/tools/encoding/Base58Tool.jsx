import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function Base58Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');

  // Base58 alphabet (Bitcoin style)
  const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  const stringToBytes = (str) => {
    return new TextEncoder().encode(str);
  };

  const bytesToString = (bytes) => {
    return new TextDecoder().decode(bytes);
  };

  const encodeBase58 = (bytes) => {
    if (bytes.length === 0) return '';
    
    let digits = [0];
    for (let i = 0; i < bytes.length; i++) {
      let carry = bytes[i];
      for (let j = 0; j < digits.length; j++) {
        carry += digits[j] << 8;
        digits[j] = carry % 58;
        carry = Math.floor(carry / 58);
      }
      while (carry > 0) {
        digits.push(carry % 58);
        carry = Math.floor(carry / 58);
      }
    }
    
    // Count leading zeros
    let leadingZeros = 0;
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
      leadingZeros++;
    }
    
    return BASE58_ALPHABET[0].repeat(leadingZeros) + 
           digits.reverse().map(digit => BASE58_ALPHABET[digit]).join('');
  };

  const decodeBase58 = (str) => {
    if (str.length === 0) return new Uint8Array(0);
    
    let bytes = [0];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const charIndex = BASE58_ALPHABET.indexOf(char);
      if (charIndex === -1) {
        throw new Error(`Invalid character: ${char}`);
      }
      
      let carry = charIndex;
      for (let j = 0; j < bytes.length; j++) {
        carry += bytes[j] * 58;
        bytes[j] = carry & 0xff;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }
    
    // Count leading zeros
    let leadingZeros = 0;
    for (let i = 0; i < str.length && str[i] === BASE58_ALPHABET[0]; i++) {
      leadingZeros++;
    }
    
    const result = new Uint8Array(leadingZeros + bytes.length);
    bytes.reverse().forEach((byte, index) => {
      result[leadingZeros + index] = byte;
    });
    
    return result;
  };

  const processBase58 = () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const bytes = stringToBytes(input);
        const encoded = encodeBase58(bytes);
        setOutput(encoded);
      } else {
        const decoded = decodeBase58(input);
        const text = bytesToString(decoded);
        setOutput(text);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setOutput('');
    }
  };

  React.useEffect(() => {
    processBase58();
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Base58 Encoder/Decoder</h3>
      
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
          {mode === 'encode' ? 'Text to Encode' : 'Base58 to Decode'}
        </label>
        <textarea
          className="form-input font-mono"
          rows="6"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base58 to decode...'}
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
              {mode === 'encode' ? 'Base58 Encoded' : 'Decoded Text'}
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

      <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">About Base58:</h4>
        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
          <li>• Base58 is similar to Base64 but excludes confusing characters (0, O, I, l)</li>
          <li>• Commonly used in Bitcoin addresses and other cryptocurrencies</li>
          <li>• More human-readable than Base64</li>
          <li>• Uses 58 characters: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz</li>
          <li>• Prevents errors when manually typing addresses</li>
        </ul>
      </div>
    </div>
  );
}

export default Base58Tool;