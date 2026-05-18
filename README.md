# 🌍 EarthLoop — Frontend

Interface web do projeto EarthLoop, construída com React. Permite que usuários se cadastrem, façam login, anunciem alimentos, explorem um mapa de pontos sustentáveis, naveguem pelo marketplace e entrem em contato com o suporte.

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca de UI |
| React Router DOM v6 | Navegação entre páginas |
| Axios | Requisições HTTP |
| Leaflet + React Leaflet | Mapa interativo |
| Recharts | Gráficos do dashboard |
| Framer Motion | Animações |
| React Icons | Ícones |
| Canvas Confetti | Efeito de confete no marketplace |
| Tailwind CSS | Utilitários de estilo |
| Create React App | Toolchain base |

---

## 📁 Estrutura

```
earthloop-frontend/
├── src/
│   ├── pages/
│   │   ├── AIPage.js           # Insights gerados por IA
│   │   ├── AnunciePage.js      # Publicação de anúncios de alimentos
│   │   ├── CadastroPage.js     # Cadastro de usuário (pessoa ou loja)
│   │   ├── DashboardPage.js    # Painel com gráficos e estatísticas
│   │   ├── Home.js             # Página inicial
│   │   ├── LoginPage.js        # Login com JWT
│   │   ├── MapPage.js          # Mapa de pontos sustentáveis
│   │   ├── MarketplacePage.js  # Loja de produtos eco-friendly
│   │   └── SuportePage.js      # Formulário de contato e FAQ
│   ├── api.js                  # Funções de comunicação com o backend
│   ├── App.js                  # Rotas e estrutura principal
│   ├── App.css                 # Tema global (dark/light mode)
│   └── index.js                # Ponto de entrada
├── .env                        # Variáveis de ambiente
└── package.json
```

---

## ⚙️ Configuração

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie o arquivo `.env` na raiz do projeto

```env
REACT_APP_API_URL=http://localhost:5000
```

> Em produção, substitua pelo URL do backend no Render (ex: `https://earthloop-api.onrender.com`).

### 3. Inicie o servidor de desenvolvimento

```bash
npm start
```

O app estará disponível em `http://localhost:3000`.

---

## 📄 Páginas

### 🏠 Home (`/`)
Página inicial da plataforma.

### 🔐 Login (`/login`)
Formulário de autenticação. Ao fazer login com sucesso, o token JWT e os dados do usuário são salvos no `localStorage` e o usuário é redirecionado para a home.

### 🌱 Cadastro (`/cadastro`)
Cadastro de conta com dois perfis: **Pessoa** (nome + CPF) ou **Loja** (nome do estabelecimento + CPF/CNPJ). Campos comuns: telefone, email, senha.

### 📢 Anuncie (`/anuncie`)
Formulário para publicar anúncios de alimentos excedentes (doação ou venda). Os anúncios são salvos no `localStorage` com suporte a geolocalização, foto, edição e exclusão com modal de confirmação.

### 🗺️ Mapa (`/mapa`)
Mapa interativo via Leaflet exibindo pontos de coleta e anúncios. Marcadores distinguem doações (verde) de vendas (laranja).

### 🛍️ Marketplace (`/marketplace`)
Loja de produtos eco-friendly com:
- Busca por nome
- Filtro por categoria
- Paginação (6 itens por página)
- Modal de detalhes do produto
- Carrinho com controle de quantidade (`useReducer`)
- Efeito de confete ao adicionar item

### 📊 Dashboard (`/dashboard`)
Painel com gráficos de crescimento de usuários (Recharts) e estatísticas gerais, alimentado pelo backend.

### 🤖 IA (`/ai`)
Exibe análises e insights gerados pela OpenAI sobre o crescimento da plataforma.

### 📩 Suporte (`/suporte`)
Formulário de contato que cria um ticket no backend + seção de perguntas frequentes (FAQ) com acordeão.

---

## 🔌 Comunicação com o Backend (`api.js`)

Todas as chamadas HTTP estão centralizadas em `src/api.js`. A base URL é configurada via `.env`.

| Função | Método | Rota | Descrição |
|---|---|---|---|
| `fetchLocations()` | GET | `/map/locations` | Busca pontos no mapa |
| `enviarContato()` | POST | `/api/contato` | Envia mensagem de suporte |
| `fetchDashboard()` | GET | `/api/dashboard` | Dados do painel |
| `fetchAIInsights()` | GET | `/api/ai-insights` | Insights da IA |
| `registerUser()` | POST | `/api/register` | Cadastro de usuário |
| `loginUser()` | POST | `/api/login` | Login e retorno do token JWT |

---

## 🎨 Tema (Dark/Light Mode)

O tema é controlado por variáveis CSS globais em `App.css`. Para ativar o dark mode, basta adicionar a classe `dark` ao elemento `:root`:

```javascript
document.documentElement.classList.add("dark");
```

Variáveis disponíveis: `--bg-primary`, `--bg-card`, `--text-primary`, `--text-secondary`, `--accent`, `--border`, entre outras.

---

## 🧪 Testes

O projeto já inclui `@testing-library/react` e `@testing-library/jest-dom`.

```bash
npm test
```

---

## 🚢 Deploy

O frontend está configurado para deploy na **Vercel** (arquivo `vercel.json` presente na raiz).

```bash
npm run build
```

> O script de build usa `CI=false` e `DISABLE_ESLINT_PLUGIN=true` para evitar falhas por warnings durante o deploy.

Lembre-se de configurar a variável `REACT_APP_API_URL` no painel da Vercel apontando para o backend em produção.

---

