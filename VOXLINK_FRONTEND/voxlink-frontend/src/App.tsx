import React, { useState } from 'react';
import { Mic, LogIn, PhoneOff, User, Hash } from 'lucide-react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  AudioConference,
} from '@livekit/components-react';
import '@livekit/components-styles';

const serverUrl = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server.com';

export default function App() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !userName) return;

    setIsJoining(true);
    try {
      // In a real app, you'd fetch this from your backend
      // For now, we assume your friend's backend provides this endpoint
      const resp = await fetch(`/api/get-token?room=${roomName}&user=${userName}`);
      const data = await resp.json();
      setToken(data.token);
    } catch (err) {
      console.error('Failed to get token:', err);
      alert('Failed to join room. Make sure backend is running.');
    } finally {
      setIsJoining(false);
    }
  };

  if (!token) {
    return (
      <div className="landing-container">
        {/* Cinematic Background */}
        <div className="aurora-container">
          <div className="aurora aurora-1"></div>
          <div className="aurora aurora-2"></div>
          <div className="aurora aurora-3"></div>
        </div>
        <div className="noise-overlay"></div>
        
        <main className="landing-content animate-float">
          <div className="glass-panel main-card">
            <header className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-pulse"></div>
                <div className="logo-icon">
                  <Mic size={32} strokeWidth={2.5} />
                </div>
                <div className="waveform">
                  <div className="wave-bar" style={{ animationDelay: '0s' }}></div>
                  <div className="wave-bar" style={{ animationDelay: '0.2s' }}></div>
                  <div className="wave-bar" style={{ animationDelay: '0.4s' }}></div>
                  <div className="wave-bar" style={{ animationDelay: '0.1s' }}></div>
                  <div className="wave-bar" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
              <h1 className="premium-gradient-text">VoxLink</h1>
              <p className="subtitle">Premium Lightweight Voice Chat</p>
              <div className="status-badge">
                <span className="status-dot"></span>
                System Operational
              </div>
            </header>

            <form onSubmit={handleJoin} className="join-form">
              <div className="input-group">
                <label>
                  <User size={16} />
                  Display Name
                </label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="e.g. Alex"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="input-group">
                <label>
                  <Hash size={16} />
                  Room ID
                </label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="e.g. general-chat"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <button type="submit" className="btn-premium" disabled={isJoining}>
                <div className="btn-glow"></div>
                <div className="btn-content">
                  {isJoining ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <span>Join Room</span>
                      <LogIn size={18} />
                    </>
                  )}
                </div>
              </button>
            </form>

            <footer className="card-footer">
              <p>Secure • Encrypted • Low Latency</p>
            </footer>
          </div>
          
          <div className="ambient-particles">
            <div className="particle p-1"></div>
            <div className="particle p-2"></div>
            <div className="particle p-3"></div>
          </div>
        </main>

        <style>{`
          .landing-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background: radial-gradient(circle at center, #0f172a 0%, #070816 100%);
            padding: 24px;
            overflow: hidden;
          }

          /* Aurora Background */
          .aurora-container {
            position: absolute;
            inset: 0;
            z-index: 0;
            filter: blur(100px);
            opacity: 0.5;
          }
          .aurora {
            position: absolute;
            width: 50vw;
            height: 50vw;
            border-radius: 50%;
            animation: aurora 20s infinite alternate ease-in-out;
          }
          .aurora-1 {
            background: var(--accent-blue);
            top: -10%;
            left: -10%;
            opacity: 0.3;
          }
          .aurora-2 {
            background: var(--accent-purple);
            bottom: -10%;
            right: -10%;
            opacity: 0.3;
            animation-delay: -5s;
          }
          .aurora-3 {
            background: var(--accent-pink);
            top: 40%;
            left: 30%;
            width: 30vw;
            height: 30vw;
            opacity: 0.2;
            animation-delay: -10s;
          }

          .noise-overlay {
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.05;
            pointer-events: none;
            z-index: 1;
          }

          .landing-content {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 440px;
          }

          .main-card {
            padding: 48px 40px;
            border-radius: 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .main-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--glass-highlight), transparent);
          }

          .logo-section {
            margin-bottom: 40px;
          }
          .logo-wrapper {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-pulse {
            position: absolute;
            inset: -8px;
            background: var(--accent-purple);
            border-radius: 24px;
            opacity: 0.2;
            filter: blur(12px);
            animation: pulse-glow 3s infinite;
          }
          .logo-icon {
            position: relative;
            z-index: 2;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.5);
          }

          .waveform {
            position: absolute;
            bottom: -10px;
            display: flex;
            gap: 3px;
            align-items: flex-end;
            height: 20px;
          }
          .wave-bar {
            width: 3px;
            background: var(--accent-pink);
            border-radius: 1px;
            animation: wave 1s infinite ease-in-out;
          }

          .logo-section h1 {
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -2px;
            margin-bottom: 8px;
          }
          .subtitle {
            color: var(--text-secondary);
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 16px;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 600;
            color: #4ade80;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-dot {
            width: 6px;
            height: 6px;
            background: #4ade80;
            border-radius: 50%;
            box-shadow: 0 0 8px #4ade80;
          }

          .join-form {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .input-group {
            text-align: left;
          }
          .input-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 10px;
            margin-left: 4px;
          }
          .input-wrapper {
            position: relative;
          }
          .input-wrapper input {
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 16px 20px;
            color: white;
            font-size: 1rem;
            font-family: var(--font-main);
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .input-glow {
            position: absolute;
            inset: 0;
            border-radius: 16px;
            pointer-events: none;
            transition: all 0.3s;
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
          .input-wrapper input:focus {
            border-color: var(--accent-blue);
            background: rgba(59, 130, 246, 0.05);
          }
          .input-wrapper input:focus + .input-glow {
            box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.3);
          }

          .btn-premium {
            position: relative;
            width: 100%;
            height: 58px;
            border: none;
            background: transparent;
            cursor: pointer;
            margin-top: 8px;
            transition: transform 0.2s;
          }
          .btn-premium:active {
            transform: scale(0.98);
          }
          .btn-glow {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-pink));
            border-radius: 16px;
            opacity: 0.8;
            filter: blur(12px);
            transition: opacity 0.3s;
          }
          .btn-premium:hover .btn-glow {
            opacity: 1;
          }
          .btn-content {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-pink));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: white;
            font-weight: 700;
            font-size: 1.1rem;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3);
          }

          .card-footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid var(--glass-border);
          }
          .card-footer p {
            font-size: 0.75rem;
            color: var(--text-muted);
            letter-spacing: 1px;
            text-transform: uppercase;
            font-weight: 600;
          }

          .ambient-particles .particle {
            position: absolute;
            background: white;
            border-radius: 50%;
            filter: blur(1px);
            opacity: 0.2;
            z-index: -1;
          }
          .p-1 { width: 4px; height: 4px; top: 20%; left: 10%; animation: float 8s infinite; }
          .p-2 { width: 6px; height: 6px; bottom: 15%; right: 15%; animation: float 12s infinite reverse; }
          .p-3 { width: 3px; height: 3px; top: 60%; left: 80%; animation: float 10s infinite 2s; }

          .loader {
            width: 24px;
            height: 24px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (max-width: 480px) {
            .main-card {
              padding: 32px 24px;
            }
            .logo-section h1 {
              font-size: 2.5rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="room-container">
      {/* Subtle Aurora Background for Room */}
      <div className="aurora-container room-aurora">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
      </div>

      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        onDisconnected={() => setToken(undefined)}
        data-lk-theme="default"
        style={{ height: '100vh', background: 'transparent' }}
      >
        <div className="room-header">
          <div className="room-info">
            <div className="room-badge-container">
              <span className="live-dot"></span>
              <span className="room-badge">Secure Voice Link</span>
            </div>
            <h2 className="premium-gradient-text">{roomName}</h2>
          </div>
          
          <div className="header-actions">
            <div className="user-profile">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{userName}</span>
            </div>
            <button className="leave-btn-premium" onClick={() => setToken(undefined)}>
              <PhoneOff size={18} />
              <span>Leave</span>
            </button>
          </div>
        </div>

        <div className="main-content">
          <AudioConference />
        </div>

        <RoomAudioRenderer />
        
        <div className="bottom-controls-wrapper">
          <div className="bottom-controls glass-panel">
            <ControlBar variation="minimal" controls={{ camera: false, screenShare: false, chat: false, settings: true }} />
          </div>
        </div>
      </LiveKitRoom>

      <style>{`
        .room-container {
          background-color: var(--bg-darker);
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .room-aurora {
          opacity: 0.15;
          filter: blur(120px);
        }

        .room-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          background: linear-gradient(to bottom, rgba(4, 5, 13, 0.8), transparent);
          backdrop-filter: blur(8px);
        }

        .room-badge-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          box-shadow: 0 0 10px #ef4444;
          animation: pulse-glow 2s infinite;
        }
        .room-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          color: var(--text-muted);
        }
        .room-info h2 {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 100px;
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          background: var(--accent-purple);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          color: white;
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .leave-btn-premium {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 14px;
          color: #ef4444;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .leave-btn-premium:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
        }

        .main-content {
          padding-top: 140px;
          padding-bottom: 120px;
          height: 100%;
        }

        .bottom-controls-wrapper {
          position: fixed;
          bottom: 40px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 10;
        }
        .bottom-controls {
          padding: 12px 24px;
          border-radius: 24px;
        }
        
        /* LiveKit Component Overrides */
        .lk-audio-conference {
          background: transparent !important;
          border: none !important;
          max-width: 1000px !important;
          margin: 0 auto !important;
        }
        .lk-participant-tile {
          background: var(--glass-bg) !important;
          border: 1px solid var(--glass-border) !important;
          border-radius: 24px !important;
          backdrop-filter: blur(12px) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .lk-participant-tile:hover {
          border-color: var(--accent-purple) !important;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5) !important;
        }
        .lk-participant-name {
          font-weight: 700 !important;
          font-family: var(--font-display) !important;
        }
        .lk-avatar {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)) !important;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3) !important;
        }
        .lk-button {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid var(--glass-border) !important;
          border-radius: 14px !important;
          padding: 12px !important;
          transition: all 0.2s !important;
        }
        .lk-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: var(--text-muted) !important;
        }
        .lk-button-group {
          gap: 12px !important;
        }

        @media (max-width: 640px) {
          .room-header {
            padding: 24px;
          }
          .user-profile {
            display: none;
          }
          .leave-btn-premium span {
            display: none;
          }
          .leave-btn-premium {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
