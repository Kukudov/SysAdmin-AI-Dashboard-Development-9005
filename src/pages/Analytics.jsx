import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiPieChart,
  FiBarChart3,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiFilter,
  FiAlertTriangle,
  FiCheckCircle,
  FiCheckSquare,
  FiClock,
  FiUsers,
  FiServer,
  FiShield
} = FiIcons;

const Analytics = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // days
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    tasks: [],
    users: [],
    backups: [],
    vulnerabilities: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [tasksResult, usersResult, backupsResult, vulnsResult] = await Promise.all([
        dbHelpers.getTasks(),
        dbHelpers.getUsers(),
        dbHelpers.getBackups(),
        dbHelpers.getVulnerabilities()
      ]);

      setData({
        tasks: tasksResult.data || [],
        users: usersResult.data || [],
        backups: backupsResult.data || [],
        vulnerabilities: vulnsResult.data || []
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data
  const analytics = useMemo(() => {
    const taskStats = {
      total: data.tasks.length,
      completed: data.tasks.filter(t => t.status === 'completed').length,
      pending: data.tasks.filter(t => t.status === 'pending').length,
      inProgress: data.tasks.filter(t => t.status === 'in-progress').length
    };

    const backupStats = {
      total: data.backups.length,
      successful: data.backups.filter(b => b.status === 'success').length,
      failed: data.backups.filter(b => b.status === 'failed').length,
      warnings: data.backups.filter(b => b.status === 'warning').length
    };

    const vulnStats = {
      total: data.vulnerabilities.length,
      critical: data.vulnerabilities.filter(v => v.severity === 'critical').length,
      high: data.vulnerabilities.filter(v => v.severity === 'high').length,
      resolved: data.vulnerabilities.filter(v => v.status === 'resolved').length
    };

    const userStats = {
      total: data.users.length,
      managers: data.users.filter(u => u.role === 'manager').length,
      workers: data.users.filter(u => u.role === 'worker').length,
      active: data.users.filter(u => {
        const lastSeen = new Date(u.last_seen);
        const now = new Date();
        return (now - lastSeen) < 24 * 60 * 60 * 1000; // Active in last 24 hours
      }).length
    };

    return { taskStats, backupStats, vulnStats, userStats };
  }, [data]);

  const exportData = () => {
    const exportData = {
      generated_at: new Date().toISOString(),
      date_range: `${dateRange} days`,
      analytics,
      raw_data: data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'tasks', label: 'Task Analytics', icon: FiBarChart3 },
    { id: 'security', label: 'Security Analytics', icon: FiShield },
    { id: 'users', label: 'User Analytics', icon: FiUsers }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Advanced Analytics
        </h1>
        <div className="flex items-center space-x-4">
          <select
            className="form-input"
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="btn-secondary flex items-center"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="btn-primary flex items-center"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <SafeIcon icon={FiCheckSquare} className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.taskStats.total}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {analytics.taskStats.completed} completed
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500">
                  <SafeIcon icon={FiServer} className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.backupStats.total}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Backups
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {analytics.backupStats.successful} successful
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-500">
                  <SafeIcon icon={FiShield} className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.vulnStats.total}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Vulnerabilities
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {analytics.vulnStats.critical} critical
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500">
                  <SafeIcon icon={FiUsers} className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.userStats.total}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {analytics.userStats.active} active
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  System Health Overview
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Task Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.taskStats.total > 0 ? Math.round((analytics.taskStats.completed / analytics.taskStats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Backup Success Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.backupStats.total > 0 ? Math.round((analytics.backupStats.successful / analytics.backupStats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vulnerability Resolution</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.vulnStats.total > 0 ? Math.round((analytics.vulnStats.resolved / analytics.vulnStats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User Activity Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.userStats.total > 0 ? Math.round((analytics.userStats.active / analytics.userStats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiActivity} className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    System monitoring active
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Latest backup successful
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiShield} className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Security scan completed
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiUsers} className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {analytics.userStats.active} users active today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Analytics Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Task Status Distribution
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.taskStats.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.taskStats.inProgress}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.taskStats.completed}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Task Performance
                </h3>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {analytics.taskStats.total > 0 ? Math.round((analytics.taskStats.completed / analytics.taskStats.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Analytics Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Vulnerability Severity
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.vulnStats.critical}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.vulnStats.high}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.vulnStats.resolved}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Security Score
                </h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {analytics.vulnStats.total > 0 ? Math.round((analytics.vulnStats.resolved / analytics.vulnStats.total) * 100) : 100}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Analytics Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  User Distribution
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Managers</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.userStats.managers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Workers</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.userStats.workers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Today</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.userStats.active}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Activity Rate
                </h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.userStats.total > 0 ? Math.round((analytics.userStats.active / analytics.userStats.total) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users Active Today</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;