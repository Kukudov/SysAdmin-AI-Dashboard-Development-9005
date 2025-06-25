import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiEye } = FiIcons;

function MarkdownToHTML() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [viewMode, setViewMode] = useState('html'); // 'html' or 'preview'
  const [options, setOptions] = useState({
    addLineBreaks: true,
    sanitizeHTML: true,
    enableTables: true,
    enableCodeHighlight: false
  });

  const convertMarkdownToHTML = (markdown) => {
    if (!markdown.trim()) {
      setOutput('');
      return;
    }

    let html = markdown;

    // Escape HTML if sanitizing
    if (options.sanitizeHTML) {
      html = html.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#x27;');
    }

    // Headers (must come before other processing)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');

    // Code blocks (before inline code)
    html = html.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
      const language = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${language}>${code}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\_\_\_(.*?)\_\_\_/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
    html = html.replace(/\_(.*?)\_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');

    // Tables (if enabled)
    if (options.enableTables) {
      html = html.replace(/\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
        const headerCells = header.split('|').map(cell => cell.trim()).filter(Boolean);
        const headerRow = '<tr>' + headerCells.map(cell => `<th>${cell}</th>`).join('') + '</tr>';
        
        const bodyRows = rows.trim().split('\n').map(row => {
          const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
          return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        }).join('\n');
        
        return `<table>\n<thead>\n${headerRow}\n</thead>\n<tbody>\n${bodyRows}\n</tbody>\n</table>`;
      });
    }

    // Unordered lists
    html = html.replace(/^[\s]*[-*+] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, (match) => {
      return '<ul>\n' + match + '\n</ul>';
    });

    // Ordered lists
    html = html.replace(/^[\s]*\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, (match) => {
      // Check if it's already wrapped in ul (unordered list)
      if (!match.includes('<ul>')) {
        return '<ol>\n' + match + '\n</ol>';
      }
      return match;
    });

    // Blockquotes
    html = html.replace(/^> (.+)/gm, '<blockquote>$1</blockquote>');
    
    // Paragraphs (handle multiple lines)
    if (options.addLineBreaks) {
      // Split into paragraphs on double line breaks
      const paragraphs = html.split(/\n\s*\n/);
      html = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Don't wrap if it's already a block element
        if (para.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr|table|div)/)) {
          return para;
        }
        
        return `<p>${para}</p>`;
      }).filter(Boolean).join('\n\n');
    }

    // Line breaks
    if (options.addLineBreaks) {
      html = html.replace(/\n/g, '<br>\n');
      // Clean up br tags in block elements
      html = html.replace(/<(h[1-6]|li|th|td|blockquote)>([^<]*)<br>\n/g, '<$1>$2\n');
      html = html.replace(/<br>\n<\/(h[1-6]|li|th|td|blockquote|p)>/g, '</$1>');
    }

    setOutput(html);
  };

  React.useEffect(() => {
    convertMarkdownToHTML(input);
  }, [input, options]);

  const sampleMarkdown = `# Sample Markdown Document

This is a **sample** markdown document with various elements.

## Features

Here are some *markdown* features:

- **Bold text**
- *Italic text*
- ~~Strikethrough text~~
- \`inline code\`
- [Links](https://example.com)

### Code Block

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Table

| Feature | Status | Notes |
|---------|--------|-------|
| Headers | ✓ | H1-H6 supported |
| Lists | ✓ | Ordered and unordered |
| Code | ✓ | Inline and blocks |

### Blockquote

> This is a blockquote
> It can span multiple lines

---

### Image

![Sample Image](https://via.placeholder.com/150)

That's all folks!`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Markdown to HTML Converter</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.addLineBreaks}
              onChange={(e) => setOptions({...options, addLineBreaks: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Add Line Breaks</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.sanitizeHTML}
              onChange={(e) => setOptions({...options, sanitizeHTML: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Sanitize HTML</span>
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.enableTables}
              onChange={(e) => setOptions({...options, enableTables: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Enable Tables</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.enableCodeHighlight}
              onChange={(e) => setOptions({...options, enableCodeHighlight: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Code Highlighting</span>
          </label>
        </div>
        
        <div>
          <label className="form-label">View Mode</label>
          <select
            className="form-input"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="html">HTML Code</option>
            <option value="preview">Live Preview</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => setInput(sampleMarkdown)}
            className="btn-secondary text-sm"
          >
            Load Sample
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Markdown Input</label>
          <textarea
            className="form-input font-mono"
            rows="12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter markdown here..."
          />
          <div className="text-xs text-gray-500 mt-1">
            {input.length} characters
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">
              {viewMode === 'html' ? 'HTML Output' : 'Live Preview'}
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'html' ? 'preview' : 'html')}
                className="btn-secondary text-xs flex items-center"
              >
                <SafeIcon icon={FiEye} className="w-3 h-3 mr-1" />
                {viewMode === 'html' ? 'Preview' : 'HTML'}
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                disabled={!output}
                className="btn-secondary text-xs"
              >
                <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                Copy
              </button>
            </div>
          </div>
          
          {viewMode === 'html' ? (
            <textarea
              className="form-input font-mono"
              rows="12"
              value={output}
              readOnly
            />
          ) : (
            <div 
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 min-h-[300px] overflow-auto prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          )}
          
          <div className="text-xs text-gray-500 mt-1">
            {output.length} characters
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Supported Markdown Syntax:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <ul className="space-y-1">
            <li>• <strong>Headers:</strong> # ## ### #### ##### ######</li>
            <li>• <strong>Bold:</strong> **text** or __text__</li>
            <li>• <strong>Italic:</strong> *text* or _text_</li>
            <li>• <strong>Strikethrough:</strong> ~~text~~</li>
            <li>• <strong>Code:</strong> `inline` or ```block```</li>
          </ul>
          <ul className="space-y-1">
            <li>• <strong>Links:</strong> [text](url)</li>
            <li>• <strong>Images:</strong> ![alt](url)</li>
            <li>• <strong>Lists:</strong> - or * or 1.</li>
            <li>• <strong>Blockquotes:</strong> > text</li>
            <li>• <strong>Tables:</strong> | col1 | col2 |</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MarkdownToHTML;