# 🛍️ SaasScrt  
### E-commerce White Label (Multi-Tenant)

Plataforma de e-commerce onde múltiplos clientes podem criar suas próprias lojas com **layout, tema e dados independentes**.

---

## 🚀 Sobre o projeto

Este projeto foi desenvolvido com foco em **escalabilidade e customização**, permitindo que cada loja (tenant) tenha:

- Produtos e pedidos próprios  
- Layout totalmente editável (sem código)  
- Tema visual personalizado  
- Painel administrativo separado  

A proposta é servir como base para um **SaaS de e-commerce multi-tenant**.

---

## 🧩 Principais features

### 🧱 CMS Visual (drag-and-drop)
Páginas são construídas com blocos dinâmicos salvos em JSON, permitindo edição visual em tempo real.

### 🎨 Theme Engine
Customização completa de cores, fontes e estilos por loja.

### 🏪 Multi-tenant
Isolamento total de dados por `tenant_id`, garantindo segurança e escalabilidade.

### ⚙️ Admin Panel
Interface administrativa para gerenciar produtos, pedidos, layout e tema.

---

## 💻 Tecnologias

- **Frontend:** React + Vite + TypeScript  
- **Backend:** Spring Boot  
- **Banco de dados:** PostgreSQL  
- **Arquitetura:** Multi-tenant + modular  

---

## 🧠 Como funciona

Cada página é definida por uma estrutura de blocos:

```json
{
  "page": "home",
  "blocks": [
    { "type": "hero-slider" },
    { "type": "product-grid" }
  ]
}
