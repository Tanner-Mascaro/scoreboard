// AI Attribution: Built with assistance from Claude Sonnet 4.6
const Database = require('better-sqlite3');
const db = new Database('scoreboard.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS score_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sport TEXT,
    game_id TEXT,
    home_team TEXT,
    away_team TEXT,
    home_score INTEGER,
    away_score INTEGER,
    event_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function logEvent(event) {
  const stmt = db.prepare(`
    INSERT INTO score_events (sport, game_id, home_team, away_team, home_score, away_score, event_type)
    VALUES (@sport, @game_id, @home_team, @away_team, @home_score, @away_score, @event_type)
  `);
  return stmt.run(event);
}

function getHistory(game_id) {
  return db.prepare('SELECT * FROM score_events WHERE game_id = ? ORDER BY timestamp ASC').all(game_id);
}

function getAllEvents() {
  return db.prepare('SELECT * FROM score_events ORDER BY timestamp DESC LIMIT 100').all();
}

module.exports = { logEvent, getHistory, getAllEvents };