package com.aiinterview.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient geminiWebClient;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    @Value("${gemini.model}")
    private String geminiModel;

    @Value("${gemini.base-url}")
    private String geminiBaseUrl;

    public GeminiService(@Qualifier("geminiWebClient") WebClient geminiWebClient) {
        this.geminiWebClient = geminiWebClient;
    }
    public String generateFirstQuestion(String topic, String initialDifficulty) {
        String difficultyText = initialDifficulty != null && !initialDifficulty.isEmpty() ? initialDifficulty : "Medium";
        String prompt = String.format(
            "You are a technical interviewer. Generate exactly ONE %s difficulty interview question " +
            "for the topic '%s'. Also generate a brief 1-2 sentence description of the topic, " +
            "AND an array of 3-4 'importantNotes'. Each note MUST BE A DETAILED EXPLANATION (3-4 sentences) diving deep into a specific key concept, formula, or principle that the interview will test. " +
            "Return the response STRICTLY as a JSON object with this exact structure: " +
            "{\"description\": \"Brief description...\", \"importantNotes\": [\"Detailed explanation of concept 1...\", \"Detailed explanation of concept 2...\"], \"questionText\": \"The question here\", \"difficulty\": \"%s\"}. " +
            "Do not include markdown blocks or any other text.",
            difficultyText, topic, difficultyText
        );
        return callGemini(prompt);
    }

    public String evaluateAndGenerateNext(String topic, String question, String answer, String currentDifficulty, boolean isLastQuestion) {
        String nextQuestionPrompt = isLastQuestion ?
            "Since this is the last question, set \"nextQuestion\" to null." :
            "Also generate the NEXT interview question for the topic '" + topic + "'. " +
            "ADAPTIVE LOGIC: If the user's score is 7 or higher, increase the difficulty (e.g. from Easy to Medium, or Medium to Hard). " +
            "If the score is 4 or lower, decrease the difficulty. Otherwise, keep it the same. " +
            "Provide the next question inside the \"nextQuestion\" object with \"questionText\" and \"difficulty\".";

        String prompt = String.format(
            "You are a technical interviewer evaluating an answer.\n\n" +
            "Topic: %s\n" +
            "Question (Difficulty: %s): %s\n" +
            "Answer: %s\n\n" +
            "Evaluate the answer. Provide a score (0-10), strengths, and areas for improvement. " +
            "%s\n\n" +
            "Return the response STRICTLY as a JSON object with this exact structure (no markdown):\n" +
            "{\n" +
            "  \"evaluation\": {\n" +
            "    \"score\": 8,\n" +
            "    \"strengths\": \"...\",\n" +
            "    \"improvements\": \"...\"\n" +
            "  },\n" +
            "  \"nextQuestion\": {\n" +
            "    \"questionText\": \"...\",\n" +
            "    \"difficulty\": \"Hard\"\n" +
            "  }\n" +
            "}",
            topic, currentDifficulty, question, answer, nextQuestionPrompt
        );

        String response = callGemini(prompt);
        return response.replaceAll("```json\n", "").replaceAll("```\n", "").replaceAll("```", "").trim();
    }

    @SuppressWarnings("unchecked")
    private String callGemini(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        Map<String, Object> response = null;
        try {
            response = geminiWebClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            System.err.println("Gemini API Error Response: " + e.getResponseBodyAsString());
            throw e;
        }

        if (response == null) return "No response from Gemini API";

        try {
            List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            return "Error parsing Gemini response: " + e.getMessage();
        }
    }
}
