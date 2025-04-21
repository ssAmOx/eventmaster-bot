const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require('../database/dbInit');

async function handleFeedbackButton(interaction, eventId) {
  await interaction.reply({
    content: 'Thank you for participating! Please rate this event from 1-5 stars and provide any feedback.',
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`rate_${eventId}_1`)
            .setLabel('⭐')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`rate_${eventId}_2`)
            .setLabel('⭐⭐')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`rate_${eventId}_3`)
            .setLabel('⭐⭐⭐')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`rate_${eventId}_4`)
            .setLabel('⭐⭐⭐⭐')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`rate_${eventId}_5`)
            .setLabel('⭐⭐⭐⭐⭐')
            .setStyle(ButtonStyle.Secondary)
        )
    ],
    ephemeral: true
  });
}

module.exports = {
  handleFeedbackButton
};