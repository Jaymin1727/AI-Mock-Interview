package com.aimock.interview.controller;

import com.aimock.interview.model.User;
import com.aimock.interview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/google")
    public ResponseEntity<User> googleSignIn(@RequestBody User userRequest) {
        // In a real app, verify the Firebase token here. 
        // For now, we take the user details from the request.
        Optional<User> existingUser = userRepository.findByFirebaseId(userRequest.getFirebaseId());
        
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        } else {
            User newUser = userRepository.save(userRequest);
            return ResponseEntity.ok(newUser);
        }
    }
}
