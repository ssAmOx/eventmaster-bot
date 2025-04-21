const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const { db } = require('../database/dbInit');

async function updateEventMessage(event, goingCount, notGoingCount) {
  if (!event.message_id) return;

  try {
    const guild = client.guilds.cache.get(event.guild_id);
    if (!guild) return;
    
    const channel = await guild.channels.fetch(event.channel_id);
    if (!channel) return;
    
    const message = await channel.messages.fetch(event.message_id);
    if (!message) return;
    
    const eventDate = moment(event.event_date);
    const isCompleted = eventDate.isBefore(moment());
    
    const eventEmbed = new EmbedBuilder()
      .setColor(isCompleted ? '#95a5a6' : '#3498db')
      .setTitle(`📅 ${event.title}`)
      .setDescription(event.description)
      .addFields(
        { name: 'Date & Time', value: `${eventDate.format('dddd, MMMM D, YYYY')}`, inline: true },
        { name: 'Time', value: `${eventDate.format('h:mm A')} ${event.timezone}`, inline: true },
        { name: 'Created by', value: `<@${event.created_by}>`, inline: true },
        { name: 'Status', value: isCompleted ? '✅ Completed' : '📝 Accepting RSVPs', inline: false },
        { name: 'Responses', value: `${goingCount} Going | ${notGoingCount} Not Going`, inline: false }
      )
      .setFooter({ text: `Event ID: ${event.id}` })
      .setTimestamp();
      
    if (event.image_url) {
      eventEmbed.setImage(event.image_url);
    }
    
    let components = [];
    if (!isCompleted) {
      components = [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`rsvp_yes_${event.id}`)
              .setLabel('✅ Going')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`rsvp_no_${event.id}`)
              .setLabel('❌ Not Going')
              .setStyle(ButtonStyle.Danger)
          )
      ];
    } else {
      components = [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`feedback_${event.id}`)
              .setLabel('📝 Leave Feedback')
              .setStyle(ButtonStyle.Primary)
          )
      ];
      
      if (!event.is_completed) {
        db.run('UPDATE events SET is_completed = 1 WHERE id = ?', [event.id]);
      }
    }
    
    await message.edit({ embeds: [eventEmbed], components });
  } catch (error) {
    console.error('Error updating event message:', error);
  }
}

module.exports = {
  updateEventMessage
};