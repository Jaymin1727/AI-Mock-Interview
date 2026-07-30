package com.aiinterview.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class SupabaseService {

    private final WebClient supabaseWebClient;

    @Value("${supabase.url}")
    private String supabaseUrl;

    public SupabaseService(@Qualifier("supabaseWebClient") WebClient supabaseWebClient) {
        this.supabaseWebClient = supabaseWebClient;
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> insert(String table, Map<String, Object> data) {
        return supabaseWebClient.post()
                .uri("/" + table)
                .bodyValue(data)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    @SuppressWarnings("unchecked")
    public Object[] select(String table, String filter) {
        WebClient.RequestHeadersSpec<?> request = supabaseWebClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/" + table);
                    if (filter != null && !filter.isEmpty()) {
                        String[] parts = filter.split("=", 2);
                        if (parts.length == 2) {
                            uriBuilder.queryParam(parts[0], parts[1]);
                        }
                    }
                    return uriBuilder.build();
                });

        return request.retrieve()
                .bodyToMono(Object[].class)
                .block();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> update(String table, String filter, Map<String, Object> data) {
        String[] parts = filter.split("=", 2);
        return supabaseWebClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/" + table)
                        .queryParam(parts[0], parts.length > 1 ? parts[1] : "")
                        .build())
                .bodyValue(data)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
