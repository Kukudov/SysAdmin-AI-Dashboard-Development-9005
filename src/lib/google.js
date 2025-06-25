const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

let gapi;
let google;

export const googleAPI = {
  async init() {
    if (typeof window !== 'undefined' && !gapi) {
      // Load Google APIs
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });

      gapi = window.gapi;
      await gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES
        });
      });
    }
  },

  async authenticate() {
    await this.init();
    const authInstance = gapi.auth2.getAuthInstance();
    const user = await authInstance.signIn();
    return user.getAuthResponse().access_token;
  },

  async signOut() {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  },

  calendar: {
    async getEvents(accessToken, timeMin, timeMax) {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      return await response.json();
    },

    async createEvent(accessToken, event) {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
      return await response.json();
    },
  },

  drive: {
    async uploadFile(accessToken, file, folderId = null) {
      const metadata = {
        name: file.name,
        parents: folderId ? [folderId] : undefined,
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: form,
        }
      );
      return await response.json();
    },

    async listFiles(accessToken, query = '') {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      return await response.json();
    },
  },

  sheets: {
    async create(accessToken, title, data = []) {
      // Create spreadsheet
      const createResponse = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              title: title,
            },
          }),
        }
      );

      const spreadsheet = await createResponse.json();

      // Add data if provided
      if (data.length > 0) {
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.spreadsheetId}/values/A1:append?valueInputOption=RAW`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: data,
            }),
          }
        );
      }

      return spreadsheet;
    },

    async updateValues(accessToken, spreadsheetId, range, values) {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values,
          }),
        }
      );
      return await response.json();
    },
  },
};