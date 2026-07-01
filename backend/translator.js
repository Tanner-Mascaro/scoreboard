// Message Translator EIP
// AI Attribution: Built with assistance from Claude Sonnet 4.6

function translateMessage(rawData) {

  const { sport, game_id, home_team, away_team, home_score, away_score, event_type } = rawData;

  // Validate required fields
  if (!sport || !game_id || !home_team || !away_team || home_score === undefined || away_score === undefined || !event_type) {
    throw new Error('Missing required fields in raw data');
  }

  // Timestamp the event
  const timestamp = new Date().toISOString();

  return {
    sport,
    game_id,
    home_team,
    away_team,
    home_score,
    away_score,
    event_type,
    timestamp
  };
  
}

module.exports = { translateMessage };