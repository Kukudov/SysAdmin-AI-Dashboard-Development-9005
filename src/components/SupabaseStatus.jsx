import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle } = FiIcons;

const SupabaseStatus = () => {
  return (
    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
        <span className="text-sm font-medium text-green-800 dark:text-green-200">
          Supabase Connected Successfully
        </span>
        <span className="text-xs text-green-600 dark:text-green-400 ml-2">
          (Project: zpxwdhsjupkmxzedphjf)
        </span>
      </div>
    </div>
  );
};

export default SupabaseStatus;