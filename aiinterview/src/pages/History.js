import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, Search, Filter, ExternalLink, MoreVertical } from 'lucide-react';
import './History.css';

const History = ({ onViewResult }) => {
  const historyData = [
    { id: 1, role: 'Senior Frontend Developer', date: 'Oct 24, 2023', score: 84, duration: '24m', status: 'Completed' },
    { id: 2, role: 'Product Designer', date: 'Oct 20, 2023', score: 92, duration: '18m', status: 'Completed' },
    { id: 3, role: 'Backend Engineer (Node.js)', date: 'Oct 15, 2023', score: 76, duration: '30m', status: 'Completed' },
    { id: 4, role: 'React Developer', date: 'Oct 10, 2023', score: 88, duration: '22m', status: 'Completed' },
    { id: 5, role: 'UI/UX Designer', date: 'Sep 28, 2023', score: 95, duration: '15m', status: 'Completed' },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="history-page">
      <header className="history-header">
        <div className="history-title">
          <h1>Interview History</h1>
          <p>Review your past performances and track your progress.</p>
        </div>
        
        <div className="history-filters">
          <div className="search-bar glass">
            <Search size={18} color="var(--text-dim)" />
            <input type="text" placeholder="Search roles..." />
          </div>
          <Button variant="secondary">
            <Filter size={18} />
            Filter
          </Button>
        </div>
      </header>

      <Card className="history-table-card glass" padding={false}>
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Score</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id}>
                  <td className="role-cell">
                    <div className="role-icon-small">💼</div>
                    <span>{item.role}</span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                  </td>
                  <td>{item.duration}</td>
                  <td>
                    <div className="score-badge" style={{ backgroundColor: `${getScoreColor(item.score)}15`, color: getScoreColor(item.score) }}>
                      {item.score}%
                    </div>
                  </td>
                  <td>
                    <span className="status-badge">{item.status}</span>
                  </td>
                  <td className="action-cell">
                    <Button variant="ghost" size="sm" onClick={() => onViewResult(item)}>
                      <ExternalLink size={16} />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="table-footer">
          <p>Showing 5 results</p>
          <div className="pagination">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="active-page">1</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default History;
