import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAI } from '../contexts/AIContext';
import { dbHelpers } from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiDownload, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiXCircle, FiCalendar, FiServer } = FiIcons;

const BackupTracker = () => {
  const { hasApiKey, analyzeLog } = useAI();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzingLog, setAnalyzingLog] = useState(false);
  const [formData, setFormData] = useState({
    server_name: '',
    status: 'success',
    report: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const { data, error } = await dbHelpers.getBackups();
      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await dbHelpers.createBackup(formData);
      if (error) throw error;
      
      await fetchBackups();
      setShowModal(false);
      setFormData({
        server_name: '',
        status: 'success',
        report: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  const handleLogUpload = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const logContent = e.target.result;
      setFormData(prev => ({
        ...prev,
        report: logContent,
        server_name: prev.server_name || file.name.split('.')[0],
      }));

      if (hasApiKey) {
        setAnalyzingLog(true);
        try {
          const analysis = await analyzeLog(logContent);
          setAiAnalysis(analysis);
        } catch (error) {
          console.error('Error analyzing log:', error);
        } finally {
          setAnalyzingLog(false);
        }
      }
    };
    reader.readAsText(file);
  }, [hasApiKey, analyzeLog]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleLogUpload,
    accept: {
      'text/plain': ['.txt', '.log'],
    },
    multiple: false,
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <SafeIcon icon={FiXCircle} className="w-5 h-5 text-red-600" />;
      default:
        return <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const generateHealthReport = () => {
    const total = backups.length;
    const successful = backups.filter(b => b.status === 'success').length;
    const warnings = backups.filter(b => b.status === 'warning').length;
    const failed = backups.filter(b => b.status === 'failed').length;
    
    const successRate = total > 0 ? (successful / total * 100).toFixed(1) : 0;

    return {
      total,
      successful,
      warnings,
      failed,
      successRate,
    };
  };

  const healthReport = generateHealthReport();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Backup Tracker
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchBackups}
            className="btn-secondary flex items-center"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center"
          >
            <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
            Add Backup
          </button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <SafeIcon icon={FiServer} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {healthReport.total}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Backups
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {healthReport.successful}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Successful
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {healthReport.warnings}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Warnings
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <SafeIcon icon={FiXCircle} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {healthReport.failed}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Failed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Backup Success Rate
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {healthReport.successRate}%
            </p>
          </div>
          <div className="w-32 h-32">
            <div className="relative w-full h-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${healthReport.successRate * 2.51} 251`}
                  className="text-primary-600"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Backups List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Backups
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Server
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {backups.map((backup) => (
                  <tr key={backup.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(backup.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {backup.server_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        {new Date(backup.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedBackup(backup)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Backup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Add Backup Report
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Server Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.server_name}
                          onChange={(e) => setFormData({...formData, server_name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Status</label>
                        <select
                          className="form-input"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="success">Success</option>
                          <option value="warning">Warning</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Timestamp</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={formData.timestamp}
                        onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Backup Log/Report</label>
                      <div
                        {...getRootProps()}
                        className={`
                          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                          ${isDragActive 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                          }
                        `}
                      >
                        <input {...getInputProps()} />
                        <SafeIcon icon={FiUpload} className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isDragActive
                            ? 'Drop the log file here...'
                            : 'Drag & drop a log file here, or click to select'
                          }
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Supports .txt, .log files
                        </p>
                      </div>
                      
                      <textarea
                        className="form-input mt-2"
                        rows="6"
                        placeholder="Or paste backup log content here..."
                        value={formData.report}
                        onChange={(e) => setFormData({...formData, report: e.target.value})}
                      />
                    </div>

                    {analyzingLog && (
                      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Analyzing log with AI...
                        </p>
                      </div>
                    )}

                    {aiAnalysis && (
                      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                          AI Analysis Results:
                        </h4>
                        <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                          {aiAnalysis}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary sm:ml-3">
                    Save Backup
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backup Details Modal */}
      {selectedBackup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedBackup(null)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Backup Details - {selectedBackup.server_name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedBackup.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBackup.status)}`}>
                      {selectedBackup.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Timestamp: {new Date(selectedBackup.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="form-label">Backup Report</label>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                        {selectedBackup.report}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setSelectedBackup(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupTracker;