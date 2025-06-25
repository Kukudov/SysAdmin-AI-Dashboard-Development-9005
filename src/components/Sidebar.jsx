import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiCheckSquare, FiMessageSquare, FiMic, FiHardDrive, FiShield, FiGrid, FiTool, FiSettings, FiX, FiBarChart, FiAlertTriangle } = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const { isManager } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart },
    { name: 'Task Management', href: '/tasks', icon: FiCheckSquare },
    { name: 'AI Assistant', href: '/ai-assistant', icon: FiMessageSquare },
    { name: 'Voice Tools', href: '/voice-tools', icon: FiMic },
    { name: 'Backup Tracker', href: '/backups', icon: FiHardDrive },
    { name: 'Vulnerabilities', href: '/vulnerabilities', icon: FiShield },
    { name: 'Google Workspace', href: '/google-workspace', icon: FiGrid },
    { name: 'JS Tools', href: '/js-tools', icon: FiTool },
  ];

  // Add User Management only for managers
  if (isManager) {
    navigationItems.splice(2, 0, { name: 'User Management', href: '/users', icon: FiUsers });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            SysAdmin AI
          </span>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `
                }
              >
                <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `
              }
            >
              <SafeIcon icon={FiSettings} className="w-5 h-5 mr-3" />
              Settings
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;