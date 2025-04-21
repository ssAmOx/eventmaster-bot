// src/handlers/buttonHandler.js
const { handleRSVP } = require('../utils/rsvpUtils');
const { handleFeedbackButton } = require('../utils/feedbackUtils');

async function handleButtons(interaction) {
  const customId = interaction.customId;

  if (customId.startsWith('rsvp_')) {
    const [action, status, eventId] = customId.split('_');
    await handleRSVP(interaction, parseInt(eventId), status);
  } else if (customId.startsWith('feedback_')) {
    const eventId = customId.split('_')[1];
    await handleFeedbackButton(interaction, parseInt(eventId));
  }
}

module.exports = { handleButtons };