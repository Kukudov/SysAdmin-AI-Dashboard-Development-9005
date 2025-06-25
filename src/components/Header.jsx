import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSun, FiMoon, FiUser, FiLogOut, FiBell } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SafeIcon icon={FiMenu} className="w-6 h-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              SysAdmin AI Ops Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <SafeIcon icon={FiBell} className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {profile?.role || 'User'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;