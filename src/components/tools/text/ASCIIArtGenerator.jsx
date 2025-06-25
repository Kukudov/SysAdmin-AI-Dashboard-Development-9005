import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function ASCIIArtGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [font, setFont] = useState('block');

  const fonts = {
    block: {
      'A': ['█████', '█   █', '█████', '█   █', '█   █'],
      'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
      'C': ['█████', '█    ', '█    ', '█    ', '█████'],
      'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
      'E': ['█████', '█    ', '████ ', '█    ', '█████'],
      'F': ['█████', '█    ', '████ ', '█    ', '█    '],
      'G': ['█████', '█    ', '█ ███', '█   █', '█████'],
      'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
      'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
      'J': ['█████', '    █', '    █', '█   █', '█████'],
      'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
      'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
      'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
      'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
      'O': ['█████', '█   █', '█   █', '█   █', '█████'],
      'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
      'Q': ['█████', '█   █', '█ █ █', '█  ██', '█████'],
      'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
      'S': ['█████', '█    ', '█████', '    █', '█████'],
      'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
      'U': ['█   █', '█   █', '█   █', '█   █', '█████'],
      'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
      'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
      'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
      'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
      'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
      '0': ['█████', '█   █', '█   █', '█   █', '█████'],
      '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
      '2': ['█████', '    █', '█████', '█    ', '█████'],
      '3': ['█████', '    █', '█████', '    █', '█████'],
      '4': ['█   █', '█   █', '█████', '    █', '    █'],
      '5': ['█████', '█    ', '█████', '    █', '█████'],
      '6': ['█████', '█    ', '█████', '█   █', '█████'],
      '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
      '8': ['█████', '█   █', '█████', '█   █', '█████'],
      '9': ['█████', '█   █', '█████', '    █', '█████'],
      ' ': ['     ', '     ', '     ', '     ', '     '],
      '!': ['  █  ', '  █  ', '  █  ', '     ', '  █  '],
      '?': ['█████', '    █', '  ██ ', '     ', '  █  '],
      '.': ['     ', '     ', '     ', '     ', '  █  '],
      ',': ['     ', '     ', '     ', '  █  ', ' █   '],
      ':': ['     ', '  █  ', '     ', '  █  ', '     '],
      ';': ['     ', '  █  ', '     ', '  █  ', ' █   '],
      '-': ['     ', '     ', '█████', '     ', '     '],
      '+': ['     ', '  █  ', '█████', '  █  ', '     '],
      '=': ['     ', '█████', '     ', '█████', '     '],
      '/': ['    █', '   █ ', '  █  ', ' █   ', '█    '],
      '\\': ['█    ', ' █   ', '  █  ', '   █ ', '    █']
    },
    small: {
      'A': ['▄▀█', '█▀█', '█▄█'],
      'B': ['█▀▄', '█▀▄', '█▄▀'],
      'C': ['▄▀█', '█▄▄', '▀▀▀'],
      'D': ['█▀▄', '█ █', '█▄▀'],
      'E': ['█▀▀', '█▀▀', '█▄▄'],
      'F': ['█▀▀', '█▀▀', '█  '],
      'G': ['▄▀█', '█▄█', '▀▀▀'],
      'H': ['█ █', '█▀█', '█ █'],
      'I': ['█', '█', '█'],
      'J': ['  █', '  █', '█▀█'],
      'K': ['█ █', '██ ', '█ █'],
      'L': ['█  ', '█  ', '█▄▄'],
      'M': ['█▄█', '█▀█', '█ █'],
      'N': ['█▄█', '█▀█', '█ █'],
      'O': ['▄▀█', '█ █', '▀▀▀'],
      'P': ['█▀▄', '█▀ ', '█  '],
      'Q': ['▄▀█', '█▄█', '▀▀▀'],
      'R': ['█▀▄', '█▀▄', '█ █'],
      'S': ['▄▀▀', '▀▀▄', '▄▄▀'],
      'T': ['▀█▀', ' █ ', ' █ '],
      'U': ['█ █', '█ █', '▀▀▀'],
      'V': ['█ █', '█ █', ' █ '],
      'W': ['█ █', '█▀█', '█▄█'],
      'X': ['█ █', ' █ ', '█ █'],
      'Y': ['█ █', ' █ ', ' █ '],
      'Z': ['▀▀▀', ' ▄▀', '▀▀▀'],
      ' ': ['   ', '   ', '   '],
      '0': ['▄▀█', '█ █', '▀▀▀'],
      '1': [' █', ' █', ' █'],
      '2': ['▀▀█', '▄▀ ', '▀▀▀'],
      '3': ['▀▀█', '▀▀█', '▀▀▀'],
      '4': ['█ █', '▀▀█', '  █'],
      '5': ['█▀▀', '▀▀█', '▀▀▀'],
      '6': ['█▀▀', '█▀█', '▀▀▀'],
      '7': ['▀▀█', '  █', '  █'],
      '8': ['▄▀█', '▄▀█', '▀▀▀'],
      '9': ['▄▀█', '▀▀█', '▀▀▀']
    }
  };

  const generateASCII = () => {
    const selectedFont = fonts[font];
    const chars = input.toUpperCase().split('');
    
    if (chars.length === 0) {
      setOutput('');
      return;
    }

    const fontHeight = selectedFont['A']?.length || 5;
    const lines = Array(fontHeight).fill('');
    
    chars.forEach((char, charIndex) => {
      const charPattern = selectedFont[char] || selectedFont[' '] || Array(fontHeight).fill('     ');
      
      charPattern.forEach((line, lineIndex) => {
        if (charIndex > 0) {
          lines[lineIndex] += ' ';
        }
        lines[lineIndex] += line;
      });
    });
    
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">ASCII Art Text Generator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Text Input</label>
          <input
            type="text"
            className="form-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum 20 characters</p>
        </div>
        
        <div>
          <label className="form-label">Font Style</label>
          <select
            className="form-input"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            <option value="block">Block Letters</option>
            <option value="small">Small Letters</option>
          </select>
        </div>
      </div>

      <button onClick={generateASCII} disabled={!input.trim()} className="btn-primary">
        Generate ASCII Art
      </button>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">ASCII Art Output</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="btn-secondary text-xs"
            >
              <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Tips:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Works best with short words or phrases</li>
          <li>• Supports letters, numbers, and basic punctuation</li>
          <li>• Try different font styles for various effects</li>
        </ul>
      </div>
    </div>
  );
}

export default ASCIIArtGenerator;