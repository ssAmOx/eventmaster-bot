// src/commands/commandRegistry.js
const { SlashCommandBuilder } = require('discord.js');

async function registerCommands(client) {
  const commands = [
    require('./createEvent').data,
    require('./rsvp').data,
    require('./eventSummary').data,
    require('./eventsCalendar').data,
    require('./setEventsChannel').data
  ];

  try {
    console.log('Started refreshing application (/) commands.');
    await client.application.commands.set(commands);
    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

module.exports = { registerCommands };