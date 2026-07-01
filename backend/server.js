// AI Attribution: Built with assistance from Claude Sonnet 4.6
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { translateMessage } = require('./translator');
const { routeMessage } = require('./router');
const { states, transition } = require('./statechart');
const { logEvent, getHistory, getAllEvents } = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

const channels = {}; // sport -> Set of subscribers

wss.on('connection', (ws) => {
  ws.state = states.CONNECTING;
  ws.state = transition(ws.state, 'success'); // now connected
  console.log('Client connected, state:', ws.state);

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    if (msg.type === 'subscribe') {
      if (!channels[msg.sport]) channels[msg.sport] = new Set();
      channels[msg.sport].add(ws);
      console.log(`Client subscribed to ${msg.sport}`);
    }
  });

  ws.on('close', () => {
    ws.state = transition(ws.state, 'disconnect');
    console.log('Client disconnected, state:', ws.state);
    // remove from all channels
    Object.values(channels).forEach(set => set.delete(ws));
  });
});

// Simulate score updates every 5 seconds
function simulateScoreUpdate() {
  const games = [
    { sport: 'NBA', game_id: 'nba-1', home_team: 'Jazz', away_team: 'Lakers' },
    { sport: 'NBA', game_id: 'nba-2', home_team: 'Celtics', away_team: 'Warriors' },
    { sport: 'NFL', game_id: 'nfl-1', home_team: 'Cowboys', away_team: 'Eagles' },
    { sport: 'NFL', game_id: 'nfl-2', home_team: 'Chiefs', away_team: 'Bills' },
  ];

  const game = games[Math.floor(Math.random() * games.length)];

  const rawData = {
    ...game,
    home_score: Math.floor(Math.random() * 100),
    away_score: Math.floor(Math.random() * 100),
    event_type: 'score_update'
  };

  const message = translateMessage(rawData);
  logEvent(message);
  routeMessage(message, channels);
}

setInterval(simulateScoreUpdate, 5000);

// REST endpoint for audit trail
app.get('/api/history/:gameId', (req, res) => {
  res.json(getHistory(req.params.gameId));
});

app.get('/api/events', (req, res) => {
  res.json(getAllEvents());
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});