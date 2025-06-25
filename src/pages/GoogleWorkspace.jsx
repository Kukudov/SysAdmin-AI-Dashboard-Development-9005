import React, { useState, useEffect } from 'react';
import { useGoogle } from '../contexts/GoogleContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiFolder, FiFileText, FiUpload, FiDownload, FiPlus, FiRefreshCw, FiExternalLink } = FiIcons;

const GoogleWorkspace = () => {
  const { isAuthenticated, authenticate, signOut, getCalendarEvents, createCalendarEvent, uploadToDrive, createSheet, loading } = useGoogle();
  const [activeTab, setActiveTab] = useState('calendar');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
  });

  const [sheetForm, setSheetForm] = useState({
    title: '',
    data: '',
  });

  useEffect(() => {
    if (isAuthenticated && activeTab === 'calendar') {
      loadCalendarEvents();
    }
  }, [isAuthenticated, activeTab]);

  const loadCalendarEvents = async () => {
    setLoadingData(true);
    try {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const events = await getCalendarEvents(now.toISOString(), nextWeek.toISOString());
      setCalendarEvents(events.items || []);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const event = {
        summary: eventForm.title,
        description: eventForm.description,
        location: eventForm.location,
        start: {
          dateTime: new Date(eventForm.start).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(eventForm.end).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      await createCalendarEvent(event);
      setShowEventModal(false);
      setEventForm({ title: '', description: '', start: '', end: '', location: '' });
      loadCalendarEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await uploadToDrive(file);
      console.log('File uploaded:', result);
      // Refresh file list if implemented
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCreateSheet = async (e) => {
    e.preventDefault();
    try {
      const data = sheetForm.data ? sheetForm.data.split('\n').map(row => row.split(',')) : [];
      const sheet = await createSheet(sheetForm.title, data);
      
      setShowSheetModal(false);
      setSheetForm({ title: '', data: '' });
      console.log('Sheet created:', sheet);
    } catch (error) {
      console.error('Error creating sheet:', error);
    }
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: FiCalendar },
    { id: 'drive', label: 'Drive', icon: FiFolder },
    { id: 'sheets', label: 'Sheets', icon: FiFileText },
  ];

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Google Workspace Integration
          </h1>
        </div>

        <div className="card text-center py-12">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiFolder} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Connect to Google Workspace
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Authenticate with Google to access Calendar, Drive, and Sheets integration.
          </p>
          <button
            onClick={authenticate}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Connecting...' : 'Connect Google Account'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Google Workspace
        </h1>
        <button
          onClick={signOut}
          className="btn-secondary"
        >
          Disconnect Google
        </button>
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

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={loadCalendarEvents}
                disabled={loadingData}
                className="btn-secondary flex items-center"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="btn-primary flex items-center"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Create Event
              </button>
            </div>
          </div>

          <div className="card">
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {calendarEvents.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No upcoming events found
                  </p>
                ) : (
                  calendarEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.summary}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                            {new Date(event.start?.dateTime || event.start?.date).toLocaleString()}
                          </div>
                        </div>
                        {event.htmlLink && (
                          <a
                            href={event.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500"
                          >
                            <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drive Tab */}
      {activeTab === 'drive' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              File Upload
            </h2>
          </div>

          <div className="card">
            <div className="text-center py-12">
              <SafeIcon icon={FiUpload} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <label className="btn-primary cursor-pointer">
                <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                Upload File to Drive
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Upload task reports, logs, or documentation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sheets Tab */}
      {activeTab === 'sheets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Spreadsheet Management
            </h2>
            <button
              onClick={() => setShowSheetModal(true)}
              className="btn-primary flex items-center"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create Sheet
            </button>
          </div>

          <div className="card">
            <div className="text-center py-12">
              <SafeIcon icon={FiFileText} className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Export Reports to Sheets
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create spreadsheets for task reports, system metrics, and analysis data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEventModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateEvent}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Create Calendar Event
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Event Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-input"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Start Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={eventForm.start}
                          onChange={(e) => setEventForm({...eventForm, start: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">End Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={eventForm.end}
                          onChange={(e) => setEventForm({...eventForm, end: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary sm:ml-3">
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
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

      {/* Create Sheet Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSheetModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateSheet}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Create Google Sheet
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Sheet Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={sheetForm.title}
                        onChange={(e) => setSheetForm({...sheetForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Initial Data (CSV format)</label>
                      <textarea
                        className="form-input"
                        rows="6"
                        placeholder="Header1,Header2,Header3&#10;Value1,Value2,Value3&#10;Value4,Value5,Value6"
                        value={sheetForm.data}
                        onChange={(e) => setSheetForm({...sheetForm, data: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Optional: Add comma-separated values, one row per line
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn-primary sm:ml-3">
                    Create Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSheetModal(false)}
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
    </div>
  );
};

export default GoogleWorkspace;