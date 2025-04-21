const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const { db } = require('../database/dbInit');
const { getGuildSettings } = require('../utils/guildSettingsUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createevent')
    .setDescription('Create a new event')
    .addStringOption(option => option.setName('title').setDescription('Event title').setRequired(true))
    .addStringOption(option => option.setName('date').setDescription('Event date (DD/MM/YYYY HH:MM)').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Event description').setRequired(true))
    .addStringOption(option => option.setName('image').setDescription('Event image URL (optional)'))
    .addStringOption(option => option.setName('timezone').setDescription('Timezone (e.g., EST, UTC)')),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const title = interaction.options.getString('title');
    const dateString = interaction.options.getString('date');
    const description = interaction.options.getString('description');
    const imageUrl = interaction.options.getString('image') || null;
    const timezone = interaction.options.getString('timezone') || 'UTC';

    let eventDate;
    try {
      eventDate = moment(`${dateString} ${timezone}`, 'DD/MM/YYYY HH:mm Z');
      if (!eventDate.isValid()) {
        return interaction.editReply('Invalid date format. Please use DD/MM/YYYY HH:MM');
      }
      if (eventDate.isBefore(moment())) {
        return interaction.editReply('Cannot create events in the past');
      }
    } catch (error) {
      return interaction.editReply('Error parsing date. Please use DD/MM/YYYY HH:MM format');
    }

    try {
      const guildSettings = await getGuildSettings(interaction.guild.id);
      const eventsChannelId = guildSettings?.events_channel_id;
      
      if (!eventsChannelId) {
        return interaction.editReply('Events channel not set. An admin needs to use `/set-events-channel` first.');
      }
      
      const eventsChannel = await interaction.guild.channels.fetch(eventsChannelId);
      if (!eventsChannel) {
        return interaction.editReply('Events channel not found. Please set a valid channel with `/set-events-channel`');
      }
      
      const event = {
        guild_id: interaction.guild.id,
        channel_id: eventsChannel.id,
        title,
        description,
        event_date: eventDate.toISOString(),
        image_url: imageUrl,
        created_by: interaction.user.id,
        timezone
      };
      
      db.run(
        `INSERT INTO events (guild_id, channel_id, title, description, event_date, image_url, created_by, timezone) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [event.guild_id, event.channel_id, event.title, event.description, event.event_date, event.image_url, event.created_by, event.timezone],
        async function(err) {
          if (err) {
            console.error('Database error:', err);
            return interaction.editReply('Error saving event to database');
          }
          
          const eventId = this.lastID;
          const eventEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`📅 ${title}`)
            .setDescription(description)
            .addFields(
              { name: 'Date & Time', value: `${eventDate.format('dddd, MMMM D, YYYY')}`, inline: true },
              { name: 'Time', value: `${eventDate.format('h:mm A')} ${timezone}`, inline: true },
              { name: 'Created by', value: `<@${interaction.user.id}>`, inline: true},
              { name: 'Status', value: '📝 Accepting RSVPs', inline: false },
              { name: 'Responses', value: '0 Going | 0 Not Going', inline: false }
            )
            .setFooter({ text: `Event ID: ${eventId}` })
            .setTimestamp();
            
          if (imageUrl) eventEmbed.setImage(imageUrl);
          
          const actionRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`rsvp_yes_${eventId}`)
                .setLabel('✅ Going')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`rsvp_no_${eventId}`)
                .setLabel('❌ Not Going')
                .setStyle(ButtonStyle.Danger)
            );
          
          const eventMessage = await eventsChannel.send({
            embeds: [eventEmbed],
            components: [actionRow]
          });
          
          db.run('UPDATE events SET message_id = ? WHERE id = ?', [eventMessage.id, eventId]);
          await interaction.editReply(`Event created successfully! Check <#${eventsChannel.id}>`);
        }
      );
    } catch (error) {
      console.error('Error creating event:', error);
      await interaction.editReply('Failed to create event. Please try again.');
    }
  }
};