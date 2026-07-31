package com.aiinterview.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.service-account-path:src/main/resources/firebase-service-account.json}")
    private String serviceAccountPath;

    @Value("${firebase.project-id:ai-interview-5d5c5}")
    private String projectId;

    @Value("${FIREBASE_SERVICE_ACCOUNT_JSON:}")
    private String serviceAccountJson;

    @Bean
    public FirebaseApp firebaseApp() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        InputStream serviceAccount = null;

        try {
            // 1. Check if JSON string is passed via environment variable
            if (serviceAccountJson != null && !serviceAccountJson.trim().isEmpty()) {
                logger.info("Loading Firebase credentials from FIREBASE_SERVICE_ACCOUNT_JSON env var");
                serviceAccount = new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8));
            }

            // 2. Try loading from classpath
            if (serviceAccount == null) {
                serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
                if (serviceAccount != null) {
                    logger.info("Loading Firebase credentials from classpath");
                }
            }

            // 3. Fallback: load from filesystem path if file exists
            if (serviceAccount == null && serviceAccountPath != null) {
                File file = new File(serviceAccountPath);
                if (file.exists()) {
                    logger.info("Loading Firebase credentials from file path: {}", serviceAccountPath);
                    serviceAccount = new FileInputStream(file);
                }
            }

            GoogleCredentials credentials = null;
            if (serviceAccount != null) {
                credentials = GoogleCredentials.fromStream(serviceAccount);
            } else {
                logger.warn("⚠️ No Firebase service account JSON found. Attempting default credentials.");
                try {
                    credentials = GoogleCredentials.getApplicationDefault();
                } catch (Exception ex) {
                    logger.warn("Default Google credentials not available.");
                }
            }

            FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                    .setProjectId(projectId);

            if (credentials != null) {
                optionsBuilder.setCredentials(credentials);
            }

            return FirebaseApp.initializeApp(optionsBuilder.build());
        } catch (Exception e) {
            logger.error("⚠️ Firebase initialization warning: {}", e.getMessage());
            try {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setProjectId(projectId)
                        .build();
                return FirebaseApp.initializeApp(options);
            } catch (Exception ex) {
                logger.error("Could not initialize minimal FirebaseApp: {}", ex.getMessage());
                return null;
            }
        }
    }
}
