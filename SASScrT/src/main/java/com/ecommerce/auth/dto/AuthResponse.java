package com.ecommerce.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UUID userId;
    private UUID tenantId;
    private String name;
    private String email;
    private String role;
}