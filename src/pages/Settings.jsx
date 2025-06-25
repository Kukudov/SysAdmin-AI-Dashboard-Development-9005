import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { useTheme } from '../contexts/ThemeContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiKey, FiSettings, FiMoon, FiSun, FiSave, FiEye, FiEyeOff } = FiIcons;

const Settings = () => {
  const { user, profile, updateProfile } = useAuth();
  const { apiKey, saveApiKey } = useAI();
  const { isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
  });

  // API settings form
  const [apiForm, setApiForm] = useState({
    openrouter_key: apiKey || '',
    google_client_id: '',
    google_api_key: '',
  });

  // System settings form
  const [systemForm, setSystemForm] = useState({
    backup_check_interval: '24',
    notification_email: '',
    auto_refresh: true,
    default_ai_model: 'meta-llama/llama-3.1-8b-instruct:free',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await updateProfile({
        full_name: profileForm.full_name,
      });

      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApiSettingsUpdate = (e) => {
    e.preventDefault();
    saveApiKey(apiForm.openrouter_key);
    setMessage('API settings saved successfully!');
  };

  const handleSystemSettingsUpdate = (e) => {
    e.preventDefault();
    // Save system settings to localStorage or backend
    localStorage.setItem('system_settings', JSON.stringify(systemForm));
    setMessage('System settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'api', label: 'API Keys', icon: FiKey },
    { id: 'system', label: 'System', icon: FiSettings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
          {message}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile Information
              </h3>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileForm.email}
                  disabled
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
              
              <div>
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile?.role || 'N/A'}
                  disabled
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Role is managed by administrators
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                API Configuration
              </h3>
            </div>
            
            <form onSubmit={handleApiSettingsUpdate} className="space-y-6">
              <div>
                <label className="form-label">OpenRouter API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Enter your OpenRouter API key"
                    value={apiForm.openrouter_key}
                    onChange={(e) => setApiForm({...apiForm, openrouter_key: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <SafeIcon 
                      icon={showApiKey ? FiEyeOff : FiEye} 
                      className="h-4 w-4 text-gray-400" 
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Get your API key from{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>

              <div>
                <label className="form-label">Google Client ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Google OAuth Client ID"
                  value={apiForm.google_client_id}
                  onChange={(e) => setApiForm({...apiForm, google_client_id: e.target.value})}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Required for Google Workspace integration
                </p>
              </div>

              <div>
                <label className="form-label">Google API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Google API Key"
                  value={apiForm.google_api_key}
                  onChange={(e) => setApiForm({...apiForm, google_api_key: e.target.value})}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Required for Google APIs access
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  Save API Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                System Configuration
              </h3>
            </div>
            
            <form onSubmit={handleSystemSettingsUpdate} className="space-y-6">
              <div>
                <label className="form-label">Theme</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn-secondary flex items-center"
                  >
                    <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-4 h-4 mr-2" />
                    {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {isDark ? 'Dark' : 'Light'} Mode
                  </span>
                </div>
              </div>

              <div>
                <label className="form-label">Backup Check Interval (hours)</label>
                <select
                  className="form-input"
                  value={systemForm.backup_check_interval}
                  onChange={(e) => setSystemForm({...systemForm, backup_check_interval: e.target.value})}
                >
                  <option value="6">Every 6 hours</option>
                  <option value="12">Every 12 hours</option>
                  <option value="24">Daily</option>
                  <option value="168">Weekly</option>
                </select>
              </div>

              <div>
                <label className="form-label">Notification Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@company.com"
                  value={systemForm.notification_email}
                  onChange={(e) => setSystemForm({...systemForm, notification_email: e.target.value})}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email for system alerts and notifications
                </p>
              </div>

              <div>
                <label className="form-label">Default AI Model</label>
                <select
                  className="form-input"
                  value={systemForm.default_ai_model}
                  onChange={(e) => setSystemForm({...systemForm, default_ai_model: e.target.value})}
                >
                  <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Free)</option>
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="openai/gpt-4">GPT-4</option>
                  <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_refresh"
                  checked={systemForm.auto_refresh}
                  onChange={(e) => setSystemForm({...systemForm, auto_refresh: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="auto_refresh" className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-refresh dashboard data every 5 minutes
                </label>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  Save System Settings
                </button>
              </div>
            </form>
          </div>

          {/* System Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                System Information
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</p>
                  <p className="text-sm text-gray-900 dark:text-white">1.0.0</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{user?.id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Session Started</p>
                  <p className="text-sm text-gray-900 dark:text-white">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;