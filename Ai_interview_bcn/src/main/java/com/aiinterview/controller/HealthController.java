package com.aiinterview.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * GET /api/health
     * Public health check — no authentication required.
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "AI Interview Backend",
            "timestamp", LocalDateTime.now().toString()
        ));
    }

    /**
     * GET /api/dashboard/stats
     * Returns dashboard statistics for authenticated user.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> dashboardStats(@AuthenticationPrincipal String uid) {
        // TODO: Fetch real stats from Supabase
        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "totalInterviews", 0,
                "avgScore", "0%",
                "timeSpent", "0m",
                "successRate", "0%"
            )
        ));
    }

    /**
     * GET /api/dashboard/recent
     * Returns recent interview sessions for authenticated user.
     */
    @GetMapping("/dashboard/recent")
    public ResponseEntity<?> recentInterviews(@AuthenticationPrincipal String uid) {
        // TODO: Fetch real recent interviews from Supabase
        return ResponseEntity.ok(Map.of(
            "data", Map.of(
                "interviews", new Object[0]
            )
        ));
    }
}
