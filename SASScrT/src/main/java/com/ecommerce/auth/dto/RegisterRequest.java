package com.ecommerce.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String password;

    @NotBlank(message = "Nome da loja é obrigatório")
    private String storeName;

    @NotBlank(message = "Subdomínio é obrigatório")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Subdomínio deve conter apenas letras minúsculas, números e hífens")
    @Size(min = 3, max = 30, message = "Subdomínio deve ter entre 3 e 30 caracteres")
    private String subdomain;
}