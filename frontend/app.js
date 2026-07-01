// AI Attribution: Built with assistance from Claude Sonnet 4.6
const ws = new WebSocket(`ws://${window.location.host}`);
const games = {};

ws.onopen = () => {
  document.getElementById('status').textContent = 'Connected';
  document.getElementById('status').className = 'connected';
};

ws.onclose = () => {
  document.getElementById('status').textContent = 'Disconnected — reconnecting...';
  document.getElementById('status').className = 'disconnected';
  setTimeout(() => location.reload(), 3000);
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  updateScore(message);
};

function subscribe(sport) {
  ws.send(JSON.stringify({ type: 'subscribe', sport }));
}

function updateScore(message) {
  games[message.game_id] = message;
  renderGames();
}

function renderGames() {
  const container = document.getElementById('games');
  container.innerHTML = Object.values(games).map(game => `
    <div class="game">
      <div class="teams">${game.home_team} vs ${game.away_team}</div>
      <div class="score">${game.home_score} — ${game.away_score}</div>
      <div>${game.sport} · ${new Date(game.timestamp).toLocaleTimeString()}</div>
    </div>
  `).join('');
}