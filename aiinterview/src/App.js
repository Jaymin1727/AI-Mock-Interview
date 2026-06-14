import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Result from './pages/Result';
import History from './pages/History';
import MainLayout from './layouts/MainLayout';
import Loader from './components/ui/Loader';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user, token) => {
    setUser(user);
    console.log("Logged in with token:", token);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setActivePage('dashboard');
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const startInterview = () => {
    setActivePage('interview');
  };

  const finishInterview = (answers) => {
    setInterviewData(answers);
    setActivePage('result');
  };

  const viewHistoryDetail = (item) => {
    console.log("Viewing details for:", item);
    setActivePage('result');
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" text="Setting up your environment..." />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <MainLayout 
      user={user} 
      activePage={activePage} 
      setActivePage={setActivePage}
      onSignOut={handleSignOut}
    >
      {activePage === 'dashboard' && <Dashboard user={user} onStart={startInterview} />}
      {activePage === 'interview' && <Interview onFinish={finishInterview} />}
      {activePage === 'result' && <Result results={interviewData} onRestart={startInterview} />}
      {activePage === 'history' && <History onViewResult={viewHistoryDetail} />}
      
      {activePage === 'settings' && (
        <div className="flex-center" style={{ minHeight: '400px' }}>
          <h2>Settings coming soon</h2>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
