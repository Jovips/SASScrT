package com.ecommerce.tenant.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Intercepta cada request HTTP e resolve o tenant de 3 formas (nessa ordem de prioridade):
 * 1. Header X-Tenant-ID
 * 2. Subdomínio (loja-a.minhaplataforma.com → loja-a)
 * 3. JWT claim (tenant_id dentro do token — feito no JwtAuthFilter)
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class TenantFilter extends OncePerRequestFilter {

    @Value("${app.tenant.header:X-Tenant-ID}")
    private String tenantHeader;

    private final TenantRepository tenantRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            UUID tenantId = resolveTenantId(request);

            if (tenantId != null) {
                TenantContext.setTenantId(tenantId);
                log.debug("Tenant resolvido: {}", tenantId);
            }

            filterChain.doFilter(request, response);
        } finally {
            // CRÍTICO: sempre limpar o contexto ao final do request
            TenantContext.clear();
        }
    }

    private UUID resolveTenantId(HttpServletRequest request) {
        // Prioridade 1: header direto (útil para admin e chamadas API)
        String headerValue = request.getHeader(tenantHeader);
        if (headerValue != null && !headerValue.isBlank()) {
            try {
                return UUID.fromString(headerValue);
            } catch (IllegalArgumentException e) {
                log.warn("Header {} com UUID inválido: {}", tenantHeader, headerValue);
            }
        }

        // Prioridade 2: subdomínio (loja-a.minhaplataforma.com)
        String host = request.getServerName();
        if (host != null && host.contains(".")) {
            String subdomain = host.split("\\.")[0];
            return tenantRepository.findBySubdomain(subdomain)
                    .map(Tenant::getId)
                    .orElse(null);
        }

        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Rotas públicas que não precisam de tenant
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/register") ||
               path.startsWith("/api/v3/api-docs") ||
               path.startsWith("/api/swagger-ui") ||
               path.startsWith("/api/actuator");
    }
}