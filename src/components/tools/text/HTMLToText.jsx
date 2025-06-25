import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function HTMLToText() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    preserveFormatting: true,
    preserveLinks: true,
    preserveLists: true,
    includeAltText: true,
    preserveLineBreaks: true,
    removeExtraSpaces: true
  });

  const convertHTMLToText = (html) => {
    if (!html.trim()) {
      setOutput('');
      return;
    }

    let text = html;

    // Handle different HTML elements based on options
    if (options.preserveLinks) {
      // Convert links to readable format: Link Text (URL)
      text = text.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)');
    } else {
      // Just extract link text
      text = text.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
    }

    if (options.includeAltText) {
      // Include alt text from images
      text = text.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, '[Image: $1]');
      text = text.replace(/<img[^>]*>/gi, '[Image]');
    } else {
      text = text.replace(/<img[^>]*>/gi, '');
    }

    if (options.preserveLists) {
      // Convert unordered lists
      text = text.replace(/<ul[^>]*>/gi, '\n');
      text = text.replace(/<\/ul>/gi, '\n');
      text = text.replace(/<li[^>]*>/gi, '• ');
      text = text.replace(/<\/li>/gi, '\n');
      
      // Convert ordered lists
      let olCounter = 1;
      text = text.replace(/<ol[^>]*>/gi, () => {
        olCounter = 1;
        return '\n';
      });
      text = text.replace(/<\/ol>/gi, '\n');
      text = text.replace(/<li[^>]*>/gi, () => `${olCounter++}. `);
    } else {
      text = text.replace(/<[uo]l[^>]*>|<\/[uo]l>|<li[^>]*>|<\/li>/gi, ' ');
    }

    if (options.preserveFormatting) {
      // Convert headers
      text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n');
      
      // Convert paragraphs
      text = text.replace(/<p[^>]*>/gi, '\n');
      text = text.replace(/<\/p>/gi, '\n');
      
      // Convert divs
      text = text.replace(/<div[^>]*>/gi, '\n');
      text = text.replace(/<\/div>/gi, '\n');
      
      // Convert breaks
      text = text.replace(/<br[^>]*>/gi, '\n');
      
      // Convert bold and italic (preserve with markdown-like syntax)
      text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
      text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
      
      // Convert code
      text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
      text = text.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '\n```\n$1\n```\n');
    } else {
      // Just add line breaks for block elements
      text = text.replace(/<\/(h[1-6]|p|div|li|br)[^>]*>/gi, '\n');
      text = text.replace(/<br[^>]*>/gi, '\n');
    }

    if (options.preserveLineBreaks) {
      // Convert common block elements to line breaks
      text = text.replace(/<\/(article|section|header|footer|main|nav|aside)[^>]*>/gi, '\n\n');
    }

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    const entityMap = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '=',
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&hellip;': '…',
      '&mdash;': '—',
      '&ndash;': '–',
      '&lsquo;': ''',
      '&rsquo;': ''',
      '&ldquo;': '"',
      '&rdquo;': '"'
    };

    // Replace named entities
    Object.entries(entityMap).forEach(([entity, char]) => {
      text = text.replace(new RegExp(entity, 'g'), char);
    });

    // Replace numeric entities
    text = text.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 10));
    });

    // Replace hex entities
    text = text.replace(/&#x([0-9A-Fa-f]+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });

    if (options.removeExtraSpaces) {
      // Clean up whitespace
      text = text.replace(/[ \t]+/g, ' '); // Multiple spaces to single space
      text = text.replace(/\n\s*\n\s*\n/g, '\n\n'); // Multiple newlines to double newline
      text = text.replace(/^\s+|\s+$/gm, ''); // Trim lines
      text = text.trim(); // Trim overall
    }

    setOutput(text);
  };

  React.useEffect(() => {
    convertHTMLToText(input);
  }, [input, options]);

  const sampleHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML Document</title>
</head>
<body>
    <h1>Welcome to HTML to Text Converter</h1>
    <p>This is a <strong>sample HTML</strong> document with various elements:</p>
    
    <h2>Features</h2>
    <ul>
        <li>Convert <em>formatted text</em></li>
        <li>Preserve <code>code snippets</code></li>
        <li>Handle <a href="https://example.com">links</a></li>
    </ul>
    
    <h3>Code Example</h3>
    <pre><code>function hello() {
    console.log("Hello, World!");
}</code></pre>
    
    <p>Visit our <a href="https://example.com">website</a> for more information.</p>
    
    <div>
        <img src="image.jpg" alt="Sample Image" />
        <p>This paragraph contains &copy; copyright symbol and &nbsp; non-breaking spaces.</p>
    </div>
</body>
</html>`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">HTML to Text Converter</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.preserveFormatting}
              onChange={(e) => setOptions({...options, preserveFormatting: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Preserve Formatting</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.preserveLinks}
              onChange={(e) => setOptions({...options, preserveLinks: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Preserve Links</span>
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.preserveLists}
              onChange={(e) => setOptions({...options, preserveLists: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Preserve Lists</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.includeAltText}
              onChange={(e) => setOptions({...options, includeAltText: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Include Alt Text</span>
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.preserveLineBreaks}
              onChange={(e) => setOptions({...options, preserveLineBreaks: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Preserve Line Breaks</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.removeExtraSpaces}
              onChange={(e) => setOptions({...options, removeExtraSpaces: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Clean Extra Spaces</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="form-label">HTML Input</label>
          <button
            onClick={() => setInput(sampleHTML)}
            className="btn-secondary text-sm"
          >
            Load Sample
          </button>
        </div>
        <textarea
          className="form-input font-mono"
          rows="10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your HTML here..."
        />
        <div className="text-xs text-gray-500 mt-1">
          {input.length} characters
        </div>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">Converted Text</label>
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
            rows="10"
            value={output}
            readOnly
          />
          <div className="text-xs text-gray-500 mt-1">
            {output.length} characters, {output.split(/\s+/).filter(Boolean).length} words, {output.split('\n').length} lines
          </div>
        </div>
      )}

      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Conversion Features:</h4>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>• <strong>Preserve Formatting:</strong> Converts headers, paragraphs, bold/italic text</li>
          <li>• <strong>Preserve Links:</strong> Shows link text with URLs in parentheses</li>
          <li>• <strong>Preserve Lists:</strong> Converts HTML lists to bullet points or numbers</li>
          <li>• <strong>Include Alt Text:</strong> Extracts alt text from images</li>
          <li>• <strong>HTML Entity Decoding:</strong> Converts &amp;, &lt;, &gt;, etc. to characters</li>
          <li>• <strong>Clean Output:</strong> Removes extra spaces and normalizes whitespace</li>
        </ul>
      </div>
    </div>
  );
}

export default HTMLToText;