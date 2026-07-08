import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Mic, Timer, CircleAlert } from 'lucide-react';
import { startInterview, submitAnswer, finishInterview } from '../services/api';
import './Interview.css';

const Interview = ({ onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total
  const [isListening, setIsListening] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Interview
  useEffect(() => {
    const initInterview = async () => {
      try {
        const response = await startInterview("Senior Frontend Developer"); // Could be dynamic
        setInterviewId(response.data.data.interview.id);
        setQuestions(response.data.data.questions);
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

  const saveCurrentAnswer = async () => {
    const answerText = answers[currentQuestion];
    if (answerText && interviewId && questions[currentQuestion]) {
      try {
        await submitAnswer(interviewId, questions[currentQuestion].id, answerText);
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    }
  };

  const nextQuestion = async () => {
    await saveCurrentAnswer();
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitInterviewSession();
    }
  };

  const prevQuestion = async () => {
    await saveCurrentAnswer();
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitInterviewSession = async () => {
    setSubmitting(true);
    try {
      const duration = 600 - timeLeft;
      const response = await finishInterview(interviewId, duration);
      onFinish(response.data.data); // Pass full result to App
    } catch (error) {
      console.error("Failed to finish interview:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="interview-page flex-center"><h3>Generating tailored questions via AI...</h3></div>;
  }

  if (questions.length === 0) {
    return <div className="interview-page flex-center"><h3>Error loading questions.</h3></div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="interview-page">
      <div className="interview-layout">
        {/* Header with Stats */}
        <div className="interview-header">
          <div className="interview-meta">
            <span className="badge">Frontend Developer Role</span>
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
          <div className="question-number">
            Question {currentQuestion + 1} of {questions.length}
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
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`dot ${i === currentQuestion ? 'active' : ''} ${answers[i] ? 'filled' : ''}`}
                />
              ))}
            </div>

            <Button onClick={nextQuestion} disabled={submitting}>
              {submitting ? 'Evaluating...' : (currentQuestion === questions.length - 1 ? 'Finish Interview' : 'Next Question')}
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
