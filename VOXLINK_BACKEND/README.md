# 🎙️ VoxLink Backend

The premium, lightweight signaling core for the VoxLink voice chat application.

## 🚀 Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment:**
    - Copy `.env.example` to `.env`.
    - Fill in your LiveKit credentials.
    ```bash
    cp .env.example .env
    ```

3.  **Run the Server:**
    ```bash
    npm start
    ```

## 🛠️ Integration with Frontend

In your `voxlink-frontend`, ensure your API calls point to this server. If running locally:
- Backend: `http://localhost:3000`
- Frontend: Use a proxy in `vite.config.ts` or provide the full URL in `App.tsx`.

### Example Proxy for `vite.config.ts`:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

## 🔒 Security
This backend uses the `livekit-server-sdk` to generate secure JSON Web Tokens (JWT) for authenticated access to voice rooms. Ensure your `LIVEKIT_API_SECRET` is never exposed.
