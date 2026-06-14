package com.aimock.interview.service;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class AIService {
    
    private final String[] strengths = {
        "Excellent use of the STAR method.",
        "Clear and concise technical explanation.",
        "High degree of confidence exhibited.",
        "Strong focus on problem-solving impact."
    };
    
    private final String[] weaknesses = {
        "Could provide more specific metrics for success.",
        "Technical explanations were slightly too verbose.",
        "Ensure better pacing in complex answers.",
        "Try to link past experiences more directly to the role requirements."
    };

    public Integer evaluateAnswer(String question, String answer) {
        // Mock evaluation logic
        if (answer == null || answer.trim().isEmpty()) return 0;
        return new Random().nextInt(40) + 60; // Return score between 60-100
    }

    public String generateFeedback(String question, String answer) {
        // Mock feedback generation
        Random rand = new Random();
        return "Strength: " + strengths[rand.nextInt(strengths.length)] + 
               " | Improvement: " + weaknesses[rand.nextInt(weaknesses.length)];
    }
}
