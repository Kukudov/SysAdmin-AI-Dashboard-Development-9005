import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function StringCaseConverter() {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState({});

  const convertCases = () => {
    if (!input.trim()) {
      setOutputs({});
      return;
    }

    setOutputs({
      lowercase: input.toLowerCase(),
      uppercase: input.toUpperCase(),
      title: input.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentence: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
      camelCase: input
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, ''),
      pascalCase: input
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, ''),
      snake_case: input
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, ''),
      'kebab-case': input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      CONSTANT_CASE: input
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, ''),
      dot_case: input
        .toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, ''),
      alternating: input
        .split('')
        .map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join(''),
      inverse: input
        .split('')
        .map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join('')
    });
  };

  React.useEffect(() => {
    convertCases();
  }, [input]);

  const caseDescriptions = {
    lowercase: 'All characters in lowercase',
    uppercase: 'All characters in uppercase',
    title: 'First letter of each word capitalized',
    sentence: 'First letter capitalized, rest lowercase',
    camelCase: 'First word lowercase, subsequent words capitalized',
    pascalCase: 'First letter of each word capitalized, no spaces',
    snake_case: 'Words separated by underscores, lowercase',
    'kebab-case': 'Words separated by hyphens, lowercase',
    CONSTANT_CASE: 'Words separated by underscores, uppercase',
    dot_case: 'Words separated by dots, lowercase',
    alternating: 'Alternating between lower and uppercase',
    inverse: 'Inverts the case of each character'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">String Case Converter</h3>
      
      <div>
        <label className="form-label">Input Text</label>
        <textarea
          className="form-input"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to different cases..."
        />
      </div>

      {Object.keys(outputs).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(outputs).map(([type, value]) => (
            <div key={type} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {caseDescriptions[type]}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(value)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  title="Copy to clipboard"
                >
                  <SafeIcon icon={FiCopy} className="w-3 h-3" />
                </button>
              </div>
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded border min-h-[3rem] flex items-center">
                {value || <span className="text-gray-400 italic">Empty result</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Use Cases:</h4>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>• <strong>camelCase:</strong> JavaScript variables and functions</li>
          <li>• <strong>PascalCase:</strong> Class names and components</li>
          <li>• <strong>snake_case:</strong> Python variables and database columns</li>
          <li>• <strong>kebab-case:</strong> CSS classes and URLs</li>
          <li>• <strong>CONSTANT_CASE:</strong> Environment variables and constants</li>
        </ul>
      </div>
    </div>
  );
}

export default StringCaseConverter;