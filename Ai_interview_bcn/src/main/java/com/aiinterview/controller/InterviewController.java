package com.aiinterview.controller;

import com.aiinterview.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private GeminiService geminiService;

    /**
     * POST /api/interviews/start
     * Starts an interview session for the given topic and returns the first question.
     */
    @PostMapping("/start")
    public ResponseEntity<?> startInterview(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal String uid
    ) {
        String topic = body.getOrDefault("topic", "Software Engineering");
        String firstQuestionJson = geminiService.generateFirstQuestion(topic);

        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "userId", uid,
                "topic", topic,
                "firstQuestion", firstQuestionJson,
                "interviewId", java.util.UUID.randomUUID().toString()
            )
        ));
    }

    /**
     * POST /api/interviews/{interviewId}/answer
     * Submits an answer to an interview question for evaluation and gets the next question.
     */
    @PostMapping("/{interviewId}/answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable String interviewId,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal String uid
    ) {
        String topic = (String) body.get("topic");
        String question = (String) body.get("question");
        String answer = (String) body.get("answer");
        String currentDifficulty = (String) body.getOrDefault("currentDifficulty", "Medium");
        boolean isLastQuestion = (boolean) body.getOrDefault("isLastQuestion", false);

        String evaluationAndNextJson = geminiService.evaluateAndGenerateNext(topic, question, answer, currentDifficulty, isLastQuestion);

        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "interviewId", interviewId,
                "result", evaluationAndNextJson
            )
        ));
    }

    /**
     * POST /api/interviews/{interviewId}/finish
     * Finalizes the interview session.
     */
    @PostMapping("/{interviewId}/finish")
    public ResponseEntity<?> finishInterview(
            @PathVariable String interviewId,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal String uid
    ) {
        long duration = ((Number) body.getOrDefault("duration", 0)).longValue();
        return ResponseEntity.ok(Map.of(
            "interviewId", interviewId,
            "userId", uid,
            "duration", duration,
            "status", "completed",
            "message", "Interview session completed successfully"
        ));
    }
}
