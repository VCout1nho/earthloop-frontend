// src/pages/LoginPage.js
// Melhoria: redireciona para a página que o usuário tentou acessar antes do login
// (integração com o PrivateRoute via useLocation state).

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Pega a rota de onde o usuário veio (definida pelo PrivateRoute)
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    const res = await loginUser(form);
    setLoading(false);

    if (res.error) {
      setMsg({ text: "❌ " + res.error, type: "error" });
    } else {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setMsg({ text: "✅ Login realizado!", type: "success" });
      window.dispatchEvent(new Event("auth-change")); 

      // Redireciona para onde o usuário tentou ir (ou para a home)
      setTimeout(() => navigate(from, { replace: true }), 1000);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Entrar na conta 🔐</h2>

        {msg.text && (
          <p style={{ color: msg.type === "error" ? "#e53935" : "#2e7d32", fontWeight: "600", textAlign: "center" }}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Seu email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Sua senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar 🚀"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.9rem", color: "#555" }}>
          Não tem conta?{" "}
          <a href="/cadastro" style={{ color: "#2e7d32", fontWeight: "600" }}>
            Cadastre-se
          </a>
        </p>
      </div>

      <style>{`
        .page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #e8f5e9;
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 340px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        h2 { color: #1b5e20; margin-bottom: 20px; }

        input {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 1rem;
          box-sizing: border-box;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }

        button:disabled { background: #a5d6a7; cursor: not-allowed; }
        button:not(:disabled):hover { background: #1b5e20; }
      `}</style>
    </div>
  );
}