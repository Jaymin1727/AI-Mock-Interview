import React from 'react';
import Navbar from '../components/ui/Navbar';
import Sidebar from '../components/ui/Sidebar';
import './MainLayout.css';

const MainLayout = ({ user, activePage, setActivePage, onSignOut, children }) => {
  return (
    <div className="main-layout">
      <Navbar user={user} onSignOut={onSignOut} />
      <div className="layout-body">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="layout-content">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
