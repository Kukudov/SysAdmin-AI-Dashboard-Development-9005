import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function HTMLToMarkdown() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    preserveWhitespace: false,
    useUnderscores: false,
    convertTables: true,
    convertImages: true,
    preserveCodeBlocks: true
  });

  const convertHTMLToMarkdown = (html) => {
    if (!html.trim()) {
      setOutput('');
      return;
    }

    let markdown = html;

    // Convert headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n');

    // Convert code blocks (before inline code)
    if (options.preserveCodeBlocks) {
      markdown = markdown.replace(/<pre[^>]*><code[^>]*class="language-(\w+)"[^>]*>(.*?)<\/code><\/pre>/gis, 
        (match, lang, code) => {
          return `\n\`\`\`${lang}\n${code.trim()}\n\`\`\`\n`;
        });
      markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '\n```\n$1\n```\n');
      markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '\n```\n$1\n```\n');
    }

    // Convert inline code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Convert bold and italic
    const boldPattern = options.useUnderscores ? '__$1__' : '**$1**';
    const italicPattern = options.useUnderscores ? '_$1_' : '*$1*';

    markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, boldPattern);
    markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, italicPattern);

    // Convert strikethrough
    markdown = markdown.replace(/<(del|s|strike)[^>]*>(.*?)<\/(del|s|strike)>/gi, '~~$1~~');

    // Convert links
    markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Convert images
    if (options.convertImages) {
      markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
      markdown = markdown.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![$1]($2)');
      markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)');
    }

    // Convert horizontal rules
    markdown = markdown.replace(/<hr[^>]*\/?>/gi, '\n---\n');

    // Convert blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      return '\n> ' + content.trim().replace(/\n/g, '\n> ') + '\n';
    });

    // Convert tables
    if (options.convertTables) {
      markdown = markdown.replace(/<table[^>]*>(.*?)<\/table>/gis, (match, tableContent) => {
        let result = '\n';
        
        // Extract header
        const headerMatch = tableContent.match(/<thead[^>]*>(.*?)<\/thead>/is);
        if (headerMatch) {
          const headerRows = headerMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gis);
          if (headerRows) {
            headerRows.forEach(row => {
              const cells = row.match(/<th[^>]*>(.*?)<\/th>/gi);
              if (cells) {
                const cellTexts = cells.map(cell => cell.replace(/<[^>]*>/g, '').trim());
                result += '| ' + cellTexts.join(' | ') + ' |\n';
                result += '|' + cellTexts.map(() => '---').join('|') + '|\n';
              }
            });
          }
        }
        
        // Extract body
        const bodyMatch = tableContent.match(/<tbody[^>]*>(.*?)<\/tbody>/is) || [null, tableContent];
        if (bodyMatch[1]) {
          const bodyRows = bodyMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gis);
          if (bodyRows) {
            bodyRows.forEach(row => {
              const cells = row.match(/<td[^>]*>(.*?)<\/td>/gi);
              if (cells) {
                const cellTexts = cells.map(cell => cell.replace(/<[^>]*>/g, '').trim());
                result += '| ' + cellTexts.join(' | ') + ' |\n';
              }
            });
          }
        }
        
        return result + '\n';
      });
    }

    // Convert lists
    // Ordered lists
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, listContent) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gis);
      if (items) {
        return '\n' + items.map((item, index) => {
          const text = item.replace(/<[^>]*>/g, '').trim();
          return `${index + 1}. ${text}`;
        }).join('\n') + '\n';
      }
      return match;
    });

    // Unordered lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, listContent) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gis);
      if (items) {
        return '\n' + items.map(item => {
          const text = item.replace(/<[^>]*>/g, '').trim();
          return `- ${text}`;
        }).join('\n') + '\n';
      }
      return match;
    });

    // Convert paragraphs and divs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gis, '\n$1\n');
    markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/gis, '\n$1\n');

    // Convert line breaks
    markdown = markdown.replace(/<br[^>]*\/?>/gi, '\n');

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

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
      '&ndash;': '–'
    };

    Object.entries(entityMap).forEach(([entity, char]) => {
      markdown = markdown.replace(new RegExp(entity, 'g'), char);
    });

    // Decode numeric entities
    markdown = markdown.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 10));
    });

    // Decode hex entities
    markdown = markdown.replace(/&#x([0-9A-Fa-f]+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });

    // Clean up whitespace
    if (!options.preserveWhitespace) {
      // Remove excessive newlines
      markdown = markdown.replace(/\n{3,}/g, '\n\n');
      // Trim lines
      markdown = markdown.split('\n').map(line => line.trim()).join('\n');
      // Remove leading/trailing whitespace
      markdown = markdown.trim();
    }

    setOutput(markdown);
  };

  React.useEffect(() => {
    convertHTMLToMarkdown(input);
  }, [input, options]);

  const sampleHTML = `<h1>Sample HTML Document</h1>
<p>This is a sample HTML document with <strong>bold text</strong> and <em>italic text</em>.</p>

<h2>Features</h2>
<p>Here are some features:</p>
<ul>
    <li><strong>Bold text</strong></li>
    <li><em>Italic text</em></li>
    <li><del>Strikethrough text</del></li>
    <li><code>inline code</code></li>
    <li><a href="https://example.com">Links</a></li>
</ul>

<h3>Code Block</h3>
<pre><code class="language-javascript">function hello() {
    console.log("Hello, World!");
}</code></pre>

<h3>Table</h3>
<table>
    <thead>
        <tr>
            <th>Feature</th>
            <th>Status</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Headers</td>
            <td>✓</td>
            <td>H1-H6 supported</td>
        </tr>
        <tr>
            <td>Lists</td>
            <td>✓</td>
            <td>Ordered and unordered</td>
        </tr>
    </tbody>
</table>

<h3>Blockquote</h3>
<blockquote>
    This is a blockquote<br>
    It can span multiple lines
</blockquote>

<hr>

<p><img src="https://via.placeholder.com/150" alt="Sample Image"></p>
<p>That's all folks!</p>`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">HTML to Markdown Converter</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.preserveWhitespace}
              onChange={(e) => setOptions({...options, preserveWhitespace: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Preserve Whitespace</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.useUnderscores}
              onChange={(e) => setOptions({...options, useUnderscores: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Use Underscores for emphasis</span>
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.convertTables}
              onChange={(e) => setOptions({...options, convertTables: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Convert Tables</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.convertImages}
              onChange={(e) => setOptions({...options, convertImages: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Convert Images</span>
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.preserveCodeBlocks}
              onChange={(e) => setOptions({...options, preserveCodeBlocks: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Preserve Code Blocks</span>
          </label>
          <button
            onClick={() => setInput(sampleHTML)}
            className="btn-secondary text-sm"
          >
            Load Sample HTML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="form-label">HTML Input</label>
          <textarea
            className="form-input font-mono"
            rows="12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
          />
          <div className="text-xs text-gray-500 mt-1">
            {input.length} characters
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">Markdown Output</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              disabled={!output}
              className="btn-secondary text-xs"
            >
              <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <textarea
            className="form-input font-mono"
            rows="12"
            value={output}
            readOnly
          />
          <div className="text-xs text-gray-500 mt-1">
            {output.length} characters, {output.split('\n').length} lines
          </div>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
        <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Conversion Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700 dark:text-orange-300">
          <ul className="space-y-1">
            <li>• <strong>Headers:</strong> H1-H6 → # ## ### #### ##### ######</li>
            <li>• <strong>Emphasis:</strong> &lt;strong&gt; → **bold** or __bold__</li>
            <li>• <strong>Emphasis:</strong> &lt;em&gt; → *italic* or _italic_</li>
            <li>• <strong>Code:</strong> &lt;code&gt; → `inline code`</li>
            <li>• <strong>Code Blocks:</strong> &lt;pre&gt;&lt;code&gt; → ```</li>
          </ul>
          <ul className="space-y-1">
            <li>• <strong>Links:</strong> &lt;a&gt; → [text](url)</li>
            <li>• <strong>Images:</strong> &lt;img&gt; → ![alt](src)</li>
            <li>• <strong>Lists:</strong> &lt;ul&gt;/&lt;ol&gt; → - or 1.</li>
            <li>• <strong>Tables:</strong> &lt;table&gt; → | col1 | col2 |</li>
            <li>• <strong>Blockquotes:</strong> &lt;blockquote&gt; → > text</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HTMLToMarkdown;