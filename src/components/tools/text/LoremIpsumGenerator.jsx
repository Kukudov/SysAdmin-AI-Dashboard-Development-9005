import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiRefreshCw } = FiIcons;

function LoremIpsumGenerator() {
  const [output, setOutput] = useState('');
  const [settings, setSettings] = useState({
    count: 3,
    unit: 'paragraphs',
    startWithLorem: true,
    format: 'plain'
  });

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
    'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit',
    'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'ratione', 'sequi',
    'nesciunt', 'neque', 'porro', 'quisquam', 'est', 'qui', 'dolorem', 'adipisci',
    'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quaerat',
    'voluptatem', 'aliquam', 'quaerat', 'enim', 'minima', 'veniam', 'nostrum',
    'exercitationem', 'ullam', 'corporis', 'suscipit', 'laboriosam', 'nec',
    'ullam', 'quis', 'autem', 'vel', 'eum', 'iure', 'qui', 'in', 'ea', 'voluptate',
    'nihil', 'molestiae', 'et', 'iusto', 'odio', 'dignissimos', 'ducimus',
    'blanditiis', 'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti',
    'quos', 'quas', 'molestias', 'excepturi', 'occaecati', 'cupiditate',
    'similique', 'mollitia', 'animi', 'perspiciatis', 'unde', 'omnis', 'iste',
    'natus', 'error', 'accusantium', 'doloremque', 'totam', 'rem', 'aperiam'
  ];

  const generateWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  };

  const generateSentence = (minWords = 4, maxWords = 18) => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    
    for (let i = 0; i < wordCount; i++) {
      words.push(generateWord());
    }
    
    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    
    return words.join(' ') + '.';
  };

  const generateParagraph = (minSentences = 3, maxSentences = 7) => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  const generateLorem = () => {
    let result = [];
    const { count, unit, startWithLorem, format } = settings;

    switch (unit) {
      case 'words':
        const words = [];
        if (startWithLorem) {
          words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        }
        while (words.length < count) {
          words.push(generateWord());
        }
        result = [words.slice(0, count).join(' ') + '.'];
        break;

      case 'sentences':
        for (let i = 0; i < count; i++) {
          if (i === 0 && startWithLorem) {
            result.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
          } else {
            result.push(generateSentence());
          }
        }
        break;

      case 'paragraphs':
      default:
        for (let i = 0; i < count; i++) {
          if (i === 0 && startWithLorem) {
            result.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + generateParagraph(2, 6));
          } else {
            result.push(generateParagraph());
          }
        }
        break;
    }

    // Apply formatting
    let formatted = '';
    switch (format) {
      case 'html':
        if (unit === 'paragraphs') {
          formatted = result.map(p => `<p>${p}</p>`).join('\n');
        } else {
          formatted = `<p>${result.join(' ')}</p>`;
        }
        break;
      case 'markdown':
        if (unit === 'paragraphs') {
          formatted = result.join('\n\n');
        } else {
          formatted = result.join(' ');
        }
        break;
      case 'json':
        formatted = JSON.stringify(result, null, 2);
        break;
      case 'list':
        formatted = result.map((item, index) => `${index + 1}. ${item}`).join('\n');
        break;
      case 'plain':
      default:
        if (unit === 'paragraphs') {
          formatted = result.join('\n\n');
        } else {
          formatted = result.join(' ');
        }
        break;
    }

    setOutput(formatted);
  };

  React.useEffect(() => {
    generateLorem();
  }, [settings]);

  const presets = [
    { name: 'Short Paragraph', count: 1, unit: 'paragraphs' },
    { name: '3 Paragraphs', count: 3, unit: 'paragraphs' },
    { name: '5 Paragraphs', count: 5, unit: 'paragraphs' },
    { name: '50 Words', count: 50, unit: 'words' },
    { name: '100 Words', count: 100, unit: 'words' },
    { name: '10 Sentences', count: 10, unit: 'sentences' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lorem Ipsum Generator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="form-label">Count</label>
          <input
            type="number"
            min="1"
            max="100"
            className="form-input"
            value={settings.count}
            onChange={(e) => setSettings({...settings, count: parseInt(e.target.value) || 1})}
          />
        </div>
        
        <div>
          <label className="form-label">Unit</label>
          <select
            className="form-input"
            value={settings.unit}
            onChange={(e) => setSettings({...settings, unit: e.target.value})}
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Format</label>
          <select
            className="form-input"
            value={settings.format}
            onChange={(e) => setSettings({...settings, format: e.target.value})}
          >
            <option value="plain">Plain Text</option>
            <option value="html">HTML</option>
            <option value="markdown">Markdown</option>
            <option value="json">JSON</option>
            <option value="list">Numbered List</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.startWithLorem}
              onChange={(e) => setSettings({...settings, startWithLorem: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Start with "Lorem ipsum"</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Quick presets:</span>
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => setSettings({...settings, count: preset.count, unit: preset.unit})}
            className="btn-secondary text-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Generated Text</h4>
        <div className="flex space-x-2">
          <button
            onClick={generateLorem}
            className="btn-secondary text-sm flex items-center"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Regenerate
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output}
            className="btn-primary text-sm flex items-center"
          >
            <SafeIcon icon={FiCopy} className="w-4 h-4 mr-2" />
            Copy
          </button>
        </div>
      </div>

      <textarea
        className="form-input font-mono min-h-[300px]"
        value={output}
        readOnly
        placeholder="Generated lorem ipsum text will appear here..."
      />

      <div className="text-xs text-gray-500 mt-2">
        Generated: {output.length} characters, {output.split(' ').length} words, {output.split(/[.!?]+/).length - 1} sentences
      </div>

      <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">About Lorem Ipsum:</h4>
        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
          <li>• Standard placeholder text used in the printing and typesetting industry</li>
          <li>• Based on a work by Cicero from 45 BC</li>
          <li>• Nonsensical Latin text that focuses attention on design rather than content</li>
          <li>• Multiple output formats supported for different use cases</li>
          <li>• Customizable length and structure for any project needs</li>
        </ul>
      </div>
    </div>
  );
}

export default LoremIpsumGenerator;