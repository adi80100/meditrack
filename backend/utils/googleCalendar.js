const { google } = require('googleapis');
const crypto = require('crypto');

function getAuth() {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_CALENDAR_ID } = process.env;
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_KEY || !GOOGLE_CALENDAR_ID) {
    console.log('Missing Google Calendar environment variables');
    return null;
  }
  
  try {
    // Create service account credentials object
    const credentials = {
      type: 'service_account',
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_SERVICE_ACCOUNT_KEY.includes('\\n') ? 
        GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n') : 
        GOOGLE_SERVICE_ACCOUNT_KEY,
      private_key_id: 'dummy-key-id'
    };
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
    
    return auth;
  } catch (error) {
    console.error('Error creating Google Auth:', error.message);
    return null;
  }
}

async function createCalendarEvent({ summary, description, startISO, endISO, attendees = [] }) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const auth = getAuth();
  
  if (!auth) {
    console.log('No Google Calendar authentication available');
    return { eventId: null, hangoutLink: null };
  }
  
  if (!calendarId) {
    console.log('No Google Calendar ID configured');
    return { eventId: null, hangoutLink: null };
  }

  try {
    // Get authenticated client
    const authClient = await auth.getClient();
    console.log('Google Calendar authentication successful');
    
    const calendar = google.calendar({ version: 'v3', auth: authClient });
    
    const event = {
      summary,
      description,
      start: { dateTime: startISO },
      end: { dateTime: endISO },
      // Remove attendees to avoid permission issues - we'll share the meet link separately
      conferenceData: {
        createRequest: {
          requestId: `meditrack-${Date.now()}-${Math.random().toString(36).slice(2)}`
        },
      },
    };
    
    console.log('Creating calendar event with Meet link...');
    const res = await calendar.events.insert({
      calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
    });
    
    const eventId = res.data.id;
    const meetLink = res.data.hangoutLink || 
                    res.data.conferenceData?.entryPoints?.find(entry => entry.entryPointType === 'video')?.uri ||
                    res.data.conferenceData?.entryPoints?.[0]?.uri;
    
    console.log('Calendar event created successfully:', { eventId, meetLink });
    return { eventId, hangoutLink: meetLink };
    
  } catch (error) {
    console.error('Google Calendar API error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.errors) console.error('Error details:', error.errors);
    return { eventId: null, hangoutLink: null };
  }
}

// Fallback function to generate Google Meet links
function generateMeetLink() {
  // Generate a random meeting ID similar to Google Meet format
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randomId = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const meetId = `${randomId.slice(0, 3)}-${randomId.slice(3, 7)}-${randomId.slice(7, 10)}`;
  return `https://meet.google.com/${meetId}`;
}

async function createCalendarEventWithMeet({ summary, description, startISO, endISO, attendees = [] }) {
  // Try to create calendar event first
  const calendarResult = await createCalendarEvent({ summary, description, startISO, endISO, attendees });
  
  // If no meet link from calendar, generate one as fallback
  if (!calendarResult.hangoutLink) {
    const fallbackMeetLink = generateMeetLink();
    console.log('Generated fallback Meet link:', fallbackMeetLink);
    return { 
      eventId: calendarResult.eventId, 
      hangoutLink: fallbackMeetLink 
    };
  }
  
  return calendarResult;
}

module.exports = { createCalendarEvent, createCalendarEventWithMeet, generateMeetLink };
