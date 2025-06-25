import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiExternalLink } = FiIcons;

function URLParser() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');

  const parseURL = (urlString) => {
    if (!urlString.trim()) {
      setParsed(null);
      setError('');
      return;
    }

    try {
      // Add protocol if missing
      let normalizedUrl = urlString.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = 'http://' + normalizedUrl;
      }

      const url = new URL(normalizedUrl);
      
      // Parse query parameters
      const params = {};
      url.searchParams.forEach((value, key) => {
        if (params[key]) {
          if (Array.isArray(params[key])) {
            params[key].push(value);
          } else {
            params[key] = [params[key], value];
          }
        } else {
          params[key] = value;
        }
      });

      // Parse hash fragments
      const hashParts = url.hash.slice(1).split('&').filter(Boolean);
      const hashParams = {};
      hashParts.forEach(part => {
        const [key, value] = part.split('=').map(decodeURIComponent);
        if (key) {
          hashParams[key] = value || '';
        }
      });

      const result = {
        original: urlString,
        normalized: url.href,
        protocol: url.protocol,
        username: url.username,
        password: url.password ? '***' : '',
        hostname: url.hostname,
        port: url.port,
        host: url.host,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        
        // Parsed components
        domain: url.hostname,
        subdomain: url.hostname.split('.').slice(0, -2).join('.'),
        rootDomain: url.hostname.split('.').slice(-2).join('.'),
        pathSegments: url.pathname.split('/').filter(Boolean),
        queryParams: params,
        hashParams: hashParams,
        
        // Analysis
        isSecure: url.protocol === 'https:',
        isLocalhost: url.hostname === 'localhost' || url.hostname === '127.0.0.1',
        isIP: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname),
        hasAuth: !!(url.username || url.password),
        hasQuery: url.search.length > 0,
        hasFragment: url.hash.length > 0,
        paramCount: Object.keys(params).length,
        pathDepth: url.pathname.split('/').filter(Boolean).length
      };

      setParsed(result);
      setError('');
    } catch (err) {
      setError(`Invalid URL: ${err.message}`);
      setParsed(null);
    }
  };

  React.useEffect(() => {
    parseURL(input);
  }, [input]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sampleURLs = [
    'https://user:pass@example.com:8080/path/to/page?param1=value1&param2=value2&arr[]=1&arr[]=2#section1',
    'http://subdomain.example.com/api/v1/users?limit=10&offset=20',
    'https://localhost:3000/admin/dashboard?tab=analytics&filter=active',
    'ftp://files.example.org/downloads/file.zip',
    'https://192.168.1.1:8080/config?setting=value'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">URL Parser</h3>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="form-label">URL to Parse</label>
          <div className="flex space-x-2">
            {sampleURLs.map((url, index) => (
              <button
                key={index}
                onClick={() => setInput(url)}
                className="btn-secondary text-xs"
                title={url}
              >
                Sample {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="form-input pr-10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL to parse (e.g., https://example.com/path?param=value#section)"
          />
          {parsed && (
            <a
              href={parsed.normalized}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {input.length} characters
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}

      {parsed && (
        <div className="space-y-4">
          {/* URL Components */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">URL Components</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Protocol', value: parsed.protocol },
                { label: 'Host', value: parsed.host },
                { label: 'Hostname', value: parsed.hostname },
                { label: 'Port', value: parsed.port || '(default)' },
                { label: 'Pathname', value: parsed.pathname },
                { label: 'Search', value: parsed.search || '(none)' },
                { label: 'Hash', value: parsed.hash || '(none)' },
                { label: 'Origin', value: parsed.origin }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {value}
                    </code>
                    <button
                      onClick={() => copyToClipboard(value)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiCopy} className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Analysis */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Domain Analysis</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Domain:</span>
                <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {parsed.domain}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Root Domain:</span>
                <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {parsed.rootDomain}
                </code>
              </div>
              {parsed.subdomain && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subdomain:</span>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {parsed.subdomain}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Path Segments */}
          {parsed.pathSegments.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Path Segments ({parsed.pathSegments.length})
                </h4>
              </div>
              <div className="space-y-2">
                {parsed.pathSegments.map((segment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      [{index}]:
                    </span>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {decodeURIComponent(segment)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(segment)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiCopy} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {Object.keys(parsed.queryParams).length > 0 && (
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Query Parameters ({Object.keys(parsed.queryParams).length})
                </h4>
              </div>
              <div className="space-y-2">
                {Object.entries(parsed.queryParams).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {key}:
                    </span>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded max-w-xs break-all">
                        {Array.isArray(value) ? `[${value.join(', ')}]` : value}
                      </code>
                      <button
                        onClick={() => copyToClipboard(Array.isArray(value) ? value.join(', ') : value)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiCopy} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hash Parameters */}
          {Object.keys(parsed.hashParams).length > 0 && (
            <div className="card">
              <div className="card-header">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Hash Parameters ({Object.keys(parsed.hashParams).length})
                </h4>
              </div>
              <div className="space-y-2">
                {Object.entries(parsed.hashParams).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {key}:
                    </span>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {value}
                      </code>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiCopy} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* URL Properties */}
          <div className="card">
            <div className="card-header">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">URL Properties</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-lg font-bold ${parsed.isSecure ? 'text-green-600' : 'text-red-600'}`}>
                  {parsed.isSecure ? '🔒' : '🔓'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {parsed.isSecure ? 'Secure (HTTPS)' : 'Not Secure'}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${parsed.isLocalhost ? 'text-blue-600' : 'text-gray-600'}`}>
                  🏠
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {parsed.isLocalhost ? 'Localhost' : 'Remote'}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${parsed.hasAuth ? 'text-orange-600' : 'text-gray-600'}`}>
                  👤
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {parsed.hasAuth ? 'Has Auth' : 'No Auth'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">
                  {parsed.pathDepth}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Path Depth
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Parse any valid URL into its components</li>
          <li>• Extract and decode query parameters</li>
          <li>• Analyze domain structure and subdomains</li>
          <li>• Break down path segments</li>
          <li>• Identify URL properties (security, localhost, authentication)</li>
          <li>• Handle hash fragments and parameters</li>
          <li>• Copy individual components to clipboard</li>
        </ul>
      </div>
    </div>
  );
}

export default URLParser;