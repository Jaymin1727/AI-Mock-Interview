import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Bell, Shield, Moon, Monitor, Sun, Lock, Trash2, Camera } from 'lucide-react';
import './Settings.css';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');
  const [difficulty, setDifficulty] = useState(localStorage.getItem('interviewDifficulty') || 'Medium');
  
  const photoKey = user?.uid ? `userProfilePhoto_${user.uid}` : 'userProfilePhoto';
  const [localPhoto, setLocalPhoto] = useState(localStorage.getItem(photoKey) || null);
  const fileInputRef = React.useRef(null);

  const handleDifficultyChange = (e) => {
    const val = e.target.value;
    setDifficulty(val);
    localStorage.setItem('interviewDifficulty', val);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("File size exceeds 800KB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setLocalPhoto(base64String);
        localStorage.setItem(photoKey, base64String);
        window.dispatchEvent(new Event('profilePhotoUpdate'));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="settings-section animate-fade-in">
            <h3>Profile Information</h3>
            <p className="settings-subtitle">Update your account's profile information and email address.</p>
            
            <div className="profile-edit-form">
              <div className="avatar-section">
                <div className="avatar-large">
                  <img src={localPhoto || user?.photoURL || 'https://via.placeholder.com/150'} alt="Profile" />
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/gif" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handlePhotoUpload} 
                  />
                  <button className="change-avatar-btn" onClick={() => fileInputRef.current.click()}>
                    <Camera size={16} />
                  </button>
                </div>
                <div className="avatar-info">
                  <h4>Profile Picture</h4>
                  <p>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={user?.displayName || 'User'} className="settings-input" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue={user?.email || ''} disabled className="settings-input disabled" />
                <span className="input-hint">Email address cannot be changed.</span>
              </div>
              <Button className="save-btn">Save Changes</Button>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="settings-section animate-fade-in">
            <h3>App Preferences</h3>
            <p className="settings-subtitle">Manage your theme, notifications, and interview settings.</p>
            
            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Theme Selection</h4>
                  <p>Choose how the app looks to you.</p>
                </div>
                <div className="theme-toggle">
                  <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}><Sun size={18} /> Light</button>
                  <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}><Moon size={18} /> Dark</button>
                  <button className={`theme-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => handleThemeChange('system')}><Monitor size={18} /> System</button>
                </div>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h4>Initial Difficulty</h4>
                  <p>Set the starting difficulty for your mock interviews.</p>
                </div>
                <select 
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className="settings-input"
                  style={{ width: '150px', cursor: 'pointer' }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h4>Email Notifications</h4>
                  <p>Receive weekly reports and interview reminders.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="settings-section animate-fade-in">
            <h3>Security & Privacy</h3>
            <p className="settings-subtitle">Manage your security preferences and account data.</p>
            
            <div className="security-options">
              <div className="security-card">
                <div className="security-icon"><Lock size={24} /></div>
                <div className="security-content">
                  <h4>Change Password</h4>
                  <p>Ensure your account is using a long, random password to stay secure.</p>
                  <Button variant="outline" size="sm">Update Password</Button>
                </div>
              </div>

              <div className="security-card danger-zone">
                <div className="security-icon"><Trash2 size={24} /></div>
                <div className="security-content">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all of your interview data.</p>
                  <Button className="delete-btn" size="sm">Delete Account</Button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences.</p>
      </header>

      <div className="settings-container">
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} /> Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Bell size={18} /> Preferences
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} /> Security
            </button>
          </nav>
        </aside>

        <main className="settings-content">
          <Card className="settings-card">
            {renderContent()}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
