const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { db } = require('../database/dbInit');
const { updateEventMessage } = require('./eventUtils');

async function sendEventReminder(event, hoursRemaining, client) {
  db.all(
    'SELECT user_id FROM rsvps WHERE event_id = ? AND status = "yes"',
    [event.id],
    async (err, attendees) => {
      if (err) {
        return console.error('Error fetching attendees for reminder:', err);
      }
      
      const eventDate = moment(event.event_date);
      const guild = client.guilds.cache.get(event.guild_id);
      if (!guild) return;
      
      const attendeeCount = attendees.length;
      const reminderPromises = attendees.map(async ({user_id}) => {
        try {
          const member = await guild.members.fetch(user_id);
          await member.send({
            embeds: [
              new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(`⏰ Event Reminder: ${event.title}`)
                .setDescription(`Your event starts in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}!
**Date & Time**: ${eventDate.format('dddd, MMMM D, YYYY')} at ${eventDate.format('h:mm A')} ${event.timezone}
**Attendees**: ${attendeeCount} going

${event.description}`)
                .setFooter({ text: `Event ID: ${event.id}` })
            ]
          });
        } catch (error) {}
      });
        
      try {
        if (event.channel_id) {
          const channel = await guild.channels.fetch(event.channel_id);
          if (channel) {
            let attendeeMentions = '';
            if (attendeeCount <= 20) {
              attendeeMentions = attendees.map(a => `<@${a.user_id}>`).join(' ');
            }
            
            await channel.send({
              content: attendeeCount > 20 ? '' : `${attendeeMentions}`,
              embeds: [
                new EmbedBuilder()
                  .setColor('#e67e22')
                  .setTitle(`⏰ Reminder: "${event.title}" starts in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}!`)
                  .setDescription(`${attendeeCount} people are attending. See you soon!`)
                  .setFooter({ text: `Event ID: ${event.id}` })
              ]
            });
          }
        }
      } catch (error) {
        console.error('Error sending reminder to channel:', error);
      }
    }
  );
}

async function markEventCompleted(event, client) {
  db.run(
    'UPDATE events SET is_completed = 1 WHERE id = ?',
    [event.id],
    async (err) => {
      if (err) {
        return console.error('Error marking event as completed:', err);
      }
      
      db.get(
        `SELECT 
          COUNT(CASE WHEN status = 'yes' THEN 1 END) as going_count,
          COUNT(CASE WHEN status = 'no' THEN 1 END) as not_going_count
         FROM rsvps WHERE event_id = ?`,
        [event.id],
        async (err, counts) => {
          if (err) {
            return console.error('Error getting RSVP counts:', err);
          }
          
          await updateEventMessage(event, counts.going_count, counts.not_going_count, client);
          
          try {
            const guild = client.guilds.cache.get(event.guild_id);
            if (!guild) return;
            
            const channel = await guild.channels.fetch(event.channel_id);
            if (!channel) return;
            
            await channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor('#2ecc71')
                  .setTitle(`✅ Event Completed: ${event.title}`)
                  .setDescription(`
This event has now finished. Thanks to all ${counts.going_count} participants!

Click the 📝 button on the event post to leave feedback.
                  `)
                  .setFooter({ text: `Event ID: ${event.id}` })
              ]
            });
          } catch (error) {
            console.error('Error sending event completion message:', error);
          }
        }
      );
    }
  );
}

module.exports = {
  sendEventReminder,
  markEventCompleted
};