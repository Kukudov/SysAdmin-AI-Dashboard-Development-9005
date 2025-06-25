import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { FiCopy, FiCheck, FiX } = FiIcons;

function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');

  const formatJSON = () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setIsValid(true);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setIsValid(false);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError('');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setIsValid(false);
    }
  };

  React.useEffect(() => {
    formatJSON();
  }, [input, indent]);

  const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "coding", "traveling"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  },
  "isActive": true,
  "balance": null
}`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">JSON Formatter & Validator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Indentation</label>
          <select
            className="form-input"
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value))}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
            <option value={0}>Tab character</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={formatJSON} className="btn-primary">
            Format
          </button>
          <button onClick={minifyJSON} className="btn-secondary">
            Minify
          </button>
        </div>

        <div className="flex items-center">
          {isValid === true && (
            <div className="flex items-center text-green-600">
              <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
              <span className="text-sm">Valid JSON</span>
            </div>
          )}
          {isValid === false && (
            <div className="flex items-center text-red-600">
              <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
              <span className="text-sm">Invalid JSON</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="form-label">JSON Input</label>
          <button
            onClick={() => setInput(sampleJSON)}
            className="btn-secondary text-xs"
          >
            Load Sample
          </button>
        </div>
        <textarea
          className="form-input font-mono"
          rows="10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
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
            <label className="form-label mb-0">Formatted JSON</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="btn-secondary text-xs"
            >
              <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <SyntaxHighlighter 
            language="json" 
            style={tomorrow}
            className="max-h-96"
          >
            {output}
          </SyntaxHighlighter>
          <div className="text-xs text-gray-500 mt-1">
            {output.length} characters, {output.split('\n').length} lines
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Format and beautify JSON with proper indentation</li>
          <li>• Minify JSON to remove unnecessary whitespace</li>
          <li>• Real-time validation with error messages</li>
          <li>• Syntax highlighting for better readability</li>
          <li>• Customizable indentation options</li>
        </ul>
      </div>
    </div>
  );
}

export default JSONFormatter;