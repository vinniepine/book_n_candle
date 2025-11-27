# Book & Candle

API base para a plataforma Book & Candle agora em **NestJS**. Inclui rotas para cadastro/autenticação de usuários, gestão de produtos, pedidos e mensagens de atendimento com controle de papéis (usuário, admin, operador) e registro simples de atividades críticas.

## Requisitos

- Node.js 18+
- npm

## Instalação e execução

```bash
npm install
npm run build
npm start
```

Para desenvolver sem build prévio:

```bash
npm run start:dev
```

A aplicação sobe em `http://localhost:3000` por padrão. Defina `PORT` para alterar a porta, `JWT_SECRET` para customizar a chave usada nos tokens e `ADMIN_PASSWORD` para definir a senha do admin seed (`admin@bookncandle.io`).

## Front-end estático (loja)

- O mesmo servidor NestJS expõe um front-end estático em `http://localhost:3000/` dentro da pasta `public/`.
- A página inicial traz vitrine de produtos "fofos" com filtros (categoria, busca e ordenação) que consome o endpoint público `/products`.
- O cartão em destaque usa automaticamente o item mais popular carregado da API.

## Endpoints principais

- **Autenticação**: `POST /auth/register`, `POST /auth/login` (retorna JWT). Token esperado em `Authorization: Bearer <token>`.
- **Usuários**: `GET /users/me`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`; listagem completa em `GET /users` (apenas admin). Senhas são armazenadas com hash forte (PBKDF2 com salt).
- **Produtos**: listagem pública em `/products` com filtros (`category`, `search`, `minPrice`, `maxPrice`, `sort`). CRUD em `/products` para admins.
- **Pedidos**: usuários criam pedidos via `POST /orders` e listam os próprios com `GET /orders`. Admins podem atualizar status em `PATCH /orders/:id/status`.
- **Mensagens de atendimento**: usuários abrem mensagens em `POST /support/messages` e listam as próprias em `GET /support/messages`; operadores/admins listam e respondem/atribuem mensagens em `PATCH /support/messages/:id/respond|assign`.
- **Logbook**: admins acessam registros simples de ações em `GET /logs`.

