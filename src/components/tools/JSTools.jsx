import React, { useState } from 'react';
import { useAI } from '../../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// Import all implemented tool components
import ASCIIArtGenerator from './text/ASCIIArtGenerator';
import StringCaseConverter from './text/StringCaseConverter';
import StringInspector from './text/StringInspector';
import LoremIpsumGenerator from './text/LoremIpsumGenerator';
import TextDiff from './text/TextDiff';
import HTMLToText from './text/HTMLToText';
import MarkdownToHTML from './text/MarkdownToHTML';
import HTMLToMarkdown from './text/HTMLToMarkdown';

import Base64Tool from './encoding/Base64Tool';
import Base58Tool from './encoding/Base58Tool';
import URITool from './encoding/URITool';
import HTMLEntitiesConverter from './encoding/HTMLEntitiesConverter';
import URLParser from './encoding/URLParser';
import QueryStringParser from './encoding/QueryStringParser';

import JSONFormatter from './formatters/JSONFormatter';

import PasswordGenerator from './generators/PasswordGenerator';
import UUIDGenerator from './generators/UUIDGenerator';

const { FiSearch } = FiIcons;

// Placeholder components for tools not yet implemented
function JSONViewer() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">JSON Viewer</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Interactive JSON viewer with collapsible tree structure and syntax highlighting.
        </p>
      </div>
    </div>
  );
}

function JSONExplorer() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">JSON Explorer</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Advanced JSON explorer with path queries and data analysis.
        </p>
      </div>
    </div>
  );
}

function XMLFormatter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">XML Formatter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Format and validate XML documents with proper indentation.
        </p>
      </div>
    </div>
  );
}

function YAMLFormatter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">YAML Formatter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Format and validate YAML files with syntax highlighting.
        </p>
      </div>
    </div>
  );
}

function CSSFormatter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CSS Formatter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Format and beautify CSS code with proper indentation and organization.
        </p>
      </div>
    </div>
  );
}

function HTMLFormatter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HTML Formatter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Format and beautify HTML code with proper indentation and structure.
        </p>
      </div>
    </div>
  );
}

function SQLFormatter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">SQL Formatter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Format and beautify SQL queries with proper keywords and indentation.
        </p>
      </div>
    </div>
  );
}

function ULIDGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">ULID Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate Universally Unique Lexicographically Sortable Identifiers (ULIDs).
        </p>
      </div>
    </div>
  );
}

function QRCodeGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">QR Code Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate QR codes for text, URLs, and other data with customizable options.
        </p>
      </div>
    </div>
  );
}

function HashGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Hash Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate MD5, SHA-1, SHA-256, SHA-512 hashes for text and files.
        </p>
      </div>
    </div>
  );
}

function HMACGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HMAC Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate HMAC (Hash-based Message Authentication Code) with various algorithms.
        </p>
      </div>
    </div>
  );
}

function JWTDecoder() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">JWT Decoder</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Decode and validate JSON Web Tokens (JWT) and inspect claims.
        </p>
      </div>
    </div>
  );
}

function BCryptTool() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">BCrypt</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Hash and verify passwords using the BCrypt algorithm.
        </p>
      </div>
    </div>
  );
}

function BIP39Generator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">BIP39 Passphrase Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate BIP39 mnemonic phrases for cryptocurrency wallets.
        </p>
      </div>
    </div>
  );
}

function PGPKeyGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">PGP Key Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate PGP key pairs for encryption and digital signatures.
        </p>
      </div>
    </div>
  );
}

function RSAKeyGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">RSA Key Pair Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate RSA public/private key pairs for encryption and signatures.
        </p>
      </div>
    </div>
  );
}

function DataEncryptor() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data Encryptor</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Encrypt and decrypt data using various algorithms (AES, DES, etc.).
        </p>
      </div>
    </div>
  );
}

function BasicAuthGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Basic Auth Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate Basic Authentication headers for HTTP requests.
        </p>
      </div>
    </div>
  );
}

function RegexTester() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">RegExp Tester</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Test regular expressions with real-time matching and explanation.
        </p>
      </div>
    </div>
  );
}

function CronParser() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CRON Parser</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Parse and explain CRON expressions with next execution times.
        </p>
      </div>
    </div>
  );
}

function UnixTimeConverter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unix Time Converter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert between Unix timestamps and human-readable dates.
        </p>
      </div>
    </div>
  );
}

function UnitConverter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unit Converter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert between various units (length, weight, temperature, etc.).
        </p>
      </div>
    </div>
  );
}

function NumberBaseConverter() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Number Base Converter</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert numbers between different bases (binary, octal, decimal, hex).
        </p>
      </div>
    </div>
  );
}

function ChmodCalculator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chmod Calculator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Calculate Unix file permissions and chmod values.
        </p>
      </div>
    </div>
  );
}

function KeycodeInfo() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Keycode Info</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Get JavaScript key codes and key information for keyboard events.
        </p>
      </div>
    </div>
  );
}

function ColorPaletteGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Color Palette Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate beautiful color palettes for design projects.
        </p>
      </div>
    </div>
  );
}

function ColorContrastCalculator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Color Contrast Calculator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Calculate color contrast ratios for accessibility compliance.
        </p>
      </div>
    </div>
  );
}

function CSSShadowGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CSS Shadow Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate CSS box-shadow and text-shadow properties visually.
        </p>
      </div>
    </div>
  );
}

function CSSTriangleGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CSS Triangle Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate CSS triangles using border properties.
        </p>
      </div>
    </div>
  );
}

function FaviconGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Favicon Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate favicons in multiple sizes and formats.
        </p>
      </div>
    </div>
  );
}

function PlaceholderImageGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Placeholder Image Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Generate placeholder images with custom dimensions and colors.
        </p>
      </div>
    </div>
  );
}

function DataURLGenerator() {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data URL Generator</h3>
      <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Convert files to Data URLs for embedding in HTML/CSS.
        </p>
      </div>
    </div>
  );
}

const JSTools = () => {
  const { hasApiKey, generateScript } = useAI();
  const [activeCategory, setActiveCategory] = useState('text');
  const [activeTool, setActiveTool] = useState('string-inspector');
  const [searchTerm, setSearchTerm] = useState('');

  // Tool categories and tools - ALL IMPLEMENTED TOOLS INCLUDED
  const toolCategories = {
    text: {
      name: 'Text & String',
      tools: {
        'string-inspector': { name: 'String Inspector', component: StringInspector },
        'ascii-art': { name: 'ASCII Art Text Generator', component: ASCIIArtGenerator },
        'string-case': { name: 'String Case Converter', component: StringCaseConverter },
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

      {/* Tool Summary */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Available Tools Summary:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-700 dark:text-blue-300">
          {Object.entries(toolCategories).map(([categoryId, category]) => (
            <div key={categoryId}>
              <h5 className="font-semibold mb-1">{category.name} ({Object.keys(category.tools).length})</h5>
              <ul className="space-y-1 ml-2">
                {Object.values(category.tools).map((tool, index) => (
                  <li key={index} className="text-xs">• {tool.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Total: {Object.values(toolCategories).reduce((sum, category) => sum + Object.keys(category.tools).length, 0)} tools available
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Fully implemented: {Object.values(toolCategories).reduce((sum, category) => 
              sum + Object.values(category.tools).filter(tool => 
                [StringInspector, ASCIIArtGenerator, StringCaseConverter, LoremIpsumGenerator, 
                 TextDiff, HTMLToText, MarkdownToHTML, HTMLToMarkdown, Base64Tool, Base58Tool, 
                 URITool, HTMLEntitiesConverter, URLParser, QueryStringParser, JSONFormatter, 
                 PasswordGenerator, UUIDGenerator].includes(tool.component)
              ).length, 0
            )} tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default JSTools;