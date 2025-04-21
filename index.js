// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { initializeDatabase } = require('./src/database/dbInit');
const { registerCommands } = require('./src/commands/commandRegistry');
const { handleInteractions } = require('./src/handlers/interactionHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

// Initialize database
initializeDatabase();

// Bot ready event
client.once('ready', () => {
  console.log(`EventMaster is online! Logged in as ${client.user.tag}`);
  registerCommands(client);
});

// Handle interactions
client.on('interactionCreate', async interaction => {
  await handleInteractions(interaction);
});

client.login(token);

