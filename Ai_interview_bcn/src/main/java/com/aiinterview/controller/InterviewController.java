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

    public static final java.util.List<Map<String, Object>> interviewHistory = new java.util.concurrent.CopyOnWriteArrayList<>();

    @Autowired
    private GeminiService geminiService;
    @PostMapping("/start")
    public ResponseEntity<?> startInterview(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal String uid
    ) {
        String topic = body.getOrDefault("topic", "Software Engineering");
        String difficulty = body.getOrDefault("difficulty", "Medium");
        String firstQuestionJson = geminiService.generateFirstQuestion(topic, difficulty);

        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "userId", uid,
                "topic", topic,
                "firstQuestion", firstQuestionJson,
                "interviewId", java.util.UUID.randomUUID().toString()
            )
        ));
    }
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
    @PostMapping("/{interviewId}/finish")
    public ResponseEntity<?> finishInterview(
            @PathVariable String interviewId,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal String uid
    ) {
        body.put("interviewId", interviewId);
        body.put("userId", uid);
        body.put("createdAt", java.time.Instant.now().toString());
        body.put("status", "completed");
        
        Map<String, Object> result = (Map<String, Object>) body.get("result");
        if (result != null && result.containsKey("overallScore")) {
            body.put("overallScore", result.get("overallScore"));
        } else {
            body.put("overallScore", 0);
        }
        body.put("role", body.getOrDefault("topic", "Software Engineering"));

        interviewHistory.add(body);

        return ResponseEntity.ok(Map.of(
            "interviewId", interviewId,
            "userId", uid,
            "status", "completed",
            "message", "Interview session completed successfully"
        ));
    }
}
