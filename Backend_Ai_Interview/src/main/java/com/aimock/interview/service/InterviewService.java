package com.aimock.interview.service;

import com.aimock.interview.model.Interview;
import com.aimock.interview.model.Question;
import com.aimock.interview.model.User;
import com.aimock.interview.repository.InterviewRepository;
import com.aimock.interview.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AIService aiService;

    public Interview startInterview(User user, String jobRole) {
        Interview interview = new Interview();
        interview.setUser(user);
        interview.setJobRole(jobRole);
        interview.setStartTime(LocalDateTime.now());
        interview.setStatus("IN_PROGRESS");
        
        List<Question> questions = generateQuestions(interview);
        interview.setQuestions(questions);
        
        return interviewRepository.save(interview);
    }

    private List<Question> generateQuestions(Interview interview) {
        List<Question> questions = new ArrayList<>();
        String[] mockQuestions = {
            "Can you tell me about a time you handled a difficult situation with a colleague?",
            "What are your greatest professional strengths?",
            "Why should we hire you for this role?",
            "Where do you see yourself in five years?"
        };

        for (String qText : mockQuestions) {
            Question q = new Question();
            q.setText(qText);
            q.setInterview(interview);
            questions.add(q);
        }
        return questions;
    }

    public Interview submitAnswer(Long questionId, String answer) {
        Question question = questionRepository.findById(questionId).orElseThrow();
        question.setAnswer(answer);
        
        // Use AI to evaluate
        Integer score = aiService.evaluateAnswer(question.getText(), answer);
        String feedback = aiService.generateFeedback(question.getText(), answer);
        
        question.setScore(score);
        question.setFeedback(feedback);
        questionRepository.save(question);
        
        return question.getInterview();
    }

    public Interview finishInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId).orElseThrow();
        interview.setEndTime(LocalDateTime.now());
        interview.setStatus("COMPLETED");
        
        // Calculate overall score
        double avgScore = interview.getQuestions().stream()
                .filter(q -> q.getScore() != null)
                .mapToInt(Question::getScore)
                .average()
                .orElse(0.0);
        
        interview.setOverallScore((int) avgScore);
        return interviewRepository.save(interview);
    }

    public List<Interview> getHistory(User user) {
        return interviewRepository.findByUserOrderByStartTimeDesc(user);
    }
}
