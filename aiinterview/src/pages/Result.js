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
  if (!results || !results.result) {
    return <div className="result-page flex-center"><h3>Loading results...</h3></div>;
  }

  const { result, questions } = results;

  // Formatting data for charts
  const performanceData = [
    { subject: 'Communication', A: result.communicationScore, fullMark: 100 },
    { subject: 'Technical', A: result.technicalScore, fullMark: 100 },
    { subject: 'Confidence', A: result.confidenceScore, fullMark: 100 },
    { subject: 'Problem Solving', A: result.problemSolvingScore, fullMark: 100 },
    { subject: 'Clarity', A: result.clarityScore, fullMark: 100 },
  ];

  const scoreData = questions.map((q, i) => ({
    name: `Q${i+1}`,
    score: q.score || 0
  }));

  return (
    <div className="result-page">
      <header className="result-header">
        <div className="result-title">
          <div className="trophy-icon">🏆</div>
          <div>
            <h1>Interview Analysis Completed</h1>
            <p>Great job! You've successfully completed the mock interview.</p>
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
              <circle className="ring-fill" cx="50" cy="50" r="45" style={{ strokeDashoffset: 282.7 * (1 - result.overallScore / 100) }} />
            </svg>
            <div className="score-text">
              <span className="big-score">{result.overallScore}</span>
              <span className="max-score">/100</span>
            </div>
          </div>
          <div className="score-label">
            <h3>Overall Score</h3>
            <p>{result.overallScore >= 80 ? 'Exceptional performance' : result.overallScore >= 60 ? 'Good performance' : 'Needs improvement'}</p>
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
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Card>

            <Card className="feedback-block weakness">
              <div className="block-header">
                <CircleAlert color="#f59e0b" />
                <h3>Areas for Improvement</h3>
              </div>
              <ul>
                {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </Card>

            <Card className="feedback-block suggestion">
              <div className="block-header">
                <MessageSquare color="var(--primary)" />
                <h3>Expert Suggestions</h3>
              </div>
              <p>"{result.suggestions}"</p>
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
