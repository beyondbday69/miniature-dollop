# VoxLink Backend Integration Guide (LiveKit)

To make the frontend work, you need a backend that manages LiveKit tokens.

## 1. LiveKit Server Setup
You can either:
- **Cloud:** Use [LiveKit Cloud](https://livekit.io/cloud) (Free tier available).
- **Self-Hosted:** Run LiveKit on your VPS using Docker.

## 2. Environment Variables
You will need these from your LiveKit dashboard:
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_URL` (e.g., `wss://your-project.livekit.cloud`)

## 3. Token Generation Endpoint
The frontend expects a `GET` request to `/api/get-token` with `room` and `user` query parameters.

Example implementation using Node.js and the `livekit-server-sdk`:

```javascript
const { AccessToken } = require('livekit-server-sdk');

app.get('/api/get-token', async (req, res) => {
  const { room, user } = req.query;

  if (!room || !user) {
    return res.status(400).json({ error: 'Missing room or user' });
  }

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: user,
  });

  at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

  res.json({ token: at.toJwt() });
});
```

## 4. Connecting Frontend to Backend
In the frontend `voxlink-frontend/src/App.tsx`, I've set up a placeholder fetch:
```javascript
const resp = await fetch(`/api/get-token?room=${roomName}&user=${userName}`);
```
Make sure your backend is either serving the frontend or has CORS enabled to allow the frontend to talk to it.
