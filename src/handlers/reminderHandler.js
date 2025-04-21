const cron = require('node-cron');
const moment = require('moment');
const { db } = require('../database/dbInit');
const { sendEventReminder, markEventCompleted } = require('../utils/reminderUtils');

function scheduleReminders(client) {
  cron.schedule('0 * * * *', () => {
    const now = moment();
    
    db.all(
      `SELECT e.*, g.events_channel_id FROM events e
       LEFT JOIN guild_settings g ON e.guild_id = g.guild_id
       WHERE e.is_completed = 0`,
      [],
      (err, events) => {
        if (err) {
          return console.error('Error checking for reminders:', err);
        }
        
        events.forEach(event => {
          const eventDate = moment(event.event_date);
          const hoursDiff = eventDate.diff(now, 'hours');
          
          if (hoursDiff > 23 && hoursDiff < 24) {
            sendEventReminder(event, 24, client);
          } else if (hoursDiff > 0 && hoursDiff < 1) {
            sendEventReminder(event, 1, client);
          } else if (hoursDiff < 0 && !event.is_completed) {
            markEventCompleted(event, client);
          }
        });
      }
    );
  });
}

module.exports = { scheduleReminders };