import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy, FiDownload } = FiIcons;

function TextDiff() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [options, setOptions] = useState({
    ignoreWhitespace: false,
    ignoreCase: false,
    showLineNumbers: true,
    diffType: 'character' // 'character', 'word', 'line'
  });
  const [stats, setStats] = useState(null);

  const generateDiff = () => {
    let left = leftText;
    let right = rightText;

    // Apply options
    if (options.ignoreCase) {
      left = left.toLowerCase();
      right = right.toLowerCase();
    }

    if (options.ignoreWhitespace) {
      left = left.replace(/\s+/g, ' ').trim();
      right = right.replace(/\s+/g, ' ').trim();
    }

    let diff = [];
    let additions = 0;
    let deletions = 0;
    let modifications = 0;

    if (options.diffType === 'line') {
      const leftLines = left.split('\n');
      const rightLines = right.split('\n');
      diff = diffLines(leftLines, rightLines);
    } else if (options.diffType === 'word') {
      const leftWords = left.split(/\s+/).filter(Boolean);
      const rightWords = right.split(/\s+/).filter(Boolean);
      diff = diffWords(leftWords, rightWords);
    } else {
      diff = diffChars(left, right);
    }

    // Calculate stats
    diff.forEach(part => {
      if (part.added) additions++;
      else if (part.removed) deletions++;
      else if (part.modified) modifications++;
    });

    setDiffResult(diff);
    setStats({
      additions,
      deletions,
      modifications,
      unchanged: diff.filter(part => !part.added && !part.removed && !part.modified).length
    });
  };

  const diffChars = (left, right) => {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length || j < right.length) {
      if (i >= left.length) {
        // Remaining characters in right are additions
        result.push({ value: right[j], added: true });
        j++;
      } else if (j >= right.length) {
        // Remaining characters in left are deletions
        result.push({ value: left[i], removed: true });
        i++;
      } else if (left[i] === right[j]) {
        // Characters match
        result.push({ value: left[i] });
        i++;
        j++;
      } else {
        // Characters don't match - find next match
        let leftNext = left.indexOf(right[j], i);
        let rightNext = right.indexOf(left[i], j);

        if (leftNext !== -1 && (rightNext === -1 || leftNext - i <= rightNext - j)) {
          // Deletion in left
          result.push({ value: left[i], removed: true });
          i++;
        } else if (rightNext !== -1) {
          // Addition in right
          result.push({ value: right[j], added: true });
          j++;
        } else {
          // Substitution
          result.push({ value: left[i], removed: true });
          result.push({ value: right[j], added: true });
          i++;
          j++;
        }
      }
    }

    return result;
  };

  const diffWords = (leftWords, rightWords) => {
    return diffArray(leftWords, rightWords, ' ');
  };

  const diffLines = (leftLines, rightLines) => {
    return diffArray(leftLines, rightLines, '\n');
  };

  const diffArray = (left, right, separator) => {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length || j < right.length) {
      if (i >= left.length) {
        result.push({ value: right[j] + separator, added: true });
        j++;
      } else if (j >= right.length) {
        result.push({ value: left[i] + separator, removed: true });
        i++;
      } else if (left[i] === right[j]) {
        result.push({ value: left[i] + separator });
        i++;
        j++;
      } else {
        // Find longest common subsequence
        let leftNext = left.indexOf(right[j], i);
        let rightNext = right.indexOf(left[i], j);

        if (leftNext !== -1 && (rightNext === -1 || leftNext - i <= rightNext - j)) {
          result.push({ value: left[i] + separator, removed: true });
          i++;
        } else if (rightNext !== -1) {
          result.push({ value: right[j] + separator, added: true });
          j++;
        } else {
          result.push({ value: left[i] + separator, removed: true });
          result.push({ value: right[j] + separator, added: true });
          i++;
          j++;
        }
      }
    }

    return result;
  };

  React.useEffect(() => {
    generateDiff();
  }, [leftText, rightText, options]);

  const exportDiff = () => {
    const diffText = diffResult.map(part => {
      if (part.added) return `+ ${part.value}`;
      if (part.removed) return `- ${part.value}`;
      return `  ${part.value}`;
    }).join('');

    const report = `Text Diff Report
================

Statistics:
- Additions: ${stats?.additions || 0}
- Deletions: ${stats?.deletions || 0}
- Modifications: ${stats?.modifications || 0}
- Unchanged: ${stats?.unchanged || 0}

Options:
- Ignore Case: ${options.ignoreCase}
- Ignore Whitespace: ${options.ignoreWhitespace}
- Diff Type: ${options.diffType}

Diff:
${diffText}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-diff-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyDiff = () => {
    const diffText = diffResult.map(part => {
      if (part.added) return `+ ${part.value}`;
      if (part.removed) return `- ${part.value}`;
      return `  ${part.value}`;
    }).join('');
    
    navigator.clipboard.writeText(diffText);
  };

  const loadSample = () => {
    setLeftText(`The quick brown fox jumps over the lazy dog.
This is the first version of the text.
It contains some sample content for testing.
Lorem ipsum dolor sit amet.`);

    setRightText(`The quick brown fox leaps over the lazy cat.
This is the second version of the text.
It contains some sample content for testing purposes.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Text Diff</h3>
      
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="form-label">Diff Type</label>
          <select
            className="form-input"
            value={options.diffType}
            onChange={(e) => setOptions({...options, diffType: e.target.value})}
          >
            <option value="character">Character</option>
            <option value="word">Word</option>
            <option value="line">Line</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.ignoreCase}
              onChange={(e) => setOptions({...options, ignoreCase: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Ignore Case</span>
          </label>
        </div>
        
        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.ignoreWhitespace}
              onChange={(e) => setOptions({...options, ignoreWhitespace: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm">Ignore Whitespace</span>
          </label>
        </div>
        
        <div className="flex items-end">
          <button onClick={loadSample} className="btn-secondary text-sm">
            Load Sample
          </button>
        </div>
      </div>

      {/* Input Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Original Text (Left)</label>
          <textarea
            className="form-input font-mono"
            rows="10"
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Enter original text here..."
          />
          <div className="text-xs text-gray-500 mt-1">
            {leftText.length} characters
          </div>
        </div>
        
        <div>
          <label className="form-label">Modified Text (Right)</label>
          <textarea
            className="form-input font-mono"
            rows="10"
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Enter modified text here..."
          />
          <div className="text-xs text-gray-500 mt-1">
            {rightText.length} characters
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.additions}</div>
            <div className="text-xs text-green-700 dark:text-green-300">Additions</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.deletions}</div>
            <div className="text-xs text-red-700 dark:text-red-300">Deletions</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.modifications}</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Modifications</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats.unchanged}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Unchanged</div>
          </div>
        </div>
      )}

      {/* Diff Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="form-label mb-0">Diff Result</label>
          <div className="flex space-x-2">
            <button
              onClick={copyDiff}
              disabled={diffResult.length === 0}
              className="btn-secondary text-sm flex items-center"
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4 mr-2" />
              Copy
            </button>
            <button
              onClick={exportDiff}
              disabled={diffResult.length === 0}
              className="btn-secondary text-sm flex items-center"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 font-mono text-sm min-h-[200px] max-h-[400px] overflow-auto">
          {diffResult.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 italic">
              Enter text in both fields to see the diff
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {diffResult.map((part, index) => (
                <span
                  key={index}
                  className={
                    part.added
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : part.removed
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 line-through'
                      : ''
                  }
                >
                  {part.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Diff Legend:</h4>
        <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Added text</span>
            <span>- Content that was added in the modified version</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded line-through">Removed text</span>
            <span>- Content that was removed from the original</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1">Unchanged text</span>
            <span>- Content that remained the same</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextDiff;