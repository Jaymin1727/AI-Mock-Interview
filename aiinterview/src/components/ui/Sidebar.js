import React from 'react';
import { LayoutDashboard, PlayCircle, History, Settings, HelpCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview', label: 'Start Interview', icon: PlayCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="sidebar glass">
      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={22} />
              <span>{item.label}</span>
              {activePage === item.id && <div className="active-indicator" />}
            </button>
          );
        })}
      </div>
      
      <div className="sidebar-footer">
        <div className="pro-card">
          <h4>Upgrade to Pro</h4>
          <p>Get unlimited interview sessions and advanced AI feedback.</p>
          <button className="upgrade-btn" onClick={() => alert('Pro upgrade coming soon!')}>Go Pro</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
