package com.ecommerce.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private Integer stock;
    private String imageUrl;
    private Boolean active;
    private Boolean featured;
}