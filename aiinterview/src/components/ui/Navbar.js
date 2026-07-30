import React, { useState, useEffect } from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user, onSignOut }) => {
  const photoKey = user?.uid ? `userProfilePhoto_${user.uid}` : 'userProfilePhoto';
  const [localPhoto, setLocalPhoto] = useState(localStorage.getItem(photoKey));

  useEffect(() => {
    const handleStorageChange = () => {
      setLocalPhoto(localStorage.getItem(photoKey));
    };
    
    // Call it immediately in case user prop changes and we need to refresh
    handleStorageChange();

    window.addEventListener('profilePhotoUpdate', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('profilePhotoUpdate', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [photoKey]);

  const displayPhoto = localPhoto || user?.photoURL;

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <h1 className="text-gradient">AI Mock Interview</h1>
      </div>
      
      <div className="navbar-actions">
        <button className="icon-btn" onClick={() => alert('Notifications coming soon!')}>
          <Bell size={20} />
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.displayName || 'User'}</span>
            <span className="user-role">Candidate</span>
          </div>
          <div className="avatar">
            {displayPhoto ? (
              <img src={displayPhoto} alt="profile" />
            ) : (
              <User size={24} />
            )}
          </div>
        </div>
        
        <button className="logout-btn" onClick={onSignOut}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
