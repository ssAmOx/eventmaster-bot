// src/handlers/interactionHandler.js
const { handleButtons } = require('./buttonHandler');
const { handleCommands } = require('./commandHandler');

async function handleInteractions(interaction) {
  if (interaction.isCommand()) {
    await handleCommands(interaction);
  } else if (interaction.isButton()) {
    await handleButtons(interaction);
  }
}

module.exports = { handleInteractions };