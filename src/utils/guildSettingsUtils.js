const { db } = require('../database/dbInit');

function getGuildSettings(guildId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM guild_settings WHERE guild_id = ?', [guildId], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

module.exports = {
  getGuildSettings
};