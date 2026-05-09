import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Settings, PhoneOff, 
  User, Hash, Shield, Zap, Globe, Lock, Share2, 
  Check
} from 'lucide-react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useParticipants,
  useMediaDeviceSelect,
} from '@livekit/components-react';
import '@livekit/components-styles';

const serverUrl = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server.com';

// --- CUSTOM COMPONENTS ---

const ParticipantTile = ({ participant, isLocal }: { participant: any, isLocal?: boolean }) => {
  const { isSpeaking } = participant;
  const isMuted = !participant.isMicrophoneEnabled;

  return (
    <div className={`p-tile ${isSpeaking ? 'speaking' : ''}`}>
      <div className={`p-avatar ${isLocal ? '' : 'ghost'}`}>
        {participant.identity?.charAt(0).toUpperCase()}
        {isSpeaking && <div className="voice-waves"><span></span><span></span><span></span></div>}
      </div>
      <div className="p-label">
        <span className="p-name">{participant.identity} {isLocal ? '(You)' : ''}</span>
        {isMuted && <MicOff size={12} className="status-icon" />}
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { devices: microphones, activeDeviceId: activeMicId, setActiveMediaDevice: setActiveMic } = useMediaDeviceSelect({ kind: 'audioinput' });
  const { devices: speakers, activeDeviceId: activeSpkId, setActiveMediaDevice: setActiveSpk } = useMediaDeviceSelect({ kind: 'audiooutput' });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>AUDIO SETTINGS</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="setting-group">
            <label><Mic size={14} /> MICROPHONE</label>
            <select value={activeMicId} onChange={(e) => setActiveMic(e.target.value)}>
              {microphones.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
            </select>
          </div>
          <div className="setting-group">
            <label><Volume2 size={14} /> SPEAKER</label>
            <select value={activeSpkId} onChange={(e) => setActiveSpk(e.target.value)}>
              {speakers.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomRoomUI = ({ roomName, userName: _userName, onDisconnect }: { roomName: string, userName: string, onDisconnect: () => void }) => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const participants = useParticipants();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="room-container premium-view">
      <header className="room-nav">
        <div className="nav-left">
          <div className="live-pill">
            <span className="live-indicator"></span>
            LIVE SIGNAL
          </div>
          <h1 className="room-name-display">{roomName.toUpperCase()}</h1>
        </div>
        <div className="nav-right">
          <button className="invite-btn" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'LINK COPIED' : 'INVITE FRIEND'}</span>
          </button>
          <div className="session-info">
            <span className="latency">SECURE</span>
            <span className="encryption">AES-256</span>
          </div>
        </div>
      </header>

      <main className="call-grid">
        <div className="participant-tiles">
          <ParticipantTile participant={localParticipant} isLocal={true} />
          {participants.map(p => (
            <ParticipantTile key={p.sid} participant={p} />
          ))}
        </div>
      </main>

      <footer className="room-controls">
        <div className="controls-glass">
          <div className="controls-group">
            <button 
              className={`control-btn ${!isMicrophoneEnabled ? 'active-red' : ''}`} 
              onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
            >
              {!isMicrophoneEnabled ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
          </div>

          <div className="controls-divider"></div>

          <div className="controls-group">
            <button className="control-btn" onClick={() => setIsSettingsOpen(true)}>
              <Settings size={22} />
            </button>
            
            <button className="leave-action" onClick={onDisconnect}>
              <PhoneOff size={22} />
              <span>TERMINATE</span>
            </button>
          </div>
        </div>
      </footer>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <style>{`
        .premium-view {
          background: #000;
          height: 100vh;
          display: flex;
          flex-direction: column;
          color: #fff;
          font-family: var(--font-main);
        }

        .room-nav {
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .invite-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 24px;
        }

        .invite-btn:hover { background: rgba(255,255,255,0.1); }

        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 6px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #fff;
          margin-bottom: 8px;
        }

        .live-indicator {
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px #fff;
          animation: pulse-dot 2s infinite;
        }

        .room-name-display {
          font-family: var(--font-title);
          font-size: 1.5rem;
          letter-spacing: 2px;
        }

        .session-info {
          display: flex;
          gap: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: 1px;
        }

        .call-grid {
          flex: 1;
          padding: 48px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
        }

        .participant-tiles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1200px;
        }

        .p-tile {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .p-tile.speaking {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.04);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .p-avatar {
          width: 100px;
          height: 100px;
          background: #fff;
          color: #000;
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          font-weight: 800;
          position: relative;
        }

        .p-avatar.ghost {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .voice-waves {
          position: absolute;
          bottom: -15px;
          display: flex;
          gap: 4px;
        }

        .voice-waves span {
          width: 4px;
          height: 10px;
          background: #fff;
          border-radius: 10px;
          animation: wave 1s infinite ease-in-out;
        }

        .voice-waves span:nth-child(2) { animation-delay: 0.2s; height: 18px; }
        .voice-waves span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.5); }
        }

        .p-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .p-name {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .status-icon { color: #ff4d4d; }

        .room-controls {
          padding-bottom: 48px;
          display: flex;
          justify-content: center;
        }

        .controls-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .control-btn {
          width: 52px;
          height: 52px;
          background: transparent;
          border: none;
          border-radius: 14px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn:hover { background: rgba(255,255,255,0.1); }
        .control-btn.active-red { color: #ff4d4d; background: rgba(255, 77, 77, 0.1); }

        .leave-action {
          height: 52px;
          padding: 0 24px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .leave-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255,255,255,0.2);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .modal-content {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 400px;
          padding: 32px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .modal-header h3 { font-family: var(--font-title); letter-spacing: 2px; font-size: 1.1rem; }
        .close-modal { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
        .setting-group { margin-bottom: 24px; }
        .setting-group label { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 800; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 12px; }
        .setting-group select { 
          width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 12px; padding: 12px; color: #fff; outline: none;
        }
      `}</style>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Outfit:wght@300;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !userName) return;

    setIsJoining(true);
    try {
      const resp = await fetch(`/api/get-token?room=${roomName}&user=${userName}`);
      const data = await resp.json();
      setToken(data.token);
    } catch (err) {
      console.error('Failed to get token:', err);
      alert('Connection failed. Ensure the backend is running and LiveKit keys are set.');
    } finally {
      setIsJoining(false);
    }
  };

  if (!token) {
    return (
      <div className="landing-page">
        <div className="mesh-background"></div>
        <main className="auth-card">
          <div className="auth-glass">
            <header className="brand-header">
              <div className="brand-logo"><Mic size={28} strokeWidth={2.5} /></div>
              <h1 className="brand-name">VOXLINK</h1>
              <div className="premium-badge"><Shield size={12} /><span>ULTRA SECURE</span></div>
            </header>

            <div className="auth-body">
              <h2 className="welcome-text">Premium Voice Control</h2>
              <p className="welcome-sub">Lightweight, encrypted, high-fidelity audio.</p>

              <form onSubmit={handleJoin} className="auth-form">
                <div className="input-field">
                  <label>IDENTIFICATION</label>
                  <div className="input-box">
                    <User size={18} className="input-icon" /><input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                  </div>
                </div>
                <div className="input-field">
                  <label>ACCESS ROOM</label>
                  <div className="input-box">
                    <Hash size={18} className="input-icon" /><input type="text" placeholder="Enter Room ID" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="login-btn" disabled={isJoining}>
                  {isJoining ? <div className="spinner"></div> : <><span>ESTABLISH LINK</span><Zap size={18} fill="currentColor" /></>}
                </button>
              </form>
            </div>

            <footer className="auth-footer">
              <div className="footer-item"><Lock size={12} /> END-TO-END</div>
              <div className="footer-item"><Globe size={12} /> LOW LATENCY</div>
            </footer>
          </div>
        </main>
        <style>{`
          :root { --bg: #000; --accent: #fff; --accent-dim: rgba(255, 255, 255, 0.1); --text-dim: rgba(255, 255, 255, 0.5); --font-main: 'Outfit', sans-serif; --font-title: 'Cinzel', serif; }
          .landing-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: var(--font-main); overflow: hidden; position: relative; }
          .mesh-background { position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 40%); z-index: 0; }
          .auth-card { width: 100%; max-width: 440px; z-index: 1; animation: fadeIn 1s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .auth-glass { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 48px; backdrop-filter: blur(20px); box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
          .brand-header { text-align: center; margin-bottom: 40px; }
          .brand-logo { width: 56px; height: 56px; background: var(--accent); color: var(--bg); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(255,255,255,0.2); }
          .brand-name { font-family: var(--font-title); font-size: 2.2rem; letter-spacing: 4px; margin-bottom: 12px; color: var(--accent); }
          .premium-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px; color: var(--text-dim); }
          .auth-body { margin-bottom: 32px; }
          .welcome-text { font-size: 1.5rem; margin-bottom: 8px; color: var(--accent); }
          .welcome-sub { font-size: 0.9rem; color: var(--text-dim); margin-bottom: 32px; }
          .auth-form { display: flex; flex-direction: column; gap: 24px; }
          .input-field { text-align: left; }
          .input-field label { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 10px; }
          .input-box { position: relative; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; transition: all 0.3s; }
          .input-box:focus-within { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }
          .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-dim); }
          .input-box input { width: 100%; background: transparent; border: none; padding: 16px 16px 16px 48px; color: var(--accent); font-size: 0.95rem; outline: none; }
          .login-btn { height: 56px; background: var(--accent); color: var(--bg); border: none; border-radius: 12px; font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: all 0.3s; margin-top: 12px; }
          .login-btn:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(255,255,255,0.15); }
          .auth-footer { display: flex; justify-content: center; gap: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
          .footer-item { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 600; color: var(--text-dim); letter-spacing: 1px; }
          .spinner { width: 20px; height: 20px; border: 2px solid rgba(0,0,0,0.1); border-top-color: #000; border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      onDisconnected={() => setToken(undefined)}
    >
      <CustomRoomUI roomName={roomName} userName={userName} onDisconnect={() => setToken(undefined)} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
