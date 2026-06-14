import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { Target, MessageSquare, ArrowRight, Download, CircleAlert } from 'lucide-react';
import './Result.css';

const Result = ({ results, onRestart }) => {
  // Mock data for charts
  const performanceData = [
    { subject: 'Communication', A: 85, fullMark: 100 },
    { subject: 'Technical', A: 70, fullMark: 100 },
    { subject: 'Confidence', A: 90, fullMark: 100 },
    { subject: 'Problem Solving', A: 75, fullMark: 100 },
    { subject: 'Clarity', A: 80, fullMark: 100 },
  ];

  const scoreData = [
    { name: 'Q1', score: 85 },
    { name: 'Q2', score: 72 },
    { name: 'Q3', score: 94 },
    { name: 'Q4', score: 88 },
  ];

  return (
    <div className="result-page">
      <header className="result-header">
        <div className="result-title">
          <div className="trophy-icon">🏆</div>
          <div>
            <h1>Interview Analysis Completed</h1>
            <p>Great job! You've successfully completed the mock interview for <strong>Senior Frontend Developer</strong>.</p>
          </div>
        </div>
        <div className="header-actions">
          <Button variant="outline"><Download size={18} /> Export PDF</Button>
          <Button onClick={onRestart}>Try Again <ArrowRight size={18} /></Button>
        </div>
      </header>

      <section className="score-overview">
        <Card className="total-score-card glass">
          <div className="score-ring">
            <svg viewBox="0 0 100 100">
              <circle className="ring-bg" cx="50" cy="50" r="45" />
              <circle className="ring-fill" cx="50" cy="50" r="45" style={{ strokeDashoffset: 282.7 * (1 - 0.84) }} />
            </svg>
            <div className="score-text">
              <span className="big-score">84</span>
              <span className="max-score">/100</span>
            </div>
          </div>
          <div className="score-label">
            <h3>Overall Score</h3>
            <p>Exceptional performance</p>
          </div>
        </Card>

        <Card className="performance-chart-card">
          <h3>Skill Assessment</h3>
          <div className="radar-container">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <div className="analysis-grid">
        <div className="feedback-section">
          <h2>AI Detailed Feedback</h2>
          <div className="feedback-blocks">
            <Card className="feedback-block strength">
              <div className="block-header">
                <Target color="#10b981" />
                <h3>Key Strengths</h3>
              </div>
              <ul>
                <li>Excellent use of the STAR method in behavioral questions.</li>
                <li>Strong articulation of technical architectural decisions.</li>
                <li>High level of professional confidence and clarity.</li>
              </ul>
            </Card>

            <Card className="feedback-block weakness">
              <div className="block-header">
                <CircleAlert color="#f59e0b" />
                <h3>Areas for Improvement</h3>
              </div>
              <ul>
                <li>Could provide more specific metrics for past accomplishments.</li>
                <li>Ensure technical explanations don't get too bogged down in trivia.</li>
                <li>Work on simplifying complex concepts for non-technical stakeholders.</li>
              </ul>
            </Card>

            <Card className="feedback-block suggestion">
              <div className="block-header">
                <MessageSquare color="var(--primary)" />
                <h3>Expert Suggestions</h3>
              </div>
              <p>
                "Practice elaborating on your 'Result' phase of the STAR method with quantifiable impact (e.g., 'reduced load time by 40%'). This adds weight to your experience."
              </p>
            </Card>
          </div>
        </div>

        <div className="visualization-section">
          <h2>Score Trends</h2>
          <Card className="trend-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                />
                <Bar 
                  dataKey="score" 
                  fill="var(--gradient-primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="chart-note">Individual question score performance analysis.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Result;
