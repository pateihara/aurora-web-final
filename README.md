# Aurora by Flui — Plataforma Web + API REST + App Mobile

Projeto desenvolvido para a **Etapa 3 do Charge Platform Challenge** — parceria **FIAP, Flui & Google · 2026**.

O **Aurora by Flui** é uma solução digital para melhorar a experiência de motoristas de veículos elétricos e híbridos plug-in na busca, avaliação e uso de pontos de recarga.

A solução final foi estruturada como um ecossistema full stack integrado, composto por:

- **Plataforma Web Administrativa** para a Flui;
- **API REST própria** em Next.js;
- **Banco de dados PostgreSQL** hospedado no Neon;
- **ORM Prisma** com migrations e seed;
- **App Mobile** em React Native/Expo;
- **Autenticação JWT** com perfis `ADMIN` e `DRIVER`;
- **Deploy Web/API** na Vercel;
- **Preview Mobile Android** via Expo/EAS Update.

---

## Links da entrega

| Item | Link |
|---|---|
| Plataforma Web/Admin | https://aurora-web-final.vercel.app/ |
| API REST base | https://aurora-web-final.vercel.app/api |
| Mobile Android Preview — EAS Update | https://expo.dev/accounts/eiharap/projects/aurora-mobile/updates/ba696951-c8fa-47eb-b164-684a73293630 |
| Repositório Web/API | https://github.com/pateihara/aurora-web-final |
| Repositório Mobile | INSERIR_LINK_DO_REPOSITORIO_MOBILE |
| Protótipo Mobile | INSERIR_LINK_DO_PROTOTIPO_MOBILE |
| Protótipo Web/Admin | INSERIR_LINK_DO_PROTOTIPO_WEB |
| Vídeo Pitch | INSERIR_LINK_DO_VIDEO |
| Documentação/PDF Final | INSERIR_LINK_DO_PDF_FINAL |

---

## QR Code do Mobile

O app mobile Android pode ser acessado pelo QR Code gerado no Expo/EAS Update.

> Para testar, abra o link do Mobile Preview ou escaneie o QR Code com o **Expo Go** no Android.

Link do update:

```txt
https://expo.dev/accounts/eiharap/projects/aurora-mobile/updates/ba696951-c8fa-47eb-b164-684a73293630
```

---

## Usuários de demonstração

### Motorista

```txt
E-mail: pateihara@gmail.com
Senha: 123456
Perfil: DRIVER
```

### Administrador

```txt
E-mail: admin@flui.com
Senha: 123456
Perfil: ADMIN
```

---

## Sobre o projeto

O **Aurora by Flui** foi pensado para apoiar motoristas de veículos elétricos na busca por pontos de recarga mais confiáveis, bem avaliados e adequados ao veículo utilizado.

A solução permite:

- consultar pontos de recarga;
- visualizar mapa interativo;
- filtrar por conectores e disponibilidade;
- favoritar pontos;
- avaliar eletropostos;
- cadastrar veículos elétricos e híbridos plug-in;
- planejar viagens;
- iniciar sessões de recarga;
- acompanhar veículos carregando;
- administrar pontos, carregadores, avaliações e usuários pelo painel web.

---

## Objetivo da Etapa 3

A Etapa 3 representa a entrega final do Challenge, transformando o projeto em uma solução full stack funcional.

A entrega contempla:

- app mobile funcional;
- plataforma web administrativa;
- backend próprio com API REST;
- banco de dados estruturado;
- autenticação diferenciada entre motoristas e administradores;
- deploy completo;
- documentação técnica;
- integração entre mobile, web, API e banco;
- links públicos para avaliação.

---

## Arquitetura da solução

```txt
Aurora by Flui
│
├── aurora-web
│   ├── Plataforma Web Administrativa
│   ├── API REST em Next.js
│   ├── Autenticação JWT
│   ├── Prisma ORM
│   ├── PostgreSQL Neon
│   └── Deploy Vercel
│
└── aurora-mobile
    ├── App React Native / Expo
    ├── Onboarding
    ├── Login e cadastro
    ├── Mapa interativo
    ├── Ficha do ponto
    ├── Favoritos
    ├── Avaliações
    ├── Perfil do motorista
    ├── Cadastro de veículos
    ├── Planejamento de viagem
    ├── Sessões de recarga
    └── Preview Android via EAS Update
```

---

## Tecnologias utilizadas

### Web/Admin

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- CSS global;
- LocalStorage para sessão administrativa;
- Vercel para deploy.

### Backend/API

- Next.js API Routes;
- API REST;
- JWT para autenticação;
- Bcrypt para criptografia de senha;
- Controle de acesso por perfil;
- Prisma ORM;
- Prisma Migrate.

### Banco de dados

- PostgreSQL;
- Neon;
- Prisma ORM;
- Prisma Studio;
- Seed em TypeScript.

### Mobile

- React Native;
- Expo;
- Expo Router;
- TypeScript;
- React Native Maps;
- AsyncStorage;
- EAS Update;
- Expo Go para preview Android.

---

## Funcionalidades da Plataforma Web/Admin

### Autenticação administrativa

- Login com e-mail e senha;
- Geração de token JWT;
- Proteção de rotas administrativas;
- Controle de acesso por perfil `ADMIN`.

### Dashboard

- Indicadores gerais da rede;
- Quantidade de usuários;
- Quantidade de pontos cadastrados;
- Total de carregadores;
- Carregadores livres, ocupados, offline e em manutenção;
- Avaliação média da rede;
- Total de avaliações;
- Taxa de disponibilidade.

### Gestão de pontos de recarga

- Listagem de pontos;
- Cadastro de novo ponto;
- Edição de ponto existente;
- Exclusão de ponto;
- Geocoding automático por endereço;
- Atualização automática de latitude e longitude;
- Controle de comodidades;
- Funcionamento 24h;
- Visualização de carregadores por ponto.

### Gestão de carregadores

- Cadastro de carregadores por ponto;
- Edição de carregadores;
- Remoção de carregadores;
- Atualização de status:
  - `AVAILABLE`;
  - `OCCUPIED`;
  - `OFFLINE`;
  - `MAINTENANCE`;
- Controle de conector e potência.

### Avaliações

- Visualização de avaliações enviadas por motoristas;
- Exibição de usuário, ponto, nota e comentário;
- Critérios separados:
  - disponibilidade;
  - qualidade;
  - comodidades;
  - sinalização;
- Cálculo de nota média.

### Relatórios

- Indicadores dinâmicos calculados pelo banco;
- Disponibilidade da rede;
- Quantidade de carregadores por status;
- Média de avaliações;
- Volume de usuários;
- Histórico simulado de recargas.

### Usuários

- Listagem de usuários;
- Filtro por perfil;
- Exibição de:
  - nome;
  - e-mail;
  - perfil;
  - veículos cadastrados;
  - avaliações;
  - favoritos;
  - histórico de recargas.

---

## Funcionalidades do App Mobile

### Onboarding

- Fluxo inicial com múltiplas telas;
- Apresentação da proposta do Aurora by Flui;
- Direcionamento final para login ou cadastro;
- Identidade visual alinhada ao protótipo.

### Autenticação

- Cadastro de motorista;
- Login com e-mail e senha;
- Sessão persistida com AsyncStorage;
- Consumo da API online;
- Restrição do app mobile para perfil `DRIVER`.

### Mapa

- Mapa interativo com pontos de recarga;
- Marcadores por disponibilidade;
- Filtros por:
  - disponibilidade;
  - funcionamento 24h;
  - tipo de conector;
  - busca por nome, endereço ou cidade;
- Visualização de pontos onde há veículos do usuário carregando;
- Lista de todos os veículos em recarga ativa;
- Acesso rápido ao ponto ou à tela de recarga.

### Ficha do ponto

- Dados completos do eletroposto;
- Endereço, cidade e estado;
- Status dos terminais;
- Tipo de conector;
- Potência em kW;
- Comodidades;
- Botão para abrir rota no Google Maps;
- Botão para avaliar ponto;
- Botão para favoritar;
- Botão para usar terminal;
- Reportar problema em carregador.

### Favoritos

- Favoritar e remover pontos;
- Lista de favoritos conectada à API;
- Atualização dos dados do ponto ao abrir a aba;
- Exibição de disponibilidade real do ponto;
- Acesso direto à ficha do ponto.

### Avaliações

- Envio de avaliação para a API;
- Nota geral;
- Comentário;
- Critérios separados;
- Geração de pontos/sparks ao avaliar;
- Atualização do perfil após avaliação.

### Perfil

- Dados do usuário conectados à API;
- Exibição de:
  - nome;
  - e-mail;
  - data de criação da conta;
  - quantidade de veículos;
  - sparks;
  - descontos simulados;
- Listagem dos veículos cadastrados;
- Adicionar, editar, ativar e excluir veículos.

### Veículos

- Cadastro de veículos 100% elétricos e híbridos plug-in;
- Catálogo de veículos com dados técnicos;
- Dados de:
  - marca;
  - modelo;
  - ano;
  - apelido;
  - placa;
  - tipo;
  - conector;
  - bateria;
  - autonomia;
  - potência máxima;
  - bateria atual;
- Diferenciação entre `EV` e `PHEV`;
- Validação de veículo ativo;
- Veículos salvos por usuário na API.

### Planejamento de viagem

- Tela de planejamento de rota;
- Origem e destino;
- Rotas de teste;
- Uso de localização simulada;
- Seleção do veículo da viagem;
- Cálculo estimado de:
  - distância;
  - duração;
  - bateria estimada na chegada;
- Sugestão de pontos compatíveis no trajeto;
- Abertura de rota no Google Maps.

### Sessões de recarga

- Seleção de terminal;
- Seleção do veículo que será carregado;
- Validação de compatibilidade entre conector do veículo e terminal;
- Pagamento simulado;
- Liberação simulada do cabo;
- Confirmação de cabo conectado;
- Acompanhamento de progresso;
- Finalização de recarga;
- Liberação do terminal após finalização.

### Múltiplas recargas

A regra implementada permite:

- um mesmo usuário pagar mais de uma recarga ao mesmo tempo;
- carregar veículos diferentes em pontos diferentes;
- impedir que o mesmo veículo seja carregado em dois terminais simultaneamente;
- exibir todos os veículos em carregamento na tela do mapa;
- bloquear no mobile e na API a seleção de veículo já em recarga ativa.

---

## Modelo de dados

O banco foi modelado com Prisma e PostgreSQL.

### Principais entidades

- `User`
- `Vehicle`
- `Station`
- `Charger`
- `Review`
- `Favorite`
- `ChargingHistory`
- `ChargingSession`

### Perfis de usuário

```prisma
enum UserRole {
  DRIVER
  ADMIN
}
```

### Tipos de veículo

```prisma
enum VehicleType {
  EV
  PHEV
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

### Status de sessão de recarga

```prisma
enum ChargingSessionStatus {
  ACTIVE
  COMPLETED
  CANCELLED
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
| GET | `/api/stations/[id]/chargers` | Lista carregadores do ponto |
| GET | `/api/stations/[id]/reviews` | Lista avaliações do ponto |
| POST | `/api/stations/[id]/reviews` | Cria avaliação do ponto |

### Carregadores

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/stations/[id]/chargers` | Cria carregador em um ponto |
| PATCH | `/api/chargers/[id]` | Atualiza carregador |
| DELETE | `/api/chargers/[id]` | Remove carregador |
| POST | `/api/chargers/[id]/report-problem` | Reporta problema e marca terminal em manutenção |

### Avaliações

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/reviews` | Lista avaliações para administradores |
| POST | `/api/reviews` | Cria avaliação e atribui sparks ao motorista |

### Usuários e veículos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/users` | Lista usuários para administradores |
| GET | `/api/vehicles` | Lista veículos do usuário logado |
| POST | `/api/vehicles` | Cadastra veículo do motorista |
| PATCH | `/api/vehicles/[id]` | Atualiza veículo |
| DELETE | `/api/vehicles/[id]` | Remove veículo |

### Favoritos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/favorites` | Lista favoritos do usuário |
| POST | `/api/favorites` | Favorita um ponto |
| DELETE | `/api/favorites/[stationId]` | Remove favorito |

### Sessões de recarga

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/charging-sessions` | Lista recargas ativas do usuário |
| POST | `/api/charging-sessions` | Inicia recarga com veículo selecionado |
| GET | `/api/charging-sessions/active` | Retorna uma recarga ativa mais recente |
| PATCH | `/api/charging-sessions/[id]/finish` | Finaliza recarga e libera terminal |

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/reports/overview` | Retorna indicadores operacionais da rede |

### Geocoding

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/geocode` | Busca latitude e longitude a partir do endereço |

---

## Estrutura do projeto Web/API

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
│   │   │   ├── reports/
│   │   │   ├── reviews/
│   │   │   ├── stations/
│   │   │   └── users/
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── chargers/
│   │   │   ├── charging-sessions/
│   │   │   ├── favorites/
│   │   │   ├── geocode/
│   │   │   ├── reports/
│   │   │   ├── reviews/
│   │   │   ├── stations/
│   │   │   ├── users/
│   │   │   └── vehicles/
│   │   │
│   │   ├── login/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── generated/
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

## Estrutura do projeto Mobile

```txt
aurora-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── map.tsx
│   │   ├── favorites.tsx
│   │   └── profile.tsx
│   │
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── onboarding.tsx
│   ├── station-detail.tsx
│   ├── review.tsx
│   ├── vehicle-form.tsx
│   └── charging-session.tsx
│
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── chargingSessionService.ts
│   │   ├── favoriteService.ts
│   │   ├── stationService.ts
│   │   └── vehicleService.ts
│   ├── theme/
│   └── types/
│
├── .env
├── app.json
├── package.json
└── README.md
```

---

## Variáveis de ambiente — Web/API

Crie um arquivo `.env` na raiz do projeto web:

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

## Variáveis de ambiente — Mobile

Crie um arquivo `.env` na raiz do projeto mobile:

```env
EXPO_PUBLIC_API_URL=https://aurora-web-final.vercel.app/api
```

---

## Como rodar o Web/API localmente

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

Configure o `.env`.

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Rode o seed:

```bash
npx tsx prisma/seed.ts
```

Execute o projeto:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

---

## Como rodar o Mobile localmente

Clone o repositório mobile:

```bash
git clone INSERIR_LINK_DO_REPOSITORIO_MOBILE
```

Acesse a pasta:

```bash
cd aurora-mobile
```

Instale as dependências:

```bash
npm install
```

Configure o `.env`:

```env
EXPO_PUBLIC_API_URL=https://aurora-web-final.vercel.app/api
```

Execute o app:

```bash
npx expo start --clear
```

Abra com o **Expo Go** no Android.

---

## Scripts úteis — Web/API

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
npx prisma migrate dev
```

Cria e aplica migrations localmente.

```bash
npx prisma migrate deploy
```

Aplica migrations em ambiente de produção.

```bash
npx prisma generate
```

Gera o Prisma Client.

```bash
npx tsx prisma/seed.ts
```

Executa o seed de dados demonstrativos.

---

## Scripts úteis — Mobile

```bash
npx expo start --clear
```

Inicia o app limpando cache.

```bash
eas update --branch preview --message "Entrega final Aurora Mobile" --platform android
```

Publica update Android via EAS Update.

```bash
eas whoami
```

Verifica usuário logado no EAS.

```bash
eas login
```

Realiza login no EAS.

---

## Deploy

### Web/API

A plataforma web e a API estão publicadas na Vercel:

```txt
https://aurora-web-final.vercel.app/
```

Build command recomendado na Vercel:

```bash
npx prisma migrate deploy && npm run build
```

Variáveis de ambiente necessárias na Vercel:

```env
DATABASE_URL="sua_url_pooled_do_neon"
DIRECT_URL="sua_url_direta_do_neon"
JWT_SECRET="sua_chave_secreta"
```

### Mobile

O app Android foi publicado via EAS Update:

```txt
https://expo.dev/accounts/eiharap/projects/aurora-mobile/updates/ba696951-c8fa-47eb-b164-684a73293630
```

Branch:

```txt
preview
```

Runtime version:

```txt
1.0.0
```

Platform:

```txt
android
```

---

## Dados de demonstração

O seed cria dados para testar a aplicação:

- administrador;
- motorista;
- veículos;
- pontos de recarga;
- carregadores;
- avaliações;
- favoritos;
- histórico de recarga;
- pontos em São Paulo, Grande São Paulo, Sorocaba e Curitiba.

Os dados são persistidos no PostgreSQL/Neon e consumidos pela API.

---

## Identidade visual

| Token | Valor | Uso |
|---|---|---|
| `green` | `#AAFF3E` | Ação primária, status livre e CTAs |
| `purple` | `#7C3FCC` | Identidade Flui e elementos de apoio |
| `purpleLight` | `#B87DFF` | Destaques secundários |
| `amber` | `#FFB23E` | Atenção, ocupado ou recarga ativa |
| `red` | `#FF5F5F` | Erro, offline ou exclusão |
| `base` | `#0A0A0F` | Fundo principal |
| `surface` | `#13131A` | Cards e superfícies |
| `card` | `#1C1C28` | Inputs e blocos internos |

---

## Testes realizados

### Web/API

- Login de administrador;
- Login de motorista;
- Geração e validação de JWT;
- Cadastro e edição de ponto;
- Geocoding automático;
- Cadastro e edição de carregadores;
- Atualização de status de carregadores;
- Visualização de avaliações;
- Relatórios administrativos;
- Listagem de usuários;
- Cadastro de veículos;
- Favoritos;
- Sessões de recarga;
- Build de produção com `npm run build`;
- Deploy na Vercel.

### Mobile

- Onboarding;
- Cadastro;
- Login;
- Mapa;
- Filtros de mapa;
- Ficha do ponto;
- Favoritar e remover favorito;
- Atualização correta de favoritos pela API;
- Avaliação de ponto;
- Geração de sparks;
- Perfil conectado à API;
- Cadastro e edição de veículos;
- Catálogo de veículos elétricos e híbridos plug-in;
- Planejamento de viagem;
- Seleção de veículo da viagem;
- Início de recarga;
- Seleção do veículo carregado;
- Bloqueio de conector incompatível;
- Bloqueio de veículo já carregando;
- Múltiplas recargas simultâneas para veículos diferentes;
- Exibição de todos os veículos carregando no mapa;
- Finalização de recarga;
- Publicação Android via EAS Update.

---

## Status da entrega

| Item | Status |
|---|---|
| Plataforma web administrativa | Concluída |
| API REST | Concluída |
| Banco PostgreSQL Neon | Concluído |
| Prisma ORM e migrations | Concluído |
| Autenticação JWT | Concluída |
| Perfis ADMIN e DRIVER | Concluídos |
| Gestão de pontos | Concluída |
| Gestão de carregadores | Concluída |
| Avaliações | Concluídas |
| Favoritos | Concluídos |
| Veículos por usuário | Concluídos |
| Sparks e descontos simulados | Concluídos |
| Sessões de recarga | Concluídas |
| Múltiplas recargas por usuário | Concluídas |
| Bloqueio de mesmo veículo em duas recargas | Concluído |
| Planejamento de viagem | Concluído |
| Mapa com veículos carregando | Concluído |
| Relatórios administrativos | Concluídos |
| Deploy Web/API Vercel | Concluído |
| Mobile Preview Android EAS | Concluído |
| README unificado | Concluído |
| Vídeo-pitch | Inserir link final |
| PDF final | Inserir link final |

---

## Decisões técnicas

### Next.js full stack

O projeto web utiliza Next.js tanto para o painel administrativo quanto para a API REST. Isso simplifica o deploy, pois a Vercel publica web/admin e backend juntos.

### Separação entre Web e Mobile

O projeto foi separado em dois repositórios:

- `aurora-web`: painel administrativo, API e banco;
- `aurora-mobile`: aplicativo do motorista.

Essa separação mantém o app mobile independente, mas conectado à API online.

### Neon PostgreSQL

O Neon foi escolhido para hospedar o banco PostgreSQL online, permitindo persistência real dos dados e integração com o deploy serverless.

### Prisma ORM

O Prisma foi usado para modelagem do banco, migrations, consultas e seed.

### JWT

A autenticação com JWT permite que o mesmo backend seja consumido pelo painel web e pelo app mobile.

### EAS Update

O EAS Update foi usado para publicar uma versão Android de preview do app mobile, permitindo acesso gratuito para testes via Expo.

### Múltiplas recargas

A solução permite que um motorista pague mais de uma recarga ao mesmo tempo, desde que cada recarga esteja associada a um veículo diferente. Essa decisão representa um caso de uso real, como um usuário pagando a recarga do próprio carro e também do carro de um familiar.

---

## Integrantes

| Nome | RM |
|---|---|
| Natalia Guaita | RM560106 |
| Patricia Eihara | RM559419 |
| Rafael Santos | RM560567 |

---

## Observações finais

O Aurora by Flui evoluiu de uma proposta conceitual para uma solução full stack integrada, com app mobile, painel administrativo, API REST, banco de dados online, autenticação, deploy e fluxos reais de uso.

A solução demonstra como a tecnologia pode apoiar a expansão da mobilidade elétrica no Brasil, oferecendo mais confiança, transparência e praticidade para motoristas e administradores de redes de recarga.
