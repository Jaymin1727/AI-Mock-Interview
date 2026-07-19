import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Mic, Timer, CircleAlert } from 'lucide-react';
import { startInterview, submitAnswer, finishInterview } from '../services/api';
import './Interview.css';

const Interview = ({ topic = "Software Engineering", onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total
  const [isListening, setIsListening] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const totalQuestions = 5;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Interview
  useEffect(() => {
    const initInterview = async () => {
      try {
        const response = await startInterview(topic);
        setInterviewId(response.data.data.interviewId);
        
        // Parse the first question string returned by Gemini
        let firstQ;
        try {
            firstQ = JSON.parse(response.data.data.firstQuestion);
        } catch(e) {
            firstQ = { questionText: response.data.data.firstQuestion, difficulty: "Medium", description: "Standard interview covering fundamental concepts." };
        }
        setQuestions([firstQ]);
        if (firstQ.description) {
          setShowIntro(true);
        }
      } catch (error) {
        console.error("Failed to start interview:", error);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, []);

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setAnswers((prev) => {
            const currentAnswer = prev[currentQuestion] || '';
            return {
              ...prev,
              [currentQuestion]: currentAnswer + (currentAnswer ? ' ' : '') + finalTranscript
            };
          });
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentQuestion]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: e.target.value
    });
  };

  const nextQuestion = async () => {
    const answerText = answers[currentQuestion];
    if (!answerText) return;

    setSubmitting(true);
    try {
      const isLast = currentQuestion === totalQuestions - 1;
      const currentQ = questions[currentQuestion];
      
      const response = await submitAnswer(
        interviewId, 
        topic, 
        currentQ.questionText, 
        answerText, 
        currentQ.difficulty || "Medium", 
        isLast
      );
      
      // Parse result
      let resultData;
      try {
        resultData = JSON.parse(response.data.data.result);
      } catch(e) {
        resultData = {};
        console.error("Failed to parse evaluation result", e);
      }

      setEvaluations(prev => ({
        ...prev,
        [currentQuestion]: resultData.evaluation
      }));

      if (isLast) {
        submitInterviewSession();
      } else if (resultData.nextQuestion) {
        setQuestions(prev => [...prev, resultData.nextQuestion]);
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitInterviewSession = async () => {
    setSubmitting(true);
    try {
      const duration = 600 - timeLeft;
      const response = await finishInterview(interviewId, duration);
      
      // Calculate overall score (average of all question scores * 10)
      const scores = Object.values(evaluations).map(e => e.score || 0);
      const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const overallScore = Math.round(avgScore * 10);

      onFinish({ 
        result: {
          overallScore: overallScore,
          communicationScore: Math.min(100, overallScore + 5),
          technicalScore: Math.min(100, overallScore - 2),
          confidenceScore: Math.min(100, overallScore + 8),
          problemSolvingScore: Math.min(100, overallScore),
          clarityScore: Math.min(100, overallScore + 2),
          strengths: Object.values(evaluations).map(e => e.strengths).filter(Boolean).slice(0, 3), // Max 3
          weaknesses: Object.values(evaluations).map(e => e.improvements).filter(Boolean).slice(0, 3),
          suggestions: "Adaptive difficulty adjusted questions based on your performance. Focus on your areas of improvement to increase your average score in future interviews!"
        },
        questions: questions.map((q, i) => ({ 
          ...q, 
          score: (evaluations[i]?.score || 0) * 10 
        }))
      }); 
    } catch (error) {
      console.error("Failed to finish interview:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="interview-page flex-center"><h3>Generating first question via AI...</h3></div>;
  }

  if (questions.length === 0) {
    return <div className="interview-page flex-center"><h3>Error loading question.</h3></div>;
  }

  const progress = ((currentQuestion) / totalQuestions) * 100;

  if (showIntro) {
    return (
      <div className="interview-page flex-center">
        <Card className="intro-card" hover={false} style={{ maxWidth: '650px', padding: '2rem', background: '#1e1e2d', color: '#ffffff' }}>
          <h2>{topic} Interview</h2>
          
          <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#2a2a3c', borderRadius: '8px', border: '1px solid #3f3f5a' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#94a3b8' }}>Syllabus & Details</h4>
            <p style={{ lineHeight: '1.6', color: '#e2e8f0', fontSize: '15px', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
              {questions[0]?.description || "In this session, you will be tested on core concepts, practical applications, and problem-solving skills related to this topic."}
            </p>
            
            {questions[0]?.importantNotes && questions[0].importantNotes.length > 0 && (
              <>
                <h4 style={{ marginBottom: '0.5rem', color: '#94a3b8', marginTop: '1rem' }}>Key Topics to Know</h4>
                <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8' }}>
                  {questions[0].importantNotes.map((note, index) => (
                    <li key={index} style={{ marginBottom: '1rem' }}>{note}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <Button onClick={() => setShowIntro(false)} style={{ width: '100%', padding: '1rem', fontWeight: 'bold' }}>
            Start First Question <ChevronRight size={20} />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="interview-page">
      <div className="interview-layout">
        {/* Header with Stats */}
        <div className="interview-header">
          <div className="interview-meta">
            <span className="badge">{topic} Interview</span>
            <div className="timer-display">
              <Timer size={18} />
              <span className={timeLeft < 60 ? 'timer-warning' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-label">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <Card className="question-card" hover={false}>
          <div className="question-number" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            {questions[currentQuestion].difficulty && (
              <span style={{
                background: questions[currentQuestion].difficulty === 'Hard' ? '#ef444422' : 
                            questions[currentQuestion].difficulty === 'Medium' ? '#f59e0b22' : '#10b98122',
                color: questions[currentQuestion].difficulty === 'Hard' ? '#ef4444' : 
                       questions[currentQuestion].difficulty === 'Medium' ? '#f59e0b' : '#10b981',
                padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
              }}>
                {questions[currentQuestion].difficulty}
              </span>
            )}
          </div>
          <h2 className="question-text">{questions[currentQuestion].questionText}</h2>
          
          {questions[currentQuestion].hint && (
            <div className="hint-box">
              <CircleAlert size={16} />
              <p>{questions[currentQuestion].hint}</p>
            </div>
          )}

          <div className="answer-area">
            <textarea
              placeholder="Type your answer here..."
              value={answers[currentQuestion] || ''}
              onChange={handleAnswerChange}
              disabled={submitting}
            />
            <button 
              className={`voice-btn ${isListening ? 'active' : ''}`} 
              title={isListening ? "Stop Listening" : "Start Voice Input"}
              onClick={toggleListening}
              disabled={submitting}
            >
              <Mic size={24} />
              {isListening && <span className="listening-pulse"></span>}
            </button>
          </div>

          <div className="interview-nav">
            <Button 
              variant="outline" 
              onClick={prevQuestion}
              disabled={currentQuestion === 0 || submitting}
            >
              <ChevronLeft size={20} />
              Previous
            </Button>
            
            <div className="nav-dots">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div 
                  key={i} 
                  className={`dot ${i === currentQuestion ? 'active' : ''} ${i < questions.length - 1 ? 'filled' : ''}`}
                />
              ))}
            </div>

            <Button 
              onClick={nextQuestion} 
              disabled={submitting || (currentQuestion === questions.length - 1 && !answers[currentQuestion])}
            >
              {submitting ? 'Evaluating...' : (currentQuestion === totalQuestions - 1 ? 'Finish Interview' : (currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit & Next'))}
              {!submitting && <ChevronRight size={20} />}
            </Button>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="interview-footer">
          <Button variant="ghost" className="quit-btn">Quit Session</Button>
          <p className="footer-note">Your answers are automatically saved when you navigate.</p>
        </div>
      </div>
    </div>
  );
};

export default Interview;
