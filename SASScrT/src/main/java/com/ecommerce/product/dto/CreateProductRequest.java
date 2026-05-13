package com.ecommerce.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull @DecimalMin("0.01") private BigDecimal price;
    private BigDecimal comparePrice;
    @Min(0) private int stock = 0;
    private String imageUrl;
    private String sku;
    private boolean active = true;
    private boolean featured = false;
}