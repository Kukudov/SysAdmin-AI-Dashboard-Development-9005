import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as cronParser from 'cron-parser';

const { FiCode, FiCheck, FiX, FiCopy, FiDownload, FiPlay } = FiIcons;

const JSTools = () => {
  const { hasApiKey, generateScript } = useAI();
  const [activeTab, setActiveTab] = useState('json');

  // JSON Validator
  const [jsonInput, setJsonInput] = useState('');
  const [jsonResult, setJsonResult] = useState(null);

  // Regex Tester
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestString, setRegexTestString] = useState('');
  const [regexMatches, setRegexMatches] = useState([]);

  // Cron Expression
  const [cronExpression, setCronExpression] = useState('');
  const [cronResult, setCronResult] = useState(null);

  // Base64
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');

  // SSH Key Generator
  const [sshKeyType, setSshKeyType] = useState('rsa');
  const [sshKeySize, setSshKeySize] = useState('2048');
  const [sshKeys, setSshKeys] = useState(null);

  // AI Script Generator
  const [scriptDescription, setScriptDescription] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [generatingScript, setGeneratingScript] = useState(false);

  const validateJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonResult({
        valid: true,
        formatted: JSON.stringify(parsed, null, 2),
        message: 'Valid JSON'
      });
    } catch (error) {
      setJsonResult({
        valid: false,
        formatted: null,
        message: error.message
      });
    }
  };

  const testRegex = () => {
    try {
      const regex = new RegExp(regexPattern, regexFlags);
      const matches = [...regexTestString.matchAll(regex)];
      setRegexMatches(matches.map((match, index) => ({
        index,
        match: match[0],
        groups: match.slice(1),
        position: match.index
      })));
    } catch (error) {
      setRegexMatches([{ error: error.message }]);
    }
  };

  const parseCronExpression = () => {
    try {
      const interval = cronParser.parseExpression(cronExpression);
      const nextRuns = [];
      for (let i = 0; i < 5; i++) {
        nextRuns.push(interval.next().toString());
      }
      setCronResult({
        valid: true,
        nextRuns,
        description: `Runs ${cronExpression}`
      });
    } catch (error) {
      setCronResult({
        valid: false,
        error: error.message
      });
    }
  };

  const handleBase64 = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (error) {
      setBase64Output(`Error: ${error.message}`);
    }
  };

  const generateSSHKey = () => {
    // Note: Real SSH key generation would require crypto libraries
    // This is a simplified demonstration
    const mockPrivateKey = `-----BEGIN ${sshKeyType.toUpperCase()} PRIVATE KEY-----
MIIEpAIBAAKCAQEA4f6wQ4k8+x8s9GgxXrF5f6sQsK8jKl2mN3oP1qR7sT9uV0wX
yZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7A8B9C0D1E
2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3a4b5c6d7e8f9g0h1i2j3k
4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q
6R7S8T9U0V1W2X3Y4Z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w
8x9y0z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c
-----END ${sshKeyType.toUpperCase()} PRIVATE KEY-----`;

    const mockPublicKey = `ssh-${sshKeyType} AAAAB3NzaC1yc2EAAAADAQABAAABAQC4f6wQ4k8+x8s9GgxXrF5f6sQsK8jKl2mN3oP1qR7sT9uV0wXyZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c user@hostname`;

    setSshKeys({
      private: mockPrivateKey,
      public: mockPublicKey,
      fingerprint: 'SHA256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
    });
  };

  const handleGenerateScript = async () => {
    if (!hasApiKey || !scriptDescription.trim()) return;

    setGeneratingScript(true);
    try {
      const script = await generateScript(scriptDescription);
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      setGeneratedScript(`Error: ${error.message}`);
    } finally {
      setGeneratingScript(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tools = [
    { id: 'json', label: 'JSON Validator', icon: FiCode },
    { id: 'regex', label: 'Regex Tester', icon: FiCheck },
    { id: 'cron', label: 'Cron Expression', icon: FiPlay },
    { id: 'base64', label: 'Base64 Encoder/Decoder', icon: FiCode },
    { id: 'ssh', label: 'SSH Key Generator', icon: FiCode },
    { id: 'ai-script', label: 'AI Script Generator', icon: FiCode },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          JavaScript & DevOps Tools
        </h1>
      </div>

      {/* Tool Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap
                ${activeTab === tool.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <SafeIcon icon={tool.icon} className="w-4 h-4 mr-2" />
              {tool.label}
            </button>
          ))}
        </nav>
      </div>

      {/* JSON Validator */}
      {activeTab === 'json' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                JSON Validator & Formatter
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">JSON Input</label>
                <textarea
                  className="form-input font-mono"
                  rows="8"
                  placeholder='{"key": "value", "array": [1, 2, 3]}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>
              
              <button
                onClick={validateJSON}
                className="btn-primary"
              >
                Validate & Format JSON
              </button>
              
              {jsonResult && (
                <div className={`p-4 rounded-lg ${jsonResult.valid ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                  <div className="flex items-center mb-2">
                    <SafeIcon 
                      icon={jsonResult.valid ? FiCheck : FiX} 
                      className={`w-5 h-5 mr-2 ${jsonResult.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    />
                    <span className={`font-medium ${jsonResult.valid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                      {jsonResult.message}
                    </span>
                  </div>
                  
                  {jsonResult.formatted && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="form-label mb-0">Formatted JSON</label>
                        <button
                          onClick={() => copyToClipboard(jsonResult.formatted)}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language="json"
                        style={tomorrow}
                        className="rounded-lg"
                      >
                        {jsonResult.formatted}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Regex Tester */}
      {activeTab === 'regex' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Regular Expression Tester
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Regex Pattern</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    placeholder="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="form-label">Flags</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    placeholder="g, i, m, s, u, y"
                    value={regexFlags}
                    onChange={(e) => setRegexFlags(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Test String</label>
                <textarea
                  className="form-input font-mono"
                  rows="4"
                  placeholder="Enter text to test against the regex pattern..."
                  value={regexTestString}
                  onChange={(e) => setRegexTestString(e.target.value)}
                />
              </div>
              
              <button
                onClick={testRegex}
                disabled={!regexPattern || !regexTestString}
                className="btn-primary"
              >
                Test Regex
              </button>
              
              {regexMatches.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Matches ({regexMatches.length})
                  </h4>
                  
                  {regexMatches[0].error ? (
                    <div className="text-red-600 dark:text-red-400">
                      Error: {regexMatches[0].error}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {regexMatches.map((match, index) => (
                        <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded border">
                          <div className="font-mono text-sm">
                            <span className="text-blue-600 dark:text-blue-400">Match {index + 1}:</span> {match.match}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Position: {match.position}
                            {match.groups.length > 0 && (
                              <span> | Groups: {match.groups.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cron Expression */}
      {activeTab === 'cron' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Cron Expression Parser
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Cron Expression</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="0 0 * * *"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: second minute hour day month dayOfWeek
                </p>
              </div>
              
              <button
                onClick={parseCronExpression}
                disabled={!cronExpression}
                className="btn-primary"
              >
                Parse Expression
              </button>
              
              {cronResult && (
                <div className={`p-4 rounded-lg ${cronResult.valid ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                  {cronResult.valid ? (
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                        {cronResult.description}
                      </h4>
                      <div>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                          Next 5 executions:
                        </p>
                        <div className="space-y-1">
                          {cronResult.nextRuns.map((run, index) => (
                            <div key={index} className="font-mono text-sm text-green-600 dark:text-green-400">
                              {run}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-800 dark:text-red-200">
                      Error: {cronResult.error}
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Common Examples:
                </h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <div><code>0 0 * * *</code> - Daily at midnight</div>
                  <div><code>0 */6 * * *</code> - Every 6 hours</div>
                  <div><code>0 9 * * 1</code> - Every Monday at 9 AM</div>
                  <div><code>0 0 1 * *</code> - First day of every month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base64 */}
      {activeTab === 'base64' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Base64 Encoder/Decoder
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Mode</label>
                <select
                  className="form-input"
                  value={base64Mode}
                  onChange={(e) => setBase64Mode(e.target.value)}
                >
                  <option value="encode">Encode to Base64</option>
                  <option value="decode">Decode from Base64</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Input</label>
                <textarea
                  className="form-input font-mono"
                  rows="4"
                  placeholder={base64Mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleBase64}
                disabled={!base64Input}
                className="btn-primary"
              >
                {base64Mode === 'encode' ? 'Encode' : 'Decode'}
              </button>
              
              {base64Output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="form-label mb-0">Output</label>
                    <button
                      onClick={() => copyToClipboard(base64Output)}
                      className="btn-secondary text-xs"
                    >
                      <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                      Copy
                    </button>
                  </div>
                  <textarea
                    className="form-input font-mono"
                    rows="4"
                    value={base64Output}
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SSH Key Generator */}
      {activeTab === 'ssh' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                SSH Key Generator (Demo)
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Key Type</label>
                  <select
                    className="form-input"
                    value={sshKeyType}
                    onChange={(e) => setSshKeyType(e.target.value)}
                  >
                    <option value="rsa">RSA</option>
                    <option value="ed25519">Ed25519</option>
                    <option value="ecdsa">ECDSA</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Key Size</label>
                  <select
                    className="form-input"
                    value={sshKeySize}
                    onChange={(e) => setSshKeySize(e.target.value)}
                    disabled={sshKeyType === 'ed25519'}
                  >
                    <option value="2048">2048 bits</option>
                    <option value="3072">3072 bits</option>
                    <option value="4096">4096 bits</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={generateSSHKey}
                className="btn-primary"
              >
                Generate SSH Key Pair (Demo)
              </button>
              
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> This is a demo generator. In production, use proper cryptographic libraries 
                  and never generate real keys in a web browser for security reasons.
                </p>
              </div>
              
              {sshKeys && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="form-label mb-0">Private Key</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(sshKeys.private)}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadFile(sshKeys.private, 'id_rsa')}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiDownload} className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    <textarea
                      className="form-input font-mono text-xs"
                      rows="8"
                      value={sshKeys.private}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="form-label mb-0">Public Key</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(sshKeys.public)}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadFile(sshKeys.public, 'id_rsa.pub')}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiDownload} className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    <textarea
                      className="form-input font-mono text-xs"
                      rows="3"
                      value={sshKeys.public}
                      readOnly
                    />
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Fingerprint:</strong> <code className="text-xs">{sshKeys.fingerprint}</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Script Generator */}
      {activeTab === 'ai-script' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                AI Script Generator
              </h3>
            </div>
            
            {!hasApiKey ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure your OpenRouter API key to use the AI Script Generator.
                </p>
                <button className="btn-primary">
                  Go to AI Assistant Settings
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="form-label">Script Description</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Describe the script you want to generate. For example: 'Create a bash script to monitor disk usage and send email alerts when usage exceeds 80%'"
                    value={scriptDescription}
                    onChange={(e) => setScriptDescription(e.target.value)}
                  />
                </div>
                
                <button
                  onClick={handleGenerateScript}
                  disabled={!scriptDescription.trim() || generatingScript}
                  className="btn-primary"
                >
                  {generatingScript ? 'Generating Script...' : 'Generate Script'}
                </button>
                
                {generatedScript && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="form-label mb-0">Generated Script</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(generatedScript)}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadFile(generatedScript, 'generated-script.sh')}
                          className="btn-secondary text-xs"
                        >
                          <SafeIcon icon={FiDownload} className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <SyntaxHighlighter
                        language="bash"
                        style={tomorrow}
                        className="rounded-lg"
                      >
                        {generatedScript}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Example Prompts:
                  </h4>
                  <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <div>• "Create a Python script to backup MySQL databases"</div>
                    <div>• "Generate a bash script for log rotation and cleanup"</div>
                    <div>• "Write a monitoring script for server health checks"</div>
                    <div>• "Create a deployment script with rollback functionality"</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JSTools;