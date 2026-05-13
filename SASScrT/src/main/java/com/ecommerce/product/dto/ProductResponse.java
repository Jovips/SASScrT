package com.ecommerce.product.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private Integer stock;
    private String imageUrl;
    private String sku;
    private boolean active;
    private boolean featured;
    private LocalDateTime createdAt;
}