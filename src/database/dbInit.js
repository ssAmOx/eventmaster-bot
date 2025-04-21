// src/database/dbInit.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./eventmaster.db');

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      message_id TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      event_date TEXT NOT NULL,
      image_url TEXT,
      created_by TEXT NOT NULL,
      timezone TEXT DEFAULT 'UTC',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_completed BOOLEAN DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(event_id, user_id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER,
      comment TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(event_id, user_id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS guild_settings (
      guild_id TEXT PRIMARY KEY,
      events_channel_id TEXT,
      admin_role_id TEXT,
      default_timezone TEXT DEFAULT 'UTC'
    )`);
  });
}

module.exports = {
  db,
  initializeDatabase
};