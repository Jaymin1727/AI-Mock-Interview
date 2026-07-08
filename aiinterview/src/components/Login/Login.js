import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import './Login.css';

const provider = new GoogleAuthProvider();

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      onLogin(result.user, token);
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Dynamic Background Elements */}
      <div className="bg-decoration">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="login-card glass">
        <div className="login-header">
          <div className="brand-badge">
            <Sparkles size={16} />
            <span>AI Powered</span>
          </div>
          <h1>AI Mock Interview</h1>
          <p>Your journey to a dream job starts here. Prepare with confidence.</p>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <div className="feature-text">
              <h4>Tailored Questions</h4>
              <span>Role-specific technical and behavioral questions.</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-text">
              <h4>Real-time Analysis</h4>
              <span>Get instant AI feedback on your performance.</span>
            </div>
          </div>
        </div>

        <div className="login-actions">
          <button 
            className={`google-signin-btn ${loading ? 'loading' : ''}`}
            onClick={handleLogin}
            disabled={loading}
          >
            <div className="google-icon-wrapper">
              <svg viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            <ArrowRight className="arrow-icon" size={18} />
          </button>
          
          <button 
            className="mock-signin-btn"
            onClick={() => {
              // Creating a mock user and fake JWT token matching our backend decoding logic
              const mockUser = {
                uid: 'GvxV9VvAIcW3bD1u3CkioAyXn5Y2',
                displayName: 'Jaymin',
                email: 'jaymin@example.com'
              };
              // Mock base64 encoded payload
              const payload = btoa(JSON.stringify({
                user_id: mockUser.uid,
                name: mockUser.displayName,
                email: mockUser.email
              }));
              const mockToken = `header.${payload}.signature`;
              onLogin(mockUser, mockToken);
            }}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Bypass Login for Testing
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="login-footer">
          <div className="security-note">
            <Shield size={14} />
            Secure Authentication by Firebase
          </div>
          <p>© 2024 AI Interviewer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
