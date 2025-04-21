// src/handlers/commandHandler.js
const commandModules = {
    'createevent': require('../commands/createEvent'),
    'rsvp': require('../commands/rsvp'),
    'event-summary': require('../commands/eventSummary'),
    'events-calendar': require('../commands/eventsCalendar'),
    'set-events-channel': require('../commands/setEventsChannel')
  };
  
  async function handleCommands(interaction) {
    const { commandName } = interaction;
  
    try {
      if (commandModules[commandName]) {
        await commandModules[commandName].execute(interaction);
      }
    } catch (error) {
      console.error(`Error handling command ${commandName}:`, error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'An error occurred while processing this command.', 
          ephemeral: true 
        });
      }
    }
  }
  
  module.exports = { handleCommands };