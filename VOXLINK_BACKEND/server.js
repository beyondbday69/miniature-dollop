require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
const port = process.env.PORT || 3000;

// Export the app for Vercel
module.exports = app;

// Middleware
app.use(cors());
app.use(express.json());

// Premium Logging
const log = (msg) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[\x1b[35mVOXLINK\x1b[0m] [${timestamp}] ${msg}`);
};

// Routes
app.get('/', (req, res) => {
  res.send(`
    <body style="background: #000; color: #fff; font-family: 'Cinzel', serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
      <div>
        <h1 style="font-size: 3rem; margin-bottom: 0.5rem; letter-spacing: 2px;">VOXLINK BACKEND</h1>
        <p style="color: rgba(255,255,255,0.5); letter-spacing: 4px; font-size: 0.8rem;">SYSTEM OPERATIONAL • ENCRYPTED SIGNALING</p>
        <div style="margin-top: 2rem; padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; background: rgba(255,255,255,0.02);">
          <span style="display: inline-block; width: 10px; height: 10px; background: #fff; border-radius: 50%; box-shadow: 0 0 8px #fff; margin-right: 10px;"></span>
          LISTENING ON PORT ${port}
        </div>
      </div>
    </body>
  `);
});

/**
 * Token generation endpoint
 * Expected query params: room, user
 */
app.get('/api/get-token', async (req, res) => {
  const { room, user } = req.query;

  if (!room || !user) {
    log(`\x1b[31mREJECTED\x1b[0m: Missing room or user parameters`);
    return res.status(400).json({ error: 'Missing room or user' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    log(`\x1b[31mERROR\x1b[0m: LiveKit credentials not configured in .env`);
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: user,
    });

    at.addGrant({ 
      roomJoin: true, 
      room: room, 
      canPublish: true, 
      canSubscribe: true,
      canPublishData: true
    });

    const token = await at.toJwt();
    log(`\x1b[32mGRANTED\x1b[0m: Token issued for user "\x1b[1m${user}\x1b[0m" in room "\x1b[1m${room}\x1b[0m"`);
    
    res.json({ token });
  } catch (error) {
    log(`\x1b[31mCRITICAL\x1b[0m: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log('\n' + ' '.repeat(10) + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(' '.repeat(10) + ' \x1b[1mVOXLINK CORE SIGNALING SERVER\x1b[0m');
    console.log(' '.repeat(10) + ' \x1b[32mONLINE\x1b[0m • Port: ' + port);
    console.log(' '.repeat(10) + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' + '\n');
  });
}
