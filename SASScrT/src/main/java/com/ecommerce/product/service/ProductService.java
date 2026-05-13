package com.ecommerce.product.service;

import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.product.domain.Product;
import com.ecommerce.product.dto.*;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductResponse> findAll(String search, Pageable pageable) {
        UUID tenantId = TenantContext.getTenantId();
        Page<Product> products = search != null && !search.isBlank()
                ? productRepository.searchByTenant(tenantId, search, pageable)
                : productRepository.findByTenantIdAndActiveTrue(tenantId, pageable);
        return products.map(this::toResponse);
    }

    public ProductResponse findById(UUID id) {
        UUID tenantId = TenantContext.getTenantId();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        UUID tenantId = TenantContext.getTenantId();

        if (request.getSku() != null && productRepository.existsBySkuAndTenantId(request.getSku(), tenantId)) {
            throw new BusinessException("SKU '" + request.getSku() + "' já existe nesta loja.");
        }

        Product product = Product.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .comparePrice(request.getComparePrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .sku(request.getSku())
                .active(request.isActive())
                .featured(request.isFeatured())
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(UUID id, UpdateProductRequest request) {
        UUID tenantId = TenantContext.getTenantId();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getComparePrice() != null) product.setComparePrice(request.getComparePrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) product.setActive(request.getActive());
        if (request.getFeatured() != null) product.setFeatured(request.getFeatured());

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(UUID id) {
        UUID tenantId = TenantContext.getTenantId();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));
        product.setActive(false); // soft delete
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .comparePrice(p.getComparePrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .sku(p.getSku())
                .active(p.isActive())
                .featured(p.isFeatured())
                .createdAt(p.getCreatedAt())
                .build();
    }
}