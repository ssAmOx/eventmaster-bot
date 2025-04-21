const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { db } = require('../database/dbInit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('events-calendar')
    .setDescription('View upcoming events')
    .addStringOption(option => 
      option.setName('period')
        .setDescription('Calendar period')
        .setRequired(true)
        .addChoices(
          { name: 'Week', value: 'week' },
          { name: 'Month', value: 'month' }
        )
    ),
  
  async execute(interaction) {
    await interaction.deferReply();
    const period = interaction.options.getString('period');
    const now = moment();
    let endDate = period === 'week' ? moment().add(7, 'days') : moment().add(30, 'days');

    try {
      db.all(
        `SELECT * FROM events 
         WHERE guild_id = ? AND event_date > ? AND event_date < ? 
         ORDER BY event_date ASC`,
        [interaction.guild.id, now.toISOString(), endDate.toISOString()],
        async (err, events) => {
          if (err) {
            console.error('Error retrieving events:', err);
            return interaction.editReply('Error retrieving events calendar.');
          }
          
          if (events.length === 0) {
            return interaction.editReply(`No events scheduled for the next ${period}.`);
          }
          
          let description = `📅 **Upcoming Events (${period}):**\n\n`;
          events.forEach((event, index) => {
            const eventDate = moment(event.event_date);
            description += `**${index + 1}. ${event.title}**\n`;
            description += `🗓️ ${eventDate.format('ddd, MMM D')} at ${eventDate.format('h:mm A')} ${event.timezone}\n`;
            description += `🆔 Event ID: ${event.id}\n\n`;
          });
          
          const calendarEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`📆 Events Calendar - Next ${period === 'week' ? 'Week' : 'Month'}`)
            .setDescription(description)
            .setFooter({ text: `Use /event-summary [event_id] for details` })
            .setTimestamp();
            
          await interaction.editReply({ embeds: [calendarEmbed] });
        }
      );
    } catch (error) {
      console.error('Error generating events calendar:', error);
      await interaction.editReply('Failed to generate events calendar. Please try again.');
    }
  }
};