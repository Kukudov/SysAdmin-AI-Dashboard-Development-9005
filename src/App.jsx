import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIProvider } from './contexts/AIContext';
import { GoogleProvider } from './contexts/GoogleContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TaskManagement from './pages/TaskManagement';
import AIAssistant from './pages/AIAssistant';
import VoiceTools from './pages/VoiceTools';
import BackupTracker from './pages/BackupTracker';
import VulnerabilityManagement from './pages/VulnerabilityManagement';
import GoogleWorkspace from './pages/GoogleWorkspace';
import JSTools from './pages/JSTools';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
          <GoogleProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="tasks" element={<TaskManagement />} />
                    <Route path="ai-assistant" element={<AIAssistant />} />
                    <Route path="voice-tools" element={<VoiceTools />} />
                    <Route path="backups" element={<BackupTracker />} />
                    <Route path="vulnerabilities" element={<VulnerabilityManagement />} />
                    <Route path="google-workspace" element={<GoogleWorkspace />} />
                    <Route path="js-tools" element={<JSTools />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </GoogleProvider>
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;