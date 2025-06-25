import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// Import all tool components
import ASCIIArtGenerator from '../components/tools/text/ASCIIArtGenerator';
import StringCaseConverter from '../components/tools/text/StringCaseConverter';
import Base64Tool from '../components/tools/encoding/Base64Tool';
import Base58Tool from '../components/tools/encoding/Base58Tool';
import JSONFormatter from '../components/tools/formatters/JSONFormatter';
import PasswordGenerator from '../components/tools/generators/PasswordGenerator';
import UUIDGenerator from '../components/tools/generators/UUIDGenerator';

const { FiSearch } = FiIcons;

// Placeholder components for tools not yet implemented
function StringInspector() { return <div>String Inspector - Coming Soon</div>; }
function LoremIpsumGenerator() { return <div>Lorem Ipsum Generator - Coming Soon</div>; }
function TextDiff() { return <div>Text Diff - Coming Soon</div>; }
function HTMLToText() { return <div>HTML To Text - Coming Soon</div>; }
function MarkdownToHTML() { return <div>Markdown To HTML - Coming Soon</div>; }
function HTMLToMarkdown() { return <div>HTML To Markdown - Coming Soon</div>; }
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
function RegexTester() { return <div>RegExp Tester - Coming Soon</div>; }
function CronParser() { return <div>CRON Parser - Coming Soon</div>; }
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