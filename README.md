# EventMaster Discord Bot

<div align="center">
  <img src="docs/images/eventmaster-logo.png" alt="EventMaster Logo" width="200"/>
  <br>
  <p>A powerful Discord bot to manage events in your server</p>
  <a href="https://github.com/ssAmOx/eventmaster-bot/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/ssAmOx/eventmaster-bot"></a>
  <a href="https://github.com/ssAmOx/eventmaster-bot/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ssAmOx/eventmaster-bot"></a>
  <a href="https://github.com/ssAmOx/eventmaster-bot/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/ssAmOx/eventmaster-bot"></a>
</div>

## 🌟 Features

- **Event Creation**: Create events with title, date, description, and optional images
- **RSVP System**: Track RSVPs with interactive buttons
- **Automated Reminders**: Notifications 24h and 1h before events
- **Event Calendar**: View upcoming events by week or month
- **Post-Event Analytics**: Track attendance and collect feedback

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16.9.0 or higher)
- npm (Node Package Manager)
- A Discord account and server with admin permissions

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ssAmOx/eventmaster-bot.git
   cd eventmaster-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   ```bash
   cp config.example.json config.json
   ```
   Edit `config.json` with your Discord bot token

4. **Start the bot**
   ```bash
   node index.js
   ```

## 🛠️ Setting Up Your Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and add a bot
3. Enable required intents:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
4. Generate an invite URL with these scopes:
   - `bot`
   - `applications.commands`
5. Add these bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Add Reactions
   - Use External Emojis
   - Use Slash Commands

## 📝 Usage

### Initial Setup
```
/set-events-channel #your-events-channel
```

### Creating Events
```
/createevent title:Game Night date:25/04/2025 20:00 description:Join us for fun games! image:https://example.com/image.jpg timezone:EST
```

### Managing RSVPs
Users can click the ✅ or ❌ buttons to RSVP

For manual RSVP:
```
/rsvp event_id:1
```

### Viewing Events
```
/events-calendar period:week
```
or
```
/events-calendar period:month
```

### Event Summary
```
/event-summary event_id:1
```

## 📚 Documentation

For more detailed usage and examples, see the [Documentation](docs/).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Read the [Contributing Guidelines](docs/CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Discord.js](https://discord.js.org/)
- [Node.js](https://nodejs.org/)
- [SQLite](https://www.sqlite.org/)

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/ssAmOx/eventmaster-bot](https://github.com/ssAmOx/eventmaster-bot)