import React from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user, onSignOut }) => {
  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <h1 className="text-gradient">AI Mock Interview</h1>
      </div>
      
      <div className="navbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.displayName || 'User'}</span>
            <span className="user-role">Candidate</span>
          </div>
          <div className="avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="profile" />
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
