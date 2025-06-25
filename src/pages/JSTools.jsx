import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// Import all tool components
import ASCIIArtGenerator from '../components/tools/text/ASCIIArtGenerator';
import StringCaseConverter from '../components/tools/text/StringCaseConverter';
import Base64Tool from '../components/tools/encoding/Base64Tool';
import Base58Tool from '../components/tools/encoding/Base58Tool';
import URITool from '../components/tools/encoding/URITool';
import HTMLEntitiesConverter from '../components/tools/encoding/HTMLEntitiesConverter';
import URLParser from '../components/tools/encoding/URLParser';
import QueryStringParser from '../components/tools/encoding/QueryStringParser';
import JSONFormatter from '../components/tools/formatters/JSONFormatter';
import PasswordGenerator from '../components/tools/generators/PasswordGenerator';
import UUIDGenerator from '../components/tools/generators/UUIDGenerator';

const { FiSearch } = FiIcons;

// Placeholder components for tools not yet implemented
function StringInspector() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">String Inspector</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This tool will provide detailed analysis of string properties, character counts, encoding detection, and more.
        </p>
      </div>
    </div>
  );
}

function LoremIpsumGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Lorem Ipsum Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate placeholder text in various formats and lengths.
        </p>
      </div>
    </div>
  );
}

function TextDiff() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Text Diff</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Compare two text blocks and highlight differences.
        </p>
      </div>
    </div>
  );
}

function HTMLToText() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HTML To Text</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert HTML content to plain text while preserving structure.
        </p>
      </div>
    </div>
  );
}

function MarkdownToHTML() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Markdown To HTML</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert Markdown syntax to HTML markup.
        </p>
      </div>
    </div>
  );
}

function HTMLToMarkdown() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HTML To Markdown</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert HTML markup to Markdown syntax.
        </p>
      </div>
    </div>
  );
}

// Additional placeholder components
function JSONViewer() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">JSON Viewer</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function JSONExplorer() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">JSON Explorer</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function XMLFormatter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">XML Formatter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function YAMLFormatter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">YAML Formatter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function CSSFormatter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CSS Formatter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function HTMLFormatter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HTML Formatter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function SQLFormatter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">SQL Formatter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function ULIDGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">ULID Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function QRCodeGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">QR Code Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function HashGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Hash Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function HMACGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HMAC Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function JWTDecoder() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">JWT Decoder</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function BCryptTool() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">BCrypt</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function BIP39Generator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">BIP39 Passphrase Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function PGPKeyGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">PGP Key Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function RSAKeyGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">RSA Key Pair Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function DataEncryptor() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data Encryptor</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function BasicAuthGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Basic Auth Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function RegexTester() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">RegExp Tester</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function CronParser() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CRON Parser</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function UnixTimeConverter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unix Time Converter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function UnitConverter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unit Converter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function NumberBaseConverter() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Number Base Converter</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function ChmodCalculator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chmod Calculator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function KeycodeInfo() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Keycode Info</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function ColorPaletteGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Color Palette Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function ColorContrastCalculator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Color Contrast Calculator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function CSSShadowGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CSS Shadow Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function CSSTriangleGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CSS Triangle Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function FaviconGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Favicon Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function PlaceholderImageGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Placeholder Image Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

function DataURLGenerator() {
  return <div className="text-center py-12"><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data URL Generator</h3><p className="text-gray-600 dark:text-gray-400">Coming Soon</p></div>;
}

const JSTools = () => {
  const { hasApiKey, generateScript } = useAI();
  const [activeCategory, setActiveCategory] = useState('text');
  const [activeTool, setActiveTool] = useState('ascii-art');
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

export default JSTools;