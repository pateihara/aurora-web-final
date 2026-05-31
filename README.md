# Aurora by Flui — Plataforma Web Administrativa + API REST · Etapa 3

Plataforma web administrativa desenvolvida para a **Etapa 3 do Charge Platform Challenge** — parceria **FIAP, Flui & Google · 2026**.

O projeto faz parte do ecossistema **Aurora by Flui**, uma solução voltada à melhoria da experiência de recarga de veículos elétricos e híbridos plug-in no Brasil.

Nesta etapa, a plataforma web deixou de ser apenas uma interface simulada e passou a integrar:

- Painel administrativo funcional;
- Backend próprio com API REST;
- Banco de dados PostgreSQL no Neon;
- ORM Prisma;
- Autenticação por perfil;
- Gestão real de pontos de recarga, carregadores, usuários, avaliações e relatórios;
- Deploy web/API planejado para Vercel.

---

## Sobre o projeto

O **Aurora by Flui** é uma solução digital pensada para apoiar motoristas de veículos elétricos na busca por pontos de recarga mais confiáveis, bem avaliados e adequados ao seu veículo.

A proposta do produto é funcionar como um guia inteligente de eletropostos, reunindo informações como:

- localização;
- conectores disponíveis;
- potência dos carregadores;
- status operacional;
- funcionamento 24h;
- comodidades;
- avaliações por critério;
- favoritos;
- histórico de uso.

Na **Etapa 3**, o foco deste repositório é a **plataforma web administrativa da Flui**, responsável por gerenciar a rede de pontos de recarga e fornecer os endpoints que também serão consumidos pelo app mobile.

---

## Objetivo da Etapa 3

A Etapa 3 representa a entrega final do **Charge Platform Challenge**.

O objetivo é transformar o projeto em uma solução full stack integrada, com:

- app mobile funcional;
- plataforma web administrativa;
- backend próprio com API REST;
- banco de dados estruturado;
- autenticação diferenciada entre motoristas e administradores;
- deploy completo;
- documentação técnica;
- repositório público no GitHub;
- vídeo-pitch de apresentação.

Este repositório concentra a parte **web/admin + backend/API + banco de dados**.

---

## Escopo deste repositório

Este projeto contém:

- Plataforma web administrativa;
- API REST em Next.js;
- Integração com banco PostgreSQL no Neon;
- Prisma ORM;
- Autenticação com JWT;
- Controle de acesso por perfil;
- Rotas administrativas protegidas;
- Estrutura de dados para integração com o app mobile.

O app mobile será mantido em projeto separado, consumindo esta mesma API online.

---

## Funcionalidades implementadas

### Autenticação

- Cadastro de usuários;
- Login com e-mail e senha;
- Geração de token JWT;
- Perfil de usuário diferenciado:
  - `DRIVER` para motoristas;
  - `ADMIN` para administradores da Flui;
- Proteção de rotas administrativas;
- Validação de sessão no painel web.

### Painel administrativo

- Tela de login administrativa;
- Sidebar de navegação;
- Dashboard com indicadores gerais;
- Página de pontos de recarga;
- Página de detalhe e edição de ponto;
- Página de avaliações;
- Página de relatórios;
- Página de usuários/motoristas.

### Gestão de pontos de recarga

- Listagem de pontos cadastrados;
- Cadastro de novo ponto;
- Edição de ponto existente;
- Exclusão de ponto;
- Geocoding automático por endereço;
- Atualização automática de latitude e longitude ao alterar endereço;
- Exibição de:
  - nome;
  - endereço;
  - cidade;
  - estado;
  - latitude;
  - longitude;
  - funcionamento 24h;
  - comodidades;
  - avaliação média;
  - quantidade de carregadores disponíveis.

### Gestão de carregadores

- Cadastro de carregadores por ponto;
- Edição de carregadores existentes;
- Remoção de carregadores;
- Atualização de status operacional:
  - Livre;
  - Ocupado;
  - Offline;
  - Manutenção;
- Controle de:
  - nome do carregador;
  - tipo de conector;
  - potência em kW;
  - status.

### Avaliações

- Motoristas podem avaliar pontos de recarga;
- Administradores podem visualizar avaliações no painel;
- Avaliações com critérios separados:
  - disponibilidade;
  - qualidade;
  - comodidades;
  - sinalização;
- Cálculo de nota média;
- Filtros por avaliações positivas e críticas;
- Exibição de comentário, usuário, ponto avaliado e data.

### Relatórios

- Indicadores calculados a partir do banco de dados;
- Quantidade de usuários;
- Quantidade de pontos cadastrados;
- Quantidade total de carregadores;
- Carregadores disponíveis;
- Carregadores ocupados;
- Carregadores offline;
- Avaliação média da rede;
- Total de avaliações;
- Total de históricos de recarga;
- Taxa de disponibilidade da rede;
- Mensagens executivas condicionais com base nos dados reais.

### Usuários e motoristas

- Listagem de usuários cadastrados;
- Filtro por perfil:
  - todos;
  - motoristas;
  - administradores;
- Visualização de:
  - nome;
  - e-mail;
  - perfil;
  - veículos cadastrados;
  - avaliações enviadas;
  - favoritos;
  - histórico de recargas;
  - total de kWh;
  - gasto simulado.

### Dados iniciais

- Seed com dados demonstrativos;
- Criação automática de:
  - administrador;
  - motorista;
  - veículo;
  - pontos de recarga;
  - carregadores;
  - avaliações;
  - favoritos;
  - histórico de recarga.

---

## Telas da plataforma web

| # | Tela | Descrição |
|---|------|-----------|
| 1 | Login | Acesso administrativo com autenticação JWT |
| 2 | Dashboard | Métricas gerais da rede, usuários, carregadores, avaliações e disponibilidade |
| 3 | Pontos de recarga | Tabela com pontos cadastrados, status, conectores e avaliações |
| 4 | Novo ponto | Cadastro de eletroposto com geocoding automático |
| 5 | Detalhe do ponto | Edição de dados, endereço, comodidades e localização |
| 6 | Gestão de carregadores | Cadastro, edição, remoção e atualização de status dos carregadores |
| 7 | Avaliações | Visualização das avaliações enviadas por motoristas |
| 8 | Relatórios | Indicadores operacionais calculados com dados do banco |
| 9 | Usuários | Visualização de motoristas, administradores, veículos, favoritos e histórico |

---

## Tecnologias utilizadas

### Frontend

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- CSS global;
- LocalStorage para sessão web.

### Backend

- Next.js API Routes;
- API REST;
- JWT para autenticação;
- Bcrypt para criptografia de senha;
- Controle de acesso por perfil.

### Banco de dados

- PostgreSQL;
- Neon;
- Prisma ORM;
- Prisma Migrate;
- Prisma Studio;
- Seed em TypeScript.

### Deploy

- Vercel para web/admin/API;
- Neon para banco PostgreSQL online;
- GitHub como repositório público.

---

## Arquitetura da solução

A solução foi estruturada como um ecossistema com separação entre web e mobile.

```txt
aurora-platform/
│
├── aurora-web/
│   ├── Plataforma web administrativa
│   ├── API REST
│   ├── Prisma ORM
│   ├── Integração com Neon PostgreSQL
│   └── Deploy na Vercel
│
└── aurora-mobile/
    ├── App mobile em Expo/React Native
    ├── Mapa interativo
    ├── Ficha do ponto
    ├── Avaliações
    ├── Perfil do motorista
    └── Consumo da API do aurora-web
```

Neste repositório, o frontend web e o backend estão no mesmo projeto Next.js, o que simplifica o deploy e permite que a Vercel publique a plataforma administrativa e a API REST juntas.

---

## Estrutura do projeto

```txt
aurora-web/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx
│   │   │   ├── stations/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── me/
│   │   │   │   └── register/
│   │   │   ├── chargers/
│   │   │   │   └── [id]/
│   │   │   ├── favorites/
│   │   │   ├── geocode/
│   │   │   ├── reports/
│   │   │   │   └── overview/
│   │   │   ├── reviews/
│   │   │   ├── stations/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── chargers/
│   │   │   │   │   └── reviews/
│   │   │   │   └── route.ts
│   │   │   ├── users/
│   │   │   └── vehicles/
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   └── lib/
│       ├── auth.ts
│       ├── prisma.ts
│       └── responses.ts
│
├── .env
├── package.json
├── prisma.config.ts
└── README.md
```

---

## Modelo de dados

O banco de dados foi modelado com Prisma e PostgreSQL.

### Principais entidades

- `User`
- `Vehicle`
- `Station`
- `Charger`
- `Review`
- `Favorite`
- `ChargingHistory`

### Perfis de usuário

```prisma
enum UserRole {
  DRIVER
  ADMIN
}
```

### Status dos carregadores

```prisma
enum ChargerStatus {
  AVAILABLE
  OCCUPIED
  OFFLINE
  MAINTENANCE
}
```

### Tipos de conectores

```prisma
enum ConnectorType {
  CCS2
  CHADEMO
  TYPE2
  AC
  GBT
}
```

---

## Principais rotas da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastra usuário |
| POST | `/api/auth/login` | Realiza login e retorna token JWT |
| GET | `/api/auth/me` | Retorna usuário logado |

### Pontos de recarga

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/stations` | Lista pontos de recarga |
| POST | `/api/stations` | Cria novo ponto |
| GET | `/api/stations/[id]` | Busca ponto por ID |
| PATCH | `/api/stations/[id]` | Atualiza ponto |
| DELETE | `/api/stations/[id]` | Exclui ponto |

### Carregadores

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/stations/[id]/chargers` | Cria carregador em um ponto |
| PATCH | `/api/chargers/[id]` | Atualiza carregador |
| DELETE | `/api/chargers/[id]` | Remove carregador |

### Avaliações

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/reviews` | Lista avaliações para administradores |
| GET | `/api/stations/[id]/reviews` | Lista avaliações de um ponto |
| POST | `/api/stations/[id]/reviews` | Cria avaliação de motorista |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/users` | Lista usuários para administradores |
| GET | `/api/vehicles` | Lista veículos do usuário logado |
| POST | `/api/vehicles` | Cadastra veículo do motorista |

### Favoritos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/favorites` | Lista favoritos do usuário |
| POST | `/api/favorites` | Favorita um ponto |
| DELETE | `/api/favorites/[stationId]` | Remove favorito |

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/reports/overview` | Retorna indicadores operacionais da rede |

### Geocoding

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/geocode` | Busca latitude e longitude a partir do endereço |

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@host-pooler.neon.tech/neondb?sslmode=require&channel_binding=require"

DIRECT_URL="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET="sua_chave_secreta"
```

### Observação sobre Neon

Use:

```txt
DATABASE_URL → conexão pooled, com -pooler
DIRECT_URL   → conexão direta, sem -pooler
```

A `DATABASE_URL` é usada pela aplicação/API.

A `DIRECT_URL` é usada pelo Prisma Migrate.

---

## Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/pateihara/aurora-web-final.git
```

Acesse a pasta:

```bash
cd aurora-web-final
```

Instale as dependências:

```bash
npm install
```

Configure o `.env` com as variáveis do Neon.

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Rode o seed inicial:

```bash
npm run seed
```

Execute o projeto:

```bash
npm run dev
```

Acesse no navegador:

```txt
http://localhost:3000
```

---

## Usuários de demonstração

Após executar o seed, os seguintes usuários são criados:

### Administrador

```txt
E-mail: admin@flui.com
Senha: admin123
Perfil: ADMIN
```

### Motorista

```txt
E-mail: ana@aurora.com
Senha: 123456
Perfil: DRIVER
```

---

## Scripts disponíveis

```bash
npm run dev
```

Executa o ambiente de desenvolvimento.

```bash
npm run build
```

Gera a build de produção.

```bash
npm start
```

Executa a versão de produção localmente.

```bash
npm run seed
```

Limpa e recria dados iniciais de demonstração no banco.

---

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

O build executa:

```bash
prisma generate && next build
```

Durante os testes locais, o build foi concluído com sucesso, incluindo:

- geração do Prisma Client;
- compilação do Next.js;
- validação TypeScript;
- geração das páginas;
- reconhecimento das rotas estáticas e dinâmicas.

---

## Deploy

A plataforma web/API deve ser publicada na Vercel.

### Configuração recomendada na Vercel

Build command:

```bash
npx prisma migrate deploy && npm run build
```

Variáveis de ambiente:

```env
DATABASE_URL="sua_url_pooled_do_neon"
DIRECT_URL="sua_url_direta_do_neon"
JWT_SECRET="sua_chave_secreta"
```

Após o deploy, a aplicação deverá expor:

```txt
https://sua-url-vercel.vercel.app/login
https://sua-url-vercel.vercel.app/admin
https://sua-url-vercel.vercel.app/api/stations
```

---

## Dados de demonstração

O projeto possui um seed para popular o banco com dados iniciais de demonstração.

O seed cria:

- administrador;
- motorista;
- veículo;
- pontos de recarga;
- carregadores;
- avaliações;
- favorito;
- histórico de recargas.

Esses dados não ficam fixos no frontend. Eles são persistidos no banco PostgreSQL e consumidos pela API.

Portanto, os indicadores do dashboard, relatórios, avaliações e usuários são calculados dinamicamente com base nos dados existentes no banco.

---

## Decisões técnicas

### Next.js full stack

O projeto utiliza Next.js tanto para o frontend administrativo quanto para a API REST. Essa decisão reduz a complexidade de deploy e permite publicar web/admin e backend em uma única aplicação na Vercel.

### Separação entre web e mobile

O projeto foi organizado com separação entre:

- `aurora-web`: painel administrativo + API + banco;
- `aurora-mobile`: aplicativo do motorista.

Essa separação mantém o mobile independente, mas conectado à mesma API.

### Neon PostgreSQL

O Neon foi escolhido para hospedar o banco PostgreSQL online, permitindo persistência real dos dados e integração com o deploy serverless.

### Prisma ORM

O Prisma foi usado para modelagem do banco, migrations, consultas e seed, facilitando a evolução da estrutura de dados.

### Autenticação JWT

A autenticação foi implementada com JWT para permitir consumo tanto pelo painel web quanto futuramente pelo app mobile.

### Geocoding automático

O cadastro e edição dos pontos realizam busca automática de latitude e longitude a partir do endereço, cidade e estado. Isso melhora a experiência administrativa e prepara os dados para o mapa do app mobile.

---

## Identidade visual

A interface mantém a identidade visual criada para o Aurora by Flui.

| Token | Valor | Uso |
|---|---|---|
| `--green` | `#AAFF3E` | Ação primária, status livre e CTAs |
| `--purple` | `#7C3FCC` | Identidade Flui e elementos de apoio |
| `--purple-light` | `#B87DFF` | Avaliações, estrelas e destaques secundários |
| `--amber` | `#FFB23E` | Status parcial ou atenção |
| `--red` | `#FF5F5F` | Status offline, exclusão ou erro |
| `--base` | `#0A0A0F` | Fundo principal |
| `--surface` | `#13131A` | Cards e superfícies |
| `--card` | `#1C1C28` | Inputs e blocos internos |

---

## Testes realizados

Foram testados localmente:

- criação das tabelas via Prisma Migrate;
- visualização do banco pelo Prisma Studio;
- cadastro de usuário;
- login de administrador;
- login de motorista;
- geração de token JWT;
- criação de ponto de recarga;
- listagem de pontos;
- criação de avaliação;
- visualização de avaliações no painel;
- cadastro de ponto via painel web;
- geocoding automático;
- edição de ponto;
- atualização de carregadores;
- criação e remoção de carregadores;
- relatórios dinâmicos;
- visualização de usuários;
- build de produção com `npm run build`.

---

## Status da entrega

| Item | Status |
|---|---|
| Plataforma web administrativa | Concluída |
| API REST | Concluída |
| Banco de dados PostgreSQL | Concluído |
| Prisma ORM e migrations | Concluído |
| Autenticação JWT | Concluída |
| Perfil ADMIN e DRIVER | Concluído |
| Gestão de pontos | Concluída |
| Gestão de carregadores | Concluída |
| Visualização de avaliações | Concluída |
| Relatórios administrativos | Concluídos |
| Tela de usuários | Concluída |
| Geocoding automático | Concluído |
| Build local | Concluído |
| Deploy Vercel | Pendente / inserir link final |
| Integração com app mobile | Próxima etapa |
| Vídeo-pitch | Pendente / inserir link final |
| PDF final | Pendente |

---

## Integrantes

| Nome | RM |
|---|---|
| Natalia Guaita | RM560106 |
| Patricia Eihara | RM559419 |
| Rafael Santos | RM560567 |

---

## Links

| Item | Link |
|---|---|
| Deploy web | Inserir link da Vercel |
| Repositório GitHub | https://github.com/pateihara/aurora-web-final |
| Vídeo-pitch | Inserir link do vídeo |
| App mobile | Inserir link do repositório/deploy quando finalizado |