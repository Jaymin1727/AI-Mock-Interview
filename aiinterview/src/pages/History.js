import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, Search, Filter, ExternalLink, MoreVertical } from 'lucide-react';
import { getHistory, getInterviewResult } from '../services/api';
import './History.css';

const History = ({ onViewResult }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getHistory(page, 10);
      setHistoryData(response.data.data.history || response.data.data.interviews || []);
      setTotalPages(response.data.data.pages || 1);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (item) => {
    try {
      const response = await getInterviewResult(item.id);
      onViewResult(response.data.data.interview);
    } catch (error) {
      console.error("Failed to fetch detailed result:", error);
    }
  };

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
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading history...</td>
                </tr>
              ) : historyData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No interviews found.</td>
                </tr>
              ) : historyData.map((item) => (
                <tr key={item.id}>
                  <td className="role-cell">
                    <div className="role-icon-small">💼</div>
                    <span>{item.role}</span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>{item.duration ? `${Math.round(item.duration / 60)}m` : '-'}</td>
                  <td>
                    {item.overallScore !== null ? (
                      <div className="score-badge" style={{ backgroundColor: `${getScoreColor(item.overallScore)}15`, color: getScoreColor(item.overallScore) }}>
                        {item.overallScore}%
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className="status-badge" style={{
                      background: item.status === 'completed' ? '#10b98122' : '#3b82f622',
                      color: item.status === 'completed' ? '#10b981' : '#3b82f6'
                    }}>{item.status}</span>
                  </td>
                  <td className="action-cell">
                    {item.status === 'completed' && (
                      <Button variant="ghost" size="sm" onClick={() => handleViewResult(item)}>
                        <ExternalLink size={16} />
                        View Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="table-footer">
          <p>Showing {historyData.length} results</p>
          <div className="pagination">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" className="active-page">{page}</Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default History;
