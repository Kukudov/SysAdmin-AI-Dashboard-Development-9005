import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, FiCheckSquare, FiHardDrive, FiShield, 
  FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiClock 
} = FiIcons;

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, online: 0 },
    tasks: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    backups: { total: 0, successful: 0, failed: 0, warnings: 0 },
    vulnerabilities: { total: 0, critical: 0, high: 0, resolved: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersResult, tasksResult, backupsResult, vulnsResult] = await Promise.all([
        dbHelpers.getUsers(),
        dbHelpers.getTasks(),
        dbHelpers.getBackups(),
        dbHelpers.getVulnerabilities(),
      ]);

      // Process users
      const users = usersResult.data || [];
      const onlineUsers = users.filter(user => {
        const lastSeen = new Date(user.last_seen);
        const now = new Date();
        return (now - lastSeen) < 15 * 60 * 1000; // 15 minutes
      });

      // Process tasks
      const tasks = tasksResult.data || [];
      const taskStats = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});

      // Process backups
      const backups = backupsResult.data || [];
      const backupStats = backups.reduce((acc, backup) => {
        acc[backup.status] = (acc[backup.status] || 0) + 1;
        return acc;
      }, {});

      // Process vulnerabilities
      const vulnerabilities = vulnsResult.data || [];
      const vulnStats = vulnerabilities.reduce((acc, vuln) => {
        if (vuln.severity === 'critical') acc.critical++;
        else if (vuln.severity === 'high') acc.high++;
        if (vuln.status === 'resolved') acc.resolved++;
        return acc;
      }, { critical: 0, high: 0, resolved: 0 });

      setStats({
        users: {
          total: users.length,
          online: onlineUsers.length,
        },
        tasks: {
          total: tasks.length,
          pending: taskStats.pending || 0,
          inProgress: taskStats['in-progress'] || 0,
          completed: taskStats.completed || 0,
        },
        backups: {
          total: backups.length,
          successful: backupStats.success || 0,
          failed: backupStats.failed || 0,
          warnings: backupStats.warning || 0,
        },
        vulnerabilities: {
          total: vulnerabilities.length,
          critical: vulnStats.critical,
          high: vulnStats.high,
          resolved: vulnStats.resolved,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
    };

    return (
      <div className="card">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <SafeIcon icon={icon} className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

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
          Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {profile?.full_name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.online} online`}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Active Tasks"
          value={stats.tasks.total}
          subtitle={`${stats.tasks.pending} pending`}
          icon={FiCheckSquare}
          color="green"
        />
        <StatCard
          title="Backup Health"
          value={`${stats.backups.successful}/${stats.backups.total}`}
          subtitle={stats.backups.failed > 0 ? `${stats.backups.failed} failed` : 'All good'}
          icon={FiHardDrive}
          color={stats.backups.failed > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Vulnerabilities"
          value={stats.vulnerabilities.total}
          subtitle={`${stats.vulnerabilities.critical} critical`}
          icon={FiShield}
          color={stats.vulnerabilities.critical > 0 ? 'red' : 'yellow'}
        />
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Task Status Overview
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.tasks.pending}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.tasks.inProgress}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.tasks.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Security Status
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Critical Vulnerabilities</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.vulnerabilities.critical}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">High Severity</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.vulnerabilities.high}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.vulnerabilities.resolved}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">
            Create New Task
          </button>
          <button className="btn-secondary">
            Run Backup Check
          </button>
          <button className="btn-secondary">
            Security Scan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;