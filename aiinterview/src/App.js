import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setAuthToken, verifyAuth } from './services/api';
import Login from './components/Login/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Result from './pages/Result';
import History from './pages/History';
import Settings from './pages/Settings';
import MainLayout from './layouts/MainLayout';
import Loader from './components/ui/Loader';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setAuthToken(token);
          // Optional: Verify with backend
          await verifyAuth();
          setUser(currentUser);
        } catch (error) {
          console.error("Auth verification failed", error);
          setUser(null);
        }
      } else {
        setUser(null);
        setAuthToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (user, token) => {
    try {
      setAuthToken(token);
      await verifyAuth();
      setUser(user);
      console.log("Logged in securely");
    } catch (error) {
      console.error("Backend auth failed", error);
      auth.signOut();
    }
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

  const startInterview = (topic) => {
    setActivePage('interview');
    setInterviewData({ topic }); // Store topic temporarily
  };

  const finishInterview = (answers) => {
    setInterviewData(answers);
    setActivePage('result');
  };

  const viewHistoryDetail = (item) => {
    console.log("Viewing details for:", item);
    setInterviewData(item);
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
      {activePage === 'dashboard' && <Dashboard user={user} onStart={startInterview} onViewResult={viewHistoryDetail} />}
      {activePage === 'interview' && <Interview topic={interviewData?.topic} onFinish={finishInterview} />}
      {activePage === 'result' && <Result results={interviewData} onRestart={() => setActivePage('dashboard')} />}
      {activePage === 'history' && <History onViewResult={viewHistoryDetail} />}
      
      {activePage === 'settings' && <Settings user={user} />}
    </MainLayout>
  );
}

export default App;
