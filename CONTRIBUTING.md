# Contributing to EventMaster

First off, thank you for considering contributing to EventMaster! It's people like you that make this bot a great tool for Discord communities.

## Code of Conduct

By participating, you are expected to uphold this code. Please report unacceptable behavior to [ssamogamer@example.com].

## How Can I Contribute?

### Reporting Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/ssAmOx/eventmaster-bot/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/ssAmOx/eventmaster-bot/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- Open a new issue with a clear title and detailed description.
- Provide specific examples to demonstrate the steps.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

- All JavaScript code is linted with ESLint.
- Use 2 spaces for indentation.
- Use camelCase for variable names and functions.
- Use PascalCase for classes.
- Add comments for complex code blocks.
- Write tests for new features.

### Documentation Styleguide

- Use [Markdown](https://guides.github.com/features/mastering-markdown/).
- Include code examples for better understanding.

## Project Structure

```
eventmaster-bot/
├── src/
│   ├── commands/       # Command implementations
│   ├── database/       # Database operations
│   ├── handlers/       # Event handlers
│   └── utils/          # Utility functions
├── docs/               # Documentation
├── index.js            # Entry point
└── config.json         # Configuration (not in repo)
```

## Setting Up Development Environment

1. Clone your fork of the repo
   ```bash
   git clone https://github.com/ssAmOx/eventmaster-bot.git
   ```

2. Install dependencies
   ```bash
   cd eventmaster-bot
   npm install
   ```

3. Create your config file
   ```bash
   cp config.example.json config.json
   # Add your Discord bot token to config.json
   ```

4. Run in development mode
   ```bash
   npm run dev
   ```

## Additional Resources

- [Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

Thank you for your contribution!