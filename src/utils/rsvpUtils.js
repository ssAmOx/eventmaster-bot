const moment = require('moment');
const { db } = require('../database/dbInit');
const { updateEventMessage } = require('./eventUtils');

async function handleRSVP(interaction, eventId, status) {
  await interaction.deferReply({ ephemeral: true });

  try {
    db.get('SELECT * FROM events WHERE id = ?', [eventId], async (err, event) => {
      if (err || !event) {
        return interaction.editReply('Event not found or has been deleted.');
      }
      
      const eventDate = moment(event.event_date);
      if (eventDate.isBefore(moment())) {
        return interaction.editReply('This event has already ended and is no longer accepting RSVPs.');
      }
      
      db.run(
        `INSERT INTO rsvps (event_id, user_id, status) VALUES (?, ?, ?)
         ON CONFLICT(event_id, user_id) DO UPDATE SET status = ?, timestamp = CURRENT_TIMESTAMP`,
        [eventId, interaction.user.id, status, status],
        async function(err) {
          if (err) {
            console.error('Database error:', err);
            return interaction.editReply('Error saving your RSVP. Please try again.');
          }
          
          db.get(
            `SELECT 
              COUNT(CASE WHEN status = 'yes' THEN 1 END) as going_count,
              COUNT(CASE WHEN status = 'no' THEN 1 END) as not_going_count
             FROM rsvps WHERE event_id = ?`,
            [eventId],
            async (err, counts) => {
              if (err) {
                console.error('Error getting RSVP counts:', err);
                return interaction.editReply('Your RSVP was recorded, but we encountered an error updating the event display.');
              }
              
              await updateEventMessage(event, counts.going_count, counts.not_going_count);
              await interaction.editReply(
                status === 'yes' ? 
                '✅ You\'re now registered for this event!' : 
                '❌ You\'ve declined this event.'
              );
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Error processing RSVP:', error);
    await interaction.editReply('Failed to process your RSVP. Please try again.');
  }
}

module.exports = {
  handleRSVP
};