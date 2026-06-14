package com.aimock.interview.controller;

import com.aimock.interview.model.Interview;
import com.aimock.interview.model.User;
import com.aimock.interview.repository.UserRepository;
import com.aimock.interview.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/interview")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<Interview> startInterview(@RequestBody Map<String, String> request) {
        String firebaseId = request.get("firebaseId");
        String role = request.getOrDefault("role", "General Developer");
        
        User user = userRepository.findByFirebaseId(firebaseId).orElseThrow();
        Interview interview = interviewService.startInterview(user, role);
        return ResponseEntity.ok(interview);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Interview> submitAnswer(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Long questionId = Long.parseLong(request.get("questionId"));
        String answer = request.get("answer");
        Interview interview = interviewService.submitAnswer(questionId, answer);
        return ResponseEntity.ok(interview);
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<Interview> finishInterview(@PathVariable Long id) {
        Interview interview = interviewService.finishInterview(id);
        return ResponseEntity.ok(interview);
    }

    @GetMapping("/history/{firebaseId}")
    public ResponseEntity<List<Interview>> getHistory(@PathVariable String firebaseId) {
        User user = userRepository.findByFirebaseId(firebaseId).orElseThrow();
        List<Interview> history = interviewService.getHistory(user);
        return ResponseEntity.ok(history);
    }
}
