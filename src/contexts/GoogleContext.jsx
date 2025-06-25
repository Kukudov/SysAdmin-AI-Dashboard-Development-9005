import React, { createContext, useContext, useState, useCallback } from 'react';
import { googleAPI } from '../lib/google';

const GoogleContext = createContext({});

export const useGoogle = () => {
  const context = useContext(GoogleContext);
  if (!context) {
    throw new Error('useGoogle must be used within a GoogleProvider');
  }
  return context;
};

export const GoogleProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const authenticate = useCallback(async () => {
    setLoading(true);
    try {
      const token = await googleAPI.authenticate();
      setAccessToken(token);
      setIsAuthenticated(true);
      return token;
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await googleAPI.signOut();
      setAccessToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Google sign out failed:', error);
      throw error;
    }
  }, []);

  const getCalendarEvents = useCallback(async (timeMin, timeMax) => {
    if (!accessToken) throw new Error('Not authenticated with Google');
    
    try {
      return await googleAPI.calendar.getEvents(accessToken, timeMin, timeMax);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw error;
    }
  }, [accessToken]);

  const createCalendarEvent = useCallback(async (event) => {
    if (!accessToken) throw new Error('Not authenticated with Google');
    
    try {
      return await googleAPI.calendar.createEvent(accessToken, event);
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw error;
    }
  }, [accessToken]);

  const uploadToDrive = useCallback(async (file, folderId = null) => {
    if (!accessToken) throw new Error('Not authenticated with Google');
    
    try {
      return await googleAPI.drive.uploadFile(accessToken, file, folderId);
    } catch (error) {
      console.error('Failed to upload to Drive:', error);
      throw error;
    }
  }, [accessToken]);

  const createSheet = useCallback(async (title, data) => {
    if (!accessToken) throw new Error('Not authenticated with Google');
    
    try {
      return await googleAPI.sheets.create(accessToken, title, data);
    } catch (error) {
      console.error('Failed to create sheet:', error);
      throw error;
    }
  }, [accessToken]);

  const value = {
    isAuthenticated,
    accessToken,
    loading,
    authenticate,
    signOut,
    getCalendarEvents,
    createCalendarEvent,
    uploadToDrive,
    createSheet,
  };

  return (
    <GoogleContext.Provider value={value}>
      {children}
    </GoogleContext.Provider>
  );
};