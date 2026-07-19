package com.aiinterview.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.secret-key}")
    private String supabaseSecretKey;

    /**
     * WebClient pre-configured for Supabase REST API calls.
     * Uses the secret service_role key — ONLY for backend use.
     */
    @Bean(name = "supabaseWebClient")
    public WebClient supabaseWebClient() {
        return WebClient.builder()
                .baseUrl(supabaseUrl + "/rest/v1")
                .defaultHeader("apikey", supabaseSecretKey)
                .defaultHeader("Authorization", "Bearer " + supabaseSecretKey)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Prefer", "return=representation")
                .build();
    }

    public String getSupabaseUrl() {
        return supabaseUrl;
    }

    public String getSupabaseSecretKey() {
        return supabaseSecretKey;
    }
}
