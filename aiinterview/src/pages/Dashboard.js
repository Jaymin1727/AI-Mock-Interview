import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Play, Clock, Award, Star } from 'lucide-react';
import { getDashboardStats, getRecentInterviews, getInterviewResult } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, onStart, onViewResult }) => {
  const [statsData, setStatsData] = useState({
    totalInterviews: 0,
    avgScore: '0%',
    timeSpent: '0m',
    successRate: '0%'
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState('React');

  const handleViewDetails = async (interview) => {
    try {
      const response = await getInterviewResult(interview.id);
      if (onViewResult) onViewResult(response.data.data.interview);
    } catch (error) {
      console.error("Failed to fetch detailed result:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          getDashboardStats(),
          getRecentInterviews()
        ]);
        
        setStatsData(statsRes.data.data);
        setRecentInterviews(recentRes.data.data.interviews);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Total Interviews', value: statsData.totalInterviews, icon: Play, color: '#8b5cf6' },
    { label: 'Avg. Score', value: statsData.avgScore, icon: Award, color: '#3b82f6' },
    { label: 'Time Spent', value: statsData.timeSpent, icon: Clock, color: '#d946ef' },
    { label: 'Success Rate', value: statsData.successRate, icon: Star, color: '#10b981' },
  ];

  const topics = ['React', 'Spring Boot', 'DBMS', 'Computer Networks', 'OOPs', 'System Design', 'General HR Discussion'];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Welcome back, {user?.displayName?.split(' ')[0] || 'User'}! 👋</h1>
          <p>You're doing great. Ready for your next mock interview?</p>
        </div>
        
        <div className="start-action-container" style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
          <select 
            value={selectedTopic} 
            onChange={(e) => setSelectedTopic(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', background: '#1e1e2d', color: 'white', border: '1px solid #333' }}
          >
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Button className="cta-btn" size="lg" onClick={() => onStart(selectedTopic)}>
            <Play size={20} fill="currentColor" />
            Start New Interview
          </Button>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{loading ? '-' : stat.value}</span>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="dashboard-content">
        <div className="main-section">
          <h2>Recent Interviews</h2>
          <div className="recent-list">
            {loading ? (
              <p>Loading recent interviews...</p>
            ) : recentInterviews.length === 0 ? (
              <p>No interviews yet. Start one today!</p>
            ) : (
              recentInterviews.map((interview) => (
                <Card key={interview.id} className="interview-item">
                  <div className="interview-info">
                    <div className="role-icon">💼</div>
                    <div>
                      <h4>{interview.role}</h4>
                      <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="interview-score">
                    {interview.status === 'completed' ? (
                      <div className="score-circle">
                        <span>{interview.overallScore}</span>
                      </div>
                    ) : (
                      <span className="status-badge" style={{marginRight: '1rem', background: '#3b82f622', color: '#3b82f6', padding: '4px 8px', borderRadius: '12px', fontSize: '12px'}}>{interview.status}</span>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(interview)}>View Details</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="side-section">
          <Card className="ai-tip-card glass">
            <h3>AI Tip of the Day 💡</h3>
            <p>
              "When answering behavioral questions, use the STAR method (Situation, Task, Action, Result) to provide structured and impactful responses."
            </p>
          </Card>
          
          <Card className="upgrade-teaser">
            <h4>Unlock Advanced Analysis</h4>
            <p>Get detailed feedback on your body language and tone.</p>
            <Button variant="outline" size="sm" onClick={() => alert('Advanced Analysis coming soon!')}>Learn More</Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
