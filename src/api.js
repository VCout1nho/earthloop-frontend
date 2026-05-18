// src/api.js
// Melhorias:
// 1. Interceptor de token expirado — redireciona para /login automaticamente
// 2. Função auxiliar centralizada para todas as requisições autenticadas

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── Interceptor de token expirado ────────────────────────────────────────────
// Verifica se o token JWT ainda é válido antes de cada requisição autenticada.
// Se estiver expirado, limpa o localStorage e redireciona para /login.

function getTokenPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

function isTokenExpired() {
  const payload = getTokenPayload();
  if (!payload || !payload.exp) return true;
  // payload.exp está em segundos; Date.now() em milissegundos
  return Date.now() >= payload.exp * 1000;
}

function checkAuthAndRedirect() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return false;
  }
  return true;
}

// ─── Helper para requisições autenticadas ─────────────────────────────────────
async function authFetch(url, options = {}) {
  if (!checkAuthAndRedirect()) return null;

  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  // Token expirado ou inválido no servidor
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }

  return res;
}

// ─── Rotas públicas (sem autenticação) ────────────────────────────────────────

// 🔹 POST - Cadastro de usuário
export async function registerUser({ nome, email, senha, tipo, ...rest }) {
  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, tipo, ...rest }),
    });
    return await res.json();
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return { error: "Erro de conexão" };
  }
}

// 🔹 POST - Login
export async function loginUser({ email, senha }) {
  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    return await res.json();
  } catch (err) {
    console.error("Erro no login:", err);
    return { error: "Erro de conexão" };
  }
}

// 🔹 POST - Enviar contato (público)
export async function enviarContato({ nome, email, assunto, mensagem }) {
  try {
    const res = await fetch(`${BASE_URL}/api/contato`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, assunto, mensagem }),
    });
    return res.ok ? await res.json() : { error: "Erro ao enviar contato" };
  } catch (err) {
    console.error("Erro ao enviar contato:", err);
    return { error: "Erro de conexão com o servidor" };
  }
}

// 🔹 GET - Buscar locais no mapa (público)
export async function fetchLocations() {
  try {
    const res = await fetch(`${BASE_URL}/map/locations`);
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error("Erro ao buscar locais:", err);
    return [];
  }
}

// ─── Rotas protegidas (exigem token válido) ───────────────────────────────────

// 🔹 GET - Dashboard (protegido)
export async function fetchDashboard() {
  try {
    const res = await authFetch(`${BASE_URL}/api/dashboard`);
    if (!res) return null;
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Erro ao buscar dashboard:", err);
    return null;
  }
}

// 🔹 GET - Insights da IA (protegido)
export async function fetchAIInsights() {
  try {
    const res = await authFetch(`${BASE_URL}/api/ai-insights`);
    if (!res) return null;
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Erro ao buscar insights:", err);
    return null;
  }
}