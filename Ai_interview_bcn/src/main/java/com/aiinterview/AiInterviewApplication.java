package com.aiinterview;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiInterviewApplication {

    public static void main(String[] args) {
        loadEnv();
        SpringApplication.run(AiInterviewApplication.class, args);
    }

    private static void loadEnv() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
            );

            System.out.println("✅ .env file loaded successfully");
        } catch (Exception e) {
            System.out.println("⚠️  .env file not found or could not be loaded: " + e.getMessage());
        }
    }
}
