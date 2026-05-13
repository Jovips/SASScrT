package com.ecommerce.product.repository;

import com.ecommerce.product.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // SEMPRE filtrar por tenant_id — nunca retornar dados de outro tenant
    Page<Product> findByTenantIdAndActiveTrue(UUID tenantId, Pageable pageable);

    Page<Product> findByTenantIdAndActiveTrueAndFeaturedTrue(UUID tenantId, Pageable pageable);

    Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId);

    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.active = true " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchByTenant(@Param("tenantId") UUID tenantId,
                                  @Param("search") String search,
                                  Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.active = true " +
           "AND p.category.id = :categoryId")
    Page<Product> findByTenantIdAndCategoryId(@Param("tenantId") UUID tenantId,
                                               @Param("categoryId") UUID categoryId,
                                               Pageable pageable);

    boolean existsBySkuAndTenantId(String sku, UUID tenantId);
}