package com.aiinterview.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "AI Interview Backend",
            "timestamp", LocalDateTime.now().toString()
        ));
    }
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> dashboardStats(@AuthenticationPrincipal String uid) {
        long count = InterviewController.interviewHistory.stream().filter(i -> uid.equals(i.get("userId"))).count();
        double avgScore = count == 0 ? 0 : InterviewController.interviewHistory.stream()
            .filter(i -> uid.equals(i.get("userId")))
            .mapToDouble(i -> ((Number) i.getOrDefault("overallScore", 0)).doubleValue())
            .average().orElse(0.0);

        long timeSpent = InterviewController.interviewHistory.stream()
            .filter(i -> uid.equals(i.get("userId")))
            .mapToLong(i -> ((Number) i.getOrDefault("duration", 0)).longValue())
            .sum();

        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "totalInterviews", count,
                "avgScore", String.format("%.0f%%", avgScore),
                "timeSpent", (timeSpent / 60) + "m",
                "successRate", String.format("%.0f%%", avgScore)
            )
        ));
    }
    
    @GetMapping("/dashboard/recent")
    public ResponseEntity<?> recentInterviews(@AuthenticationPrincipal String uid) {
        var recent = InterviewController.interviewHistory.stream()
            .filter(i -> uid.equals(i.get("userId")))
            .sorted((a, b) -> ((String)b.get("createdAt")).compareTo((String)a.get("createdAt")))
            .limit(5)
            .toArray();

        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "interviews", recent
            )
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal String uid) {
        var history = InterviewController.interviewHistory.stream()
            .filter(i -> uid.equals(i.get("userId")))
            .sorted((a, b) -> ((String)b.get("createdAt")).compareTo((String)a.get("createdAt")))
            .toArray();
            
        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "history", history
            )
        ));
    }
    
    @GetMapping("/history/{interviewId}/result")
    public ResponseEntity<?> getHistoryResult(@PathVariable String interviewId, @AuthenticationPrincipal String uid) {
        var result = InterviewController.interviewHistory.stream()
            .filter(i -> uid.equals(i.get("userId")) && interviewId.equals(i.get("interviewId")))
            .findFirst();
            
        if (result.isPresent()) {
            return ResponseEntity.ok(Map.of("data", Map.of("interview", result.get())));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
