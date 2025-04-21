const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rsvp')
    .setDescription('RSVP to an event manually')
    .addIntegerOption(option => option.setName('event_id').setDescription('Event ID').setRequired(true)),
  
  async execute(interaction) {
    const eventId = interaction.options.getInteger('event_id');
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

    await interaction.reply({
      content: `Please select your RSVP status for Event #${eventId}:`,
      components: [actionRow],
      ephemeral: true
    });
  }
};