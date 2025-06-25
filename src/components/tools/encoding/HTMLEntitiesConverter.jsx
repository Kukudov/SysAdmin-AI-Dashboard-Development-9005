import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCopy } = FiIcons;

function HTMLEntitiesConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [encodingType, setEncodingType] = useState('named');
  const [error, setError] = useState('');

  // HTML entity mappings
  const namedEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    ' ': '&nbsp;',
    '¡': '&iexcl;',
    '¢': '&cent;',
    '£': '&pound;',
    '¤': '&curren;',
    '¥': '&yen;',
    '¦': '&brvbar;',
    '§': '&sect;',
    '¨': '&uml;',
    '©': '&copy;',
    'ª': '&ordf;',
    '«': '&laquo;',
    '¬': '&not;',
    '®': '&reg;',
    '°': '&deg;',
    '±': '&plusmn;',
    '²': '&sup2;',
    '³': '&sup3;',
    'µ': '&micro;',
    '¶': '&para;',
    '·': '&middot;',
    '¹': '&sup1;',
    'º': '&ordm;',
    '»': '&raquo;',
    '¼': '&frac14;',
    '½': '&frac12;',
    '¾': '&frac34;',
    '¿': '&iquest;',
    'À': '&Agrave;',
    'Á': '&Aacute;',
    'Â': '&Acirc;',
    'Ã': '&Atilde;',
    'Ä': '&Auml;',
    'Å': '&Aring;',
    'Æ': '&AElig;',
    'Ç': '&Ccedil;',
    'È': '&Egrave;',
    'É': '&Eacute;',
    'Ê': '&Ecirc;',
    'Ë': '&Euml;',
    'Ì': '&Igrave;',
    'Í': '&Iacute;',
    'Î': '&Icirc;',
    'Ï': '&Iuml;',
    'Ð': '&ETH;',
    'Ñ': '&Ntilde;',
    'Ò': '&Ograve;',
    'Ó': '&Oacute;',
    'Ô': '&Ocirc;',
    'Õ': '&Otilde;',
    'Ö': '&Ouml;',
    '×': '&times;',
    'Ø': '&Oslash;',
    'Ù': '&Ugrave;',
    'Ú': '&Uacute;',
    'Û': '&Ucirc;',
    'Ü': '&Uuml;',
    'Ý': '&Yacute;',
    'Þ': '&THORN;',
    'ß': '&szlig;',
    'à': '&agrave;',
    'á': '&aacute;',
    'â': '&acirc;',
    'ã': '&atilde;',
    'ä': '&auml;',
    'å': '&aring;',
    'æ': '&aelig;',
    'ç': '&ccedil;',
    'è': '&egrave;',
    'é': '&eacute;',
    'ê': '&ecirc;',
    'ë': '&euml;',
    'ì': '&igrave;',
    'í': '&iacute;',
    'î': '&icirc;',
    'ï': '&iuml;',
    'ð': '&eth;',
    'ñ': '&ntilde;',
    'ò': '&ograve;',
    'ó': '&oacute;',
    'ô': '&ocirc;',
    'õ': '&otilde;',
    'ö': '&ouml;',
    '÷': '&divide;',
    'ø': '&oslash;',
    'ù': '&ugrave;',
    'ú': '&uacute;',
    'û': '&ucirc;',
    'ü': '&uuml;',
    'ý': '&yacute;',
    'þ': '&thorn;',
    'ÿ': '&yuml;'
  };

  // Reverse mapping for decoding
  const reverseNamedEntities = Object.fromEntries(
    Object.entries(namedEntities).map(([char, entity]) => [entity, char])
  );

  const encodeHTML = (text) => {
    if (encodingType === 'named') {
      // Use named entities where available, numeric for others
      return text.replace(/[&<>"'\/`= \u00A0-\u9999]/g, (char) => {
        if (namedEntities[char]) {
          return namedEntities[char];
        }
        const code = char.charCodeAt(0);
        return code > 127 ? `&#${code};` : char;
      });
    } else if (encodingType === 'numeric') {
      // Use numeric entities for all non-ASCII
      return text.replace(/[&<>"'\/`= \u00A0-\u9999]/g, (char) => {
        const code = char.charCodeAt(0);
        return `&#${code};`;
      });
    } else if (encodingType === 'hex') {
      // Use hexadecimal entities
      return text.replace(/[&<>"'\/`= \u00A0-\u9999]/g, (char) => {
        const code = char.charCodeAt(0);
        return `&#x${code.toString(16).toUpperCase()};`;
      });
    } else {
      // Basic encoding (only essential characters)
      return text.replace(/[&<>"']/g, (char) => {
        const basic = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return basic[char] || char;
      });
    }
  };

  const decodeHTML = (text) => {
    return text
      // Decode named entities
      .replace(/&[a-zA-Z][a-zA-Z0-9]+;/g, (entity) => {
        return reverseNamedEntities[entity] || entity;
      })
      // Decode numeric entities
      .replace(/&#(\d+);/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 10));
      })
      // Decode hexadecimal entities
      .replace(/&#x([0-9A-Fa-f]+);/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 16));
      });
  };

  const processHTML = () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = encodeHTML(input);
        setOutput(encoded);
      } else {
        const decoded = decodeHTML(input);
        setOutput(decoded);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setOutput('');
    }
  };

  React.useEffect(() => {
    processHTML();
  }, [input, mode, encodingType]);

  const sampleTexts = {
    encode: '<div class="example">Hello & welcome to "HTML" encoding! © 2024</div>',
    decode: '&lt;div class=&quot;example&quot;&gt;Hello &amp; welcome to &quot;HTML&quot; encoding! &copy; 2024&lt;/div&gt;'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">HTML Entities Encoder/Decoder</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Mode</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="encode"
                checked={mode === 'encode'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-2"
              />
              <span>Encode</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="decode"
                checked={mode === 'decode'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-2"
              />
              <span>Decode</span>
            </label>
          </div>
        </div>

        {mode === 'encode' && (
          <div>
            <label className="form-label">Encoding Type</label>
            <select
              className="form-input"
              value={encodingType}
              onChange={(e) => setEncodingType(e.target.value)}
            >
              <option value="named">Named entities (recommended)</option>
              <option value="numeric">Numeric entities</option>
              <option value="hex">Hexadecimal entities</option>
              <option value="basic">Basic (& &lt; &gt; &quot; &apos; only)</option>
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={() => setInput(sampleTexts[mode])}
            className="btn-secondary text-sm"
          >
            Load Sample
          </button>
        </div>
      </div>

      <div>
        <label className="form-label">
          {mode === 'encode' ? 'HTML to Encode' : 'HTML Entities to Decode'}
        </label>
        <textarea
          className="form-input font-mono"
          rows="8"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter HTML text to encode...' : 'Enter HTML entities to decode...'}
        />
        <div className="text-xs text-gray-500 mt-1">
          {input.length} characters
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}

      {output && !error && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="form-label mb-0">
              {mode === 'encode' ? 'HTML Encoded' : 'Decoded HTML'}
            </label>
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
            rows="8"
            value={output}
            readOnly
          />
          <div className="text-xs text-gray-500 mt-1">
            {output.length} characters
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Common Named Entities:</h4>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>&amp; → &</div>
              <div>&lt; → &lt;</div>
              <div>&gt; → &gt;</div>
              <div>&quot; → "</div>
              <div>&copy; → ©</div>
              <div>&reg; → ®</div>
              <div>&nbsp; → (space)</div>
              <div>&euro; → €</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Encoding Types:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>Named:</strong> Uses human-readable names (&amp;, &lt;, &copy;)</li>
            <li>• <strong>Numeric:</strong> Uses decimal codes (&#38;, &#60;, &#169;)</li>
            <li>• <strong>Hex:</strong> Uses hexadecimal codes (&#x26;, &#x3C;, &#xA9;)</li>
            <li>• <strong>Basic:</strong> Only encodes essential HTML characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HTMLEntitiesConverter;