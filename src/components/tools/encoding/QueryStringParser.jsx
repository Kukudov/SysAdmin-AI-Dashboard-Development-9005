import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiPlus, FiTrash2, FiDownload } = FiIcons;

function QueryStringParser() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('parse');
  const [parsed, setParsed] = useState({});
  const [builder, setBuilder] = useState([{ key: '', value: '' }]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [encoding, setEncoding] = useState('auto');

  const parseQueryString = (queryString) => {
    if (!queryString.trim()) {
      setParsed({});
      setError('');
      return;
    }

    try {
      // Remove leading ? or # if present
      let cleanQuery = queryString.trim().replace(/^[?#]/, '');
      
      const params = {};
      const pairs = cleanQuery.split('&').filter(Boolean);

      pairs.forEach((pair, index) => {
        let [key, value] = pair.split('=');
        
        if (!key) return;

        // Decode based on encoding setting
        try {
          if (encoding === 'auto' || encoding === 'uri') {
            key = decodeURIComponent(key);
            value = value ? decodeURIComponent(value) : '';
          } else if (encoding === 'plus') {
            key = decodeURIComponent(key.replace(/\+/g, ' '));
            value = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          } else {
            // No decoding
            value = value || '';
          }
        } catch (e) {
          // If decoding fails, use original values
          key = pair.split('=')[0];
          value = pair.split('=')[1] || '';
        }

        // Handle array notation (key[] or key[0])
        const arrayMatch = key.match(/^(.+?)\[(\d*)\]$/);
        if (arrayMatch) {
          const baseKey = arrayMatch[1];
          const arrayIndex = arrayMatch[2];
          
          if (!params[baseKey]) {
            params[baseKey] = arrayIndex ? {} : [];
          }
          
          if (arrayIndex) {
            params[baseKey][arrayIndex] = value;
          } else {
            if (Array.isArray(params[baseKey])) {
              params[baseKey].push(value);
            } else {
              params[baseKey] = [params[baseKey], value];
            }
          }
        } else {
          // Handle duplicate keys using Object.prototype.hasOwnProperty.call
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            if (Array.isArray(params[key])) {
              params[key].push(value);
            } else {
              params[key] = [params[key], value];
            }
          } else {
            params[key] = value;
          }
        }
      });

      setParsed(params);
      setError('');
    } catch (err) {
      setError(`Error parsing query string: ${err.message}`);
      setParsed({});
    }
  };

  const buildQueryString = () => {
    try {
      const params = new URLSearchParams();
      
      builder.forEach(({ key, value }) => {
        if (key.trim()) {
          params.append(key.trim(), value);
        }
      });

      setOutput(params.toString());
      setError('');
    } catch (err) {
      setError(`Error building query string: ${err.message}`);
      setOutput('');
    }
  };

  React.useEffect(() => {
    if (mode === 'parse') {
      parseQueryString(input);
    } else {
      buildQueryString();
    }
  }, [input, mode, encoding, builder]);

  const addBuilderRow = () => {
    setBuilder([...builder, { key: '', value: '' }]);
  };

  const removeBuilderRow = (index) => {
    if (builder.length > 1) {
      setBuilder(builder.filter((_, i) => i !== index));
    }
  };

  const updateBuilderRow = (index, field, value) => {
    const updated = [...builder];
    updated[index][field] = value;
    setBuilder(updated);
  };

  const loadFromParsed = () => {
    const newBuilder = [];
    Object.entries(parsed).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          newBuilder.push({ key, value: v });
        });
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          newBuilder.push({ key: `${key}[${subKey}]`, value: subValue });
        });
      } else {
        newBuilder.push({ key, value });
      }
    });
    setBuilder(newBuilder.length > 0 ? newBuilder : [{ key: '', value: '' }]);
    setMode('build');
  };

  const exportToJSON = () => {
    const data = mode === 'parse' ? parsed : Object.fromEntries(
      builder.filter(row => row.key.trim()).map(row => [row.key, row.value])
    );
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-params.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sampleQueries = [
    'name=John&age=30&city=New York&hobbies=reading&hobbies=coding',
    'search=hello+world&category=tech&page=1&limit=10&sort=date',
    'user%5Bname%5D=John&user%5Bemail%5D=john%40example.com&user%5Bage%5D=30',
    'items[]=apple&items[]=banana&items[]=cherry&count=3',
    'utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&utm_content=ad1'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Query String Parser</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Mode</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="parse"
                checked={mode === 'parse'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-2"
              />
              <span>Parse</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="build"
                checked={mode === 'build'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-2"
              />
              <span>Build</span>
            </label>
          </div>
        </div>

        <div>
          <label className="form-label">Encoding</label>
          <select
            className="form-input"
            value={encoding}
            onChange={(e) => setEncoding(e.target.value)}
          >
            <option value="auto">Auto detect</option>
            <option value="uri">URI encoding (%20)</option>
            <option value="plus">Plus encoding (+)</option>
            <option value="none">No encoding</option>
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <button onClick={exportToJSON} className="btn-secondary text-sm flex items-center">
            <SafeIcon icon={FiDownload} className="w-3 h-3 mr-1" />
            Export JSON
          </button>
          {mode === 'parse' && Object.keys(parsed).length > 0 && (
            <button onClick={loadFromParsed} className="btn-secondary text-sm">
              Edit in Builder
            </button>
          )}
        </div>
      </div>

      {mode === 'parse' ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="form-label">Query String to Parse</label>
              <div className="flex space-x-2">
                {sampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(query)}
                    className="btn-secondary text-xs"
                    title={query}
                  >
                    Sample {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="form-input font-mono"
              rows="4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter query string (with or without leading ? or #)"
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

          {Object.keys(parsed).length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Parsed Parameters ({Object.keys(parsed).length})
                  </h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(parsed, null, 2))}
                    className="btn-secondary text-xs"
                  >
                    <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                    Copy JSON
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(parsed).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <code className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {key}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(
                          Array.isArray(value) ? value.join(', ') : 
                          typeof value === 'object' ? JSON.stringify(value) : value
                        )}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiCopy} className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {Array.isArray(value) ? (
                        <div>
                          <span className="text-gray-500">Array ({value.length} items):</span>
                          <ul className="mt-1 ml-4 space-y-1">
                            {value.map((item, index) => (
                              <li key={index} className="font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                [{index}] {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : typeof value === 'object' ? (
                        <div>
                          <span className="text-gray-500">Object:</span>
                          <pre className="mt-1 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <code className="font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                          {value}
                        </code>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Query String Builder
                </h4>
                <button onClick={addBuilderRow} className="btn-primary text-sm flex items-center">
                  <SafeIcon icon={FiPlus} className="w-3 h-3 mr-1" />
                  Add Parameter
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {builder.map((row, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Parameter name"
                    className="form-input flex-1"
                    value={row.key}
                    onChange={(e) => updateBuilderRow(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Parameter value"
                    className="form-input flex-1"
                    value={row.value}
                    onChange={(e) => updateBuilderRow(index, 'value', e.target.value)}
                  />
                  <button
                    onClick={() => removeBuilderRow(index)}
                    disabled={builder.length === 1}
                    className="btn-danger text-sm"
                  >
                    <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Generated Query String</label>
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
                rows="4"
                value={output}
                readOnly
              />
              <div className="text-xs text-gray-500 mt-1">
                {output.length} characters
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Supported Formats:</h4>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>• Simple parameters: <code>key=value</code></li>
            <li>• Array notation: <code>items[]=a&items[]=b</code></li>
            <li>• Indexed arrays: <code>items[0]=a&items[1]=b</code></li>
            <li>• Nested objects: <code>user[name]=John&user[age]=30</code></li>
            <li>• Duplicate keys (converted to arrays)</li>
            <li>• URL encoded values</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Parse complex query strings into structured data</li>
            <li>• Build query strings from key-value pairs</li>
            <li>• Handle different encoding types</li>
            <li>• Support for arrays and nested objects</li>
            <li>• Export parameters as JSON</li>
            <li>• Copy individual values or entire results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QueryStringParser;