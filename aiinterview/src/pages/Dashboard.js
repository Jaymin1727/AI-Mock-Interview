import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Play, Clock, Award, Star } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const stats = [
    { label: 'Total Interviews', value: '12', icon: Play, color: '#8b5cf6' },
    { label: 'Avg. Score', value: '84%', icon: Award, color: '#3b82f6' },
    { label: 'Time Spent', value: '4.5h', icon: Clock, color: '#d946ef' },
    { label: 'Success Rate', value: '92%', icon: Star, color: '#10b981' },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Welcome back, {user?.displayName?.split(' ')[0] || 'User'}! 👋</h1>
          <p>You're doing great. Ready for your next mock interview?</p>
        </div>
        <Button className="cta-btn" size="lg">
          <Play size={20} fill="currentColor" />
          Start New Interview
        </Button>
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
                <span className="stat-value">{stat.value}</span>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="dashboard-content">
        <div className="main-section">
          <h2>Recent Interviews</h2>
          <div className="recent-list">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="interview-item">
                <div className="interview-info">
                  <div className="role-icon">💼</div>
                  <div>
                    <h4>Senior Frontend Developer</h4>
                    <span>Software Engineering • 2 days ago</span>
                  </div>
                </div>
                <div className="interview-score">
                  <div className="score-circle">
                    <span>8{i}</span>
                  </div>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </Card>
            ))}
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
            <Button variant="outline" size="sm">Learn More</Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
