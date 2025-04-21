const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../database/dbInit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-events-channel')
    .setDescription('Set the default events channel')
    .addChannelOption(option => option.setName('channel').setDescription('Channel for event posts').setRequired(true)),
  
  async execute(interaction) {
    if (!interaction.memberPermissions.has('ADMINISTRATOR')) {
      return interaction.reply({ 
        content: 'You need administrator permissions to use this command.', 
        ephemeral: true 
      });
    }

    const channel = interaction.options.getChannel('channel');
    if (channel.type !== 0) {
      return interaction.reply({ 
        content: 'Please select a text channel.', 
        ephemeral: true 
      });
    }

    try {
      db.run(
        `INSERT INTO guild_settings (guild_id, events_channel_id) VALUES (?, ?)
         ON CONFLICT(guild_id) DO UPDATE SET events_channel_id = ?`,
        [interaction.guild.id, channel.id, channel.id],
        (err) => {
          if (err) {
            console.error('Database error:', err);
            return interaction.reply({ 
              content: 'Error saving channel settings.', 
              ephemeral: true 
            });
          }
          
          interaction.reply({ 
            content: `Successfully set <#${channel.id}> as the events channel!`, 
            ephemeral: true 
          });
        }
      );
    } catch (error) {
      console.error('Error setting events channel:', error);
      await interaction.reply({ 
        content: 'Failed to set events channel. Please try again.', 
        ephemeral: true 
      });
    }
  }
};