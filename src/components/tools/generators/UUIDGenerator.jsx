import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { v4 as uuidv4, v5 as uuidv5, v1 as uuidv1 } from 'uuid';

const { FiCopy, FiRefreshCw } = FiIcons;

function UUIDGenerator() {
  const [uuids, setUuids] = useState({
    v1: '',
    v4: '',
    v5: ''
  });
  const [count, setCount] = useState(1);
  const [namespace, setNamespace] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
  const [name, setName] = useState('example.com');
  const [bulkUUIDs, setBulkUUIDs] = useState([]);

  const generateUUIDs = () => {
    setUuids({
      v1: uuidv1(),
      v4: uuidv4(),
      v5: uuidv5(name, namespace)
    });
  };

  const generateBulkUUIDs = () => {
    const bulk = [];
    for (let i = 0; i < count; i++) {
      bulk.push(uuidv4());
    }
    setBulkUUIDs(bulk);
  };

  const copyAllUUIDs = () => {
    const allUUIDs = Object.entries(uuids)
      .map(([version, uuid]) => `${version.toUpperCase()}: ${uuid}`)
      .join('\n');
    navigator.clipboard.writeText(allUUIDs);
  };

  const copyBulkUUIDs = () => {
    navigator.clipboard.writeText(bulkUUIDs.join('\n'));
  };

  const downloadBulkUUIDs = () => {
    const blob = new Blob([bulkUUIDs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${count}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    generateUUIDs();
  }, [name, namespace]);

  React.useEffect(() => {
    if (count > 0) {
      generateBulkUUIDs();
    }
  }, [count]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">UUID Generator</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single UUIDs */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">UUID Versions</h4>
          
          <div className="space-y-4">
            {/* UUID v1 */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">UUID v1 (Time-based)</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Based on timestamp and MAC address</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(uuids.v1)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <SafeIcon icon={FiCopy} className="w-3 h-3" />
                </button>
              </div>
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded border break-all">
                {uuids.v1}
              </div>
            </div>

            {/* UUID v4 */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">UUID v4 (Random)</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Randomly generated (recommended)</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(uuids.v4)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <SafeIcon icon={FiCopy} className="w-3 h-3" />
                </button>
              </div>
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded border break-all">
                {uuids.v4}
              </div>
            </div>

            {/* UUID v5 */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">UUID v5 (Name-based SHA-1)</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Based on namespace and name</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(uuids.v5)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <SafeIcon icon={FiCopy} className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2 mb-3">
                <div>
                  <label className="form-label text-xs">Namespace UUID</label>
                  <input
                    type="text"
                    className="form-input text-xs font-mono"
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    placeholder="6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Name</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="example.com"
                  />
                </div>
              </div>
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded border break-all">
                {uuids.v5}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button onClick={generateUUIDs} className="btn-primary flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Generate New
            </button>
            <button onClick={copyAllUUIDs} className="btn-secondary flex items-center">
              <SafeIcon icon={FiCopy} className="w-4 h-4 mr-2" />
              Copy All
            </button>
          </div>
        </div>

        {/* Bulk Generation */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">Bulk Generation</h4>
          
          <div>
            <label className="form-label">Number of UUIDs: {count}</label>
            <input
              type="range"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>1000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">Generated UUIDs ({bulkUUIDs.length})</label>
              <div className="flex space-x-2">
                <button
                  onClick={copyBulkUUIDs}
                  className="btn-secondary text-xs"
                  disabled={bulkUUIDs.length === 0}
                >
                  <SafeIcon icon={FiCopy} className="w-3 h-3 mr-1" />
                  Copy
                </button>
                <button
                  onClick={downloadBulkUUIDs}
                  className="btn-secondary text-xs"
                  disabled={bulkUUIDs.length === 0}
                >
                  Download
                </button>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 border rounded-lg p-3 max-h-64 overflow-y-auto">
              {bulkUUIDs.length > 0 ? (
                <div className="font-mono text-sm space-y-1">
                  {bulkUUIDs.map((uuid, index) => (
                    <div key={index} className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded">
                      <span className="break-all">{uuid}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(uuid)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        <SafeIcon icon={FiCopy} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No UUIDs generated</p>
              )}
            </div>
          </div>

          <button onClick={generateBulkUUIDs} className="btn-primary w-full flex items-center justify-center">
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Generate {count} UUID{count !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">UUID Versions Explained:</h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <div><strong>Version 1:</strong> Time-based, includes timestamp and MAC address. Can reveal information about when and where it was generated.</div>
          <div><strong>Version 4:</strong> Random/pseudo-random. Most commonly used, provides good uniqueness without revealing information.</div>
          <div><strong>Version 5:</strong> Name-based using SHA-1. Deterministic - same namespace and name always produce the same UUID.</div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Common Use Cases:</h4>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>• Database primary keys and unique identifiers</li>
          <li>• API request/response correlation IDs</li>
          <li>• File and document naming</li>
          <li>• Session identifiers</li>
          <li>• Distributed system node identification</li>
          <li>• Message queue correlation IDs</li>
        </ul>
      </div>
    </div>
  );
}

export default UUIDGenerator;