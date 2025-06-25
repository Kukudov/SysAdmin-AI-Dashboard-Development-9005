import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as cronParser from 'cron-parser';

const { FiCode, FiCheck, FiX, FiCopy, FiDownload, FiPlay, FiSearch } = FiIcons;

const JSTools = () => {
  const { hasApiKey, generateScript } = useAI();
  const [activeCategory, setActiveCategory] = useState('text');
  const [activeTool, setActiveTool] = useState('json-formatter');
  const [searchTerm, setSearchTerm] = useState('');

  // Tool categories and tools
  const toolCategories = {
    text: {
      name: 'Text & String',
      tools: {
        'ascii-art': { name: 'ASCII Art Text Generator', component: ASCIIArtGenerator },
        'string-case': { name: 'String Case Converter', component: StringCaseConverter },
        'string-inspector': { name: 'String Inspector', component: StringInspector },
        'lorem-ipsum': { name: 'Lorem Ipsum Generator', component: LoremIpsumGenerator },
        'text-diff': { name: 'Text Diff', component: TextDiff },
        'html-to-text': { name: 'HTML To Text', component: HTMLToText },
        'markdown-to-html': { name: 'Markdown To HTML', component: MarkdownToHTML },
        'html-to-markdown': { name: 'HTML To Markdown', component: HTMLToMarkdown }
      }
    },
    encoding: {
      name: 'Encoding & Decoding',
      tools: {
        'base64': { name: 'Base64 Encoder/Decoder', component: Base64Tool },
        'base58': { name: 'Base58 Encoder/Decoder', component: Base58Tool },
        'uri-encoder': { name: 'URI Encoder/Decoder', component: URITool },
        'html-entities': { name: 'HTML Entities Encoder/Decoder', component: HTMLEntitiesConverter },
        'url-parser': { name: 'URL Parser', component: URLParser },
        'querystring-parser': { name: 'QueryString Parser', component: QueryStringParser }
      }
    },
    formatters: {
      name: 'Formatters & Validators',
      tools: {
        'json-formatter': { name: 'JSON Formatter', component: JSONFormatter },
        'json-viewer': { name: 'JSON Viewer', component: JSONViewer },
        'json-explorer': { name: 'JSON Explorer', component: JSONExplorer },
        'xml-formatter': { name: 'XML Formatter', component: XMLFormatter },
        'yaml-formatter': { name: 'YAML Formatter', component: YAMLFormatter },
        'css-formatter': { name: 'CSS Formatter', component: CSSFormatter },
        'html-formatter': { name: 'HTML Formatter', component: HTMLFormatter },
        'sql-formatter': { name: 'SQL Formatter', component: SQLFormatter }
      }
    },
    generators: {
      name: 'Generators',
      tools: {
        'password-generator': { name: 'Password Generator', component: PasswordGenerator },
        'uuid-generator': { name: 'UUID Generator', component: UUIDGenerator },
        'ulid-generator': { name: 'ULID Generator', component: ULIDGenerator },
        'qr-code': { name: 'QR Code Generator', component: QRCodeGenerator },
        'hash-generator': { name: 'Hash Generator', component: HashGenerator },
        'hmac-generator': { name: 'HMAC Generator', component: HMACGenerator },
        'jwt-decoder': { name: 'JWT Decoder', component: JWTDecoder }
      }
    },
    crypto: {
      name: 'Cryptography',
      tools: {
        'bcrypt': { name: 'BCrypt', component: BCryptTool },
        'bip39': { name: 'BIP39 Passphrase Generator', component: BIP39Generator },
        'pgp-key': { name: 'PGP Key Generator', component: PGPKeyGenerator },
        'rsa-key': { name: 'RSA Key Pair Generator', component: RSAKeyGenerator },
        'data-encryptor': { name: 'Data Encryptor', component: DataEncryptor },
        'basic-auth': { name: 'Basic Auth Generator', component: BasicAuthGenerator }
      }
    },
    utilities: {
      name: 'Utilities',
      tools: {
        'regex-tester': { name: 'RegExp Tester', component: RegexTester },
        'cron-parser': { name: 'CRON Parser', component: CronParser },
        'unix-time': { name: 'Unix Time Converter', component: UnixTimeConverter },
        'unit-converter': { name: 'Unit Converter', component: UnitConverter },
        'number-base': { name: 'Number Base Converter', component: NumberBaseConverter },
        'chmod-calculator': { name: 'Chmod Calculator', component: ChmodCalculator },
        'keycode-info': { name: 'Keycode Info', component: KeycodeInfo }
      }
    },
    web: {
      name: 'Web Development',
      tools: {
        'color-palette': { name: 'Color Palette Generator', component: ColorPaletteGenerator },
        'color-contrast': { name: 'Color Contrast Calculator', component: ColorContrastCalculator },
        'css-shadow': { name: 'CSS Shadow Generator', component: CSSShadowGenerator },
        'css-triangle': { name: 'CSS Triangle Generator', component: CSSTriangleGenerator },
        'favicon-generator': { name: 'Favicon Generator', component: FaviconGenerator },
        'placeholder-image': { name: 'Placeholder Image Generator', component: PlaceholderImageGenerator },
        'data-url': { name: 'Data URL Generator', component: DataURLGenerator }
      }
    }
  };

  // Filter tools based on search
  const filteredTools = Object.entries(toolCategories).reduce((acc, [categoryId, category]) => {
    const filteredCategoryTools = Object.entries(category.tools).filter(([toolId, tool]) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredCategoryTools.length > 0) {
      acc[categoryId] = {
        ...category,
        tools: Object.fromEntries(filteredCategoryTools)
      };
    }
    
    return acc;
  }, {});

  const ActiveToolComponent = toolCategories[activeCategory]?.tools[activeTool]?.component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          JavaScript & DevOps Tools
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              className="form-input pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tool Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="space-y-2">
              {Object.entries(filteredTools).map(([categoryId, category]) => (
                <div key={categoryId}>
                  <button
                    onClick={() => {
                      setActiveCategory(categoryId);
                      const firstTool = Object.keys(category.tools)[0];
                      if (firstTool) setActiveTool(firstTool);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === categoryId
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Object.keys(category.tools).length} tools
                    </div>
                  </button>
                  
                  {activeCategory === categoryId && (
                    <div className="ml-4 mt-2 space-y-1">
                      {Object.entries(category.tools).map(([toolId, tool]) => (
                        <button
                          key={toolId}
                          onClick={() => setActiveTool(toolId)}
                          className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                            activeTool === toolId
                              ? 'bg-primary-50 dark:bg-primary-800 text-primary-600 dark:text-primary-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tool Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {ActiveToolComponent ? (
              <ActiveToolComponent />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a tool from the sidebar to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tool Components
function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">JSON Formatter</h3>
      
      <div>
        <label className="form-label">JSON Input</label>
        <textarea
          className="form-input font-mono"
          rows="8"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30}'
        />
      </div>

      <button onClick={formatJSON} className="btn-primary">
        Format JSON
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {output && (
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
          <SyntaxHighlighter language="json" style={tomorrow}>
            {output}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const convert = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Base64 Encoder/Decoder</h3>
      
      <div>
        <label className="form-label">Mode</label>
        <select className="form-input" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="encode">Encode to Base64</option>
          <option value="decode">Decode from Base64</option>
        </select>
      </div>

      <div>
        <label className="form-label">Input</label>
        <textarea
          className="form-input"
          rows="4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        />
      </div>

      <button onClick={convert} className="btn-primary">
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">Output</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="btn-secondary text-xs"
            >
              <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <textarea className="form-input font-mono" rows="4" value={output} readOnly />
        </div>
      )}
    </div>
  );
}

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false
  });

  const generatePassword = () => {
    let charset = '';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Password Generator</h3>
      
      <div>
        <label className="form-label">Password Length: {length}</label>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.uppercase}
            onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
            className="mr-2"
          />
          Uppercase Letters
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.lowercase}
            onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
            className="mr-2"
          />
          Lowercase Letters
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.numbers}
            onChange={(e) => setOptions({...options, numbers: e.target.checked})}
            className="mr-2"
          />
          Numbers
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.symbols}
            onChange={(e) => setOptions({...options, symbols: e.target.checked})}
            className="mr-2"
          />
          Symbols
        </label>
      </div>

      <button onClick={generatePassword} className="btn-primary">
        Generate Password
      </button>

      {password && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">Generated Password</label>
            <button
              onClick={() => navigator.clipboard.writeText(password)}
              className="btn-secondary text-xs"
            >
              <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <div className="form-input font-mono bg-gray-50 dark:bg-gray-700">
            {password}
          </div>
        </div>
      )}
    </div>
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const results = [...testString.matchAll(regex)];
      setMatches(results.map((match, index) => ({
        index,
        match: match[0],
        groups: match.slice(1),
        position: match.index
      })));
    } catch (error) {
      setMatches([{ error: error.message }]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Regular Expression Tester</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Regex Pattern</label>
          <input
            type="text"
            className="form-input font-mono"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          />
        </div>
        <div>
          <label className="form-label">Flags</label>
          <input
            type="text"
            className="form-input font-mono"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m, s, u, y"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Test String</label>
        <textarea
          className="form-input"
          rows="4"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex pattern..."
        />
      </div>

      <button onClick={testRegex} className="btn-primary">
        Test Regex
      </button>

      {matches.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Matches ({matches.length})
          </h4>
          {matches[0].error ? (
            <div className="text-red-600 dark:text-red-400">
              Error: {matches[0].error}
            </div>
          ) : (
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded border">
                  <div className="font-mono text-sm">
                    <span className="text-blue-600 dark:text-blue-400">Match {index + 1}:</span> {match.match}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Position: {match.position}
                    {match.groups.length > 0 && (
                      <span> | Groups: {match.groups.join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CronParser() {
  const [expression, setExpression] = useState('0 0 * * *');
  const [result, setResult] = useState(null);

  const parseExpression = () => {
    try {
      const interval = cronParser.parseExpression(expression);
      const nextRuns = [];
      for (let i = 0; i < 5; i++) {
        nextRuns.push(interval.next().toString());
      }
      setResult({
        valid: true,
        nextRuns,
        description: `Runs ${expression}`
      });
    } catch (error) {
      setResult({
        valid: false,
        error: error.message
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">CRON Expression Parser</h3>
      
      <div>
        <label className="form-label">CRON Expression</label>
        <input
          type="text"
          className="form-input font-mono"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="0 0 * * *"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Format: minute hour day month dayOfWeek
        </p>
      </div>

      <button onClick={parseExpression} className="btn-primary">
        Parse Expression
      </button>

      {result && (
        <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
          {result.valid ? (
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                {result.description}
              </h4>
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Next 5 executions:
                </p>
                <div className="space-y-1">
                  {result.nextRuns.map((run, index) => (
                    <div key={index} className="font-mono text-sm text-green-600 dark:text-green-400">
                      {run}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-800 dark:text-red-200">
              Error: {result.error}
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          Common Examples:
        </h4>
        <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <div><code>0 0 * * *</code> - Daily at midnight</div>
          <div><code>0 */6 * * *</code> - Every 6 hours</div>
          <div><code>0 9 * * 1</code> - Every Monday at 9 AM</div>
          <div><code>0 0 1 * *</code> - First day of every month</div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other tools
function ASCIIArtGenerator() { return <div>ASCII Art Text Generator - Coming Soon</div>; }
function StringCaseConverter() { return <div>String Case Converter - Coming Soon</div>; }
function StringInspector() { return <div>String Inspector - Coming Soon</div>; }
function LoremIpsumGenerator() { return <div>Lorem Ipsum Generator - Coming Soon</div>; }
function TextDiff() { return <div>Text Diff - Coming Soon</div>; }
function HTMLToText() { return <div>HTML To Text - Coming Soon</div>; }
function MarkdownToHTML() { return <div>Markdown To HTML - Coming Soon</div>; }
function HTMLToMarkdown() { return <div>HTML To Markdown - Coming Soon</div>; }
function Base58Tool() { return <div>Base58 Encoder/Decoder - Coming Soon</div>; }
function URITool() { return <div>URI Encoder/Decoder - Coming Soon</div>; }
function HTMLEntitiesConverter() { return <div>HTML Entities Encoder/Decoder - Coming Soon</div>; }
function URLParser() { return <div>URL Parser - Coming Soon</div>; }
function QueryStringParser() { return <div>QueryString Parser - Coming Soon</div>; }
function JSONViewer() { return <div>JSON Viewer - Coming Soon</div>; }
function JSONExplorer() { return <div>JSON Explorer - Coming Soon</div>; }
function XMLFormatter() { return <div>XML Formatter - Coming Soon</div>; }
function YAMLFormatter() { return <div>YAML Formatter - Coming Soon</div>; }
function CSSFormatter() { return <div>CSS Formatter - Coming Soon</div>; }
function HTMLFormatter() { return <div>HTML Formatter - Coming Soon</div>; }
function SQLFormatter() { return <div>SQL Formatter - Coming Soon</div>; }
function UUIDGenerator() { return <div>UUID Generator - Coming Soon</div>; }
function ULIDGenerator() { return <div>ULID Generator - Coming Soon</div>; }
function QRCodeGenerator() { return <div>QR Code Generator - Coming Soon</div>; }
function HashGenerator() { return <div>Hash Generator - Coming Soon</div>; }
function HMACGenerator() { return <div>HMAC Generator - Coming Soon</div>; }
function JWTDecoder() { return <div>JWT Decoder - Coming Soon</div>; }
function BCryptTool() { return <div>BCrypt - Coming Soon</div>; }
function BIP39Generator() { return <div>BIP39 Passphrase Generator - Coming Soon</div>; }
function PGPKeyGenerator() { return <div>PGP Key Generator - Coming Soon</div>; }
function RSAKeyGenerator() { return <div>RSA Key Pair Generator - Coming Soon</div>; }
function DataEncryptor() { return <div>Data Encryptor - Coming Soon</div>; }
function BasicAuthGenerator() { return <div>Basic Auth Generator - Coming Soon</div>; }
function UnixTimeConverter() { return <div>Unix Time Converter - Coming Soon</div>; }
function UnitConverter() { return <div>Unit Converter - Coming Soon</div>; }
function NumberBaseConverter() { return <div>Number Base Converter - Coming Soon</div>; }
function ChmodCalculator() { return <div>Chmod Calculator - Coming Soon</div>; }
function KeycodeInfo() { return <div>Keycode Info - Coming Soon</div>; }
function ColorPaletteGenerator() { return <div>Color Palette Generator - Coming Soon</div>; }
function ColorContrastCalculator() { return <div>Color Contrast Calculator - Coming Soon</div>; }
function CSSShadowGenerator() { return <div>CSS Shadow Generator - Coming Soon</div>; }
function CSSTriangleGenerator() { return <div>CSS Triangle Generator - Coming Soon</div>; }
function FaviconGenerator() { return <div>Favicon Generator - Coming Soon</div>; }
function PlaceholderImageGenerator() { return <div>Placeholder Image Generator - Coming Soon</div>; }
function DataURLGenerator() { return <div>Data URL Generator - Coming Soon</div>; }

export default JSTools;