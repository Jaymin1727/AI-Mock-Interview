package com.aiinterview.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GeminiConfig {

    @Value("${gemini.base-url}")
    private String geminiBaseUrl;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    @Value("${gemini.model}")
    private String geminiModel;

    /**
     * WebClient pre-configured for Gemini API calls.
     * Usage: inject this bean in any service that needs Gemini.
     */
    @Bean(name = "geminiWebClient")
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl(geminiBaseUrl + "/models/" + geminiModel + ":generateContent?key=" + geminiApiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String getGeminiApiKey() {
        return geminiApiKey;
    }

    public String getGeminiModel() {
        return geminiModel;
    }

    public String getGeminiBaseUrl() {
        return geminiBaseUrl;
    }
}
