const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { db } = require('../database/dbInit');
const { updateEventMessage } = require('../utils/eventUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('event-summary')
    .setDescription('Generate summary for an event')
    .addIntegerOption(option => option.setName('event_id').setDescription('Event ID').setRequired(true)),
  
  async execute(interaction) {
    await interaction.deferReply();
    const eventId = interaction.options.getInteger('event_id');

    try {
      db.get('SELECT * FROM events WHERE id = ? AND guild_id = ?', 
        [eventId, interaction.guild.id], 
        async (err, event) => {
          if (err || !event) {
            return interaction.editReply('Event not found or has been deleted.');
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
                return interaction.editReply('Error retrieving event summary.');
              }
              
              const eventDate = moment(event.event_date);
              const isCompleted = eventDate.isBefore(moment());
              
              let feedbackInfo = '';
              if (isCompleted) {
                db.get(
                  `SELECT COUNT(*) as feedback_count, AVG(rating) as avg_rating FROM feedback WHERE event_id = ?`,
                  [eventId],
                  async (err, feedback) => {
                    if (!err && feedback && feedback.feedback_count > 0) {
                      feedbackInfo = `\n\n**Feedback**\nRatings received: ${feedback.feedback_count}\nAverage rating: ${feedback.avg_rating ? feedback.avg_rating.toFixed(1) : 'N/A'}/5`;
                    }
                    
                    await updateEventMessage(event, counts.going_count, counts.not_going_count);
                    
                    const summaryEmbed = new EmbedBuilder()
                      .setColor(isCompleted ? '#95a5a6' : '#3498db')
                      .setTitle(`Event Summary: ${event.title}`)
                      .setDescription(`
**Event Details**
${event.description}

**Time**: ${eventDate.format('dddd, MMMM D, YYYY')} at ${eventDate.format('h:mm A')} ${event.timezone}
**Status**: ${isCompleted ? '✅ Completed' : '📝 Upcoming'}
**RSVPs**: ${counts.going_count} Going | ${counts.not_going_count} Not Going${feedbackInfo}
                      `)
                      .setFooter({ text: `Event ID: ${event.id}` })
                      .setTimestamp();
                      
                    await interaction.editReply({ embeds: [summaryEmbed] });
                  }
                );
              } else {
                await updateEventMessage(event, counts.going_count, counts.not_going_count);
                const summaryEmbed = new EmbedBuilder()
                  .setColor('#3498db')
                  .setTitle(`Event Summary: ${event.title}`)
                  .setDescription(`
**Event Details**
${event.description}

**Time**: ${eventDate.format('dddd, MMMM D, YYYY')} at ${eventDate.format('h:mm A')} ${event.timezone}
**Status**: 📝 Upcoming
**RSVPs**: ${counts.going_count} Going | ${counts.not_going_count} Not Going
                  `)
                  .setFooter({ text: `Event ID: ${event.id}` })
                  .setTimestamp();
                  
                await interaction.editReply({ embeds: [summaryEmbed] });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error('Error generating event summary:', error);
      await interaction.editReply('Failed to generate event summary. Please try again.');
    }
  }
};