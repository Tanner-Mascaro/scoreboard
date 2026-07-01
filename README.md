# Live Scoreboard

Real-time sports score updates using WebSockets and messaging patterns.

## Live App
(add after deployment)

## Setup
```bash
cd scoreboard
npm install
node backend/server.js
```
Open http://localhost:3001

## Enterprise Integration Patterns

### 1. Publish-Subscribe (WebSockets)
Clients subscribe to a sport channel. When a score updates, all subscribers receive it instantly via WebSocket. Citation: https://www.enterpriseintegrationpatterns.com/patterns/messaging/PublishSubscribeChannel.html

### 2. Content-Based Router
Incoming score messages are routed to the correct sport channel (NBA or NFL) based on the `sport` field in the message. Citation: https://www.enterpriseintegrationpatterns.com/patterns/messaging/ContentBasedRouter.html

### 3. Message Translator
Raw score data is translated into a clean, consistent message format before being broadcast to subscribers. Citation: https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageTranslator.html

## GoF Design Patterns

### 1. Observer
WebSocket subscribers observe the score channel and are notified automatically when state changes.

### 2. Facade
The WebSocket message handler in `server.js` hides the complexity of translation, routing, and audit logging behind a single interface. When a score update fires, the caller doesn't need to know about the translator, router, or database — it just triggers the pipeline.

## State Chart

Connection workflow governed by `backend/statechart.js`.

| Current State | Event | Next State |
|---|---|---|
| disconnected | connect | connecting |
| connecting | success | connected |
| connecting | fail | reconnecting |
| connected | disconnect | reconnecting |
| reconnecting | success | connected |
| reconnecting | give_up | disconnected |

**Guards:** Only transition if WebSocket readyState is valid.

## Audit Trail

Every score update is logged to SQLite with a full timestamp. Query history at `/api/history/:gameId` or all events at `/api/events`.

## Perfect Framework Concerns

- **Persistence** — SQLite audit trail, every mutation logged
- **Deployment** — Deployed on Render with HTTPS
- **Secrets management** — API keys in .env, never committed

## AI Attribution
Built with assistance from Claude Sonnet 4.6 for WebSocket server, EIP implementations, and state chart.