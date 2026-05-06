const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

import 'leaflet/dist/leaflet.css';

// 🔹 GET - Buscar locais (mapa)
export async function fetchLocations() {
  try {
    const res = await fetch(`${BASE_URL}/map/locations`);
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error("Erro ao buscar locais:", err);
    return [];
  }
}

// 🔹 POST - Enviar contato
export async function enviarContato({ nome, email, assunto, mensagem }) {
  try {
    const res = await fetch(`${BASE_URL}/api/contato`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email, assunto, mensagem })
    });

    return res.ok ? await res.json() : { error: "Erro ao enviar contato" };

  } catch (err) {
    console.error("Erro ao enviar contato:", err);
    return { error: "Erro de conexão com o servidor" };
  }
}

// 🔹 GET - Dashboard
export async function fetchDashboard() {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard`);
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Erro ao buscar dashboard:", err);
    return null;
  }
}

// 🔹 GET - Insights da IA
export async function fetchAIInsights() {
  try {
    const res = await fetch(`${BASE_URL}/api/ai-insights`);
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("Erro ao buscar insights:", err);
    return null;
  }
}

// 🔹 POST - Cadastro de usuário
export async function registerUser({ nome, email, senha }) {
  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email, senha })
    });

    return res.ok ? await res.json() : await res.json();

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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    return res.ok ? await res.json() : await res.json();

  } catch (err) {
    console.error("Erro no login:", err);
    return { error: "Erro de conexão" };
  }
}