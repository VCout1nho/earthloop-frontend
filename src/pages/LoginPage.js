// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) {
      e.email = "Email obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Email inválido";
    }
    if (!form.senha) {
      e.senha = "Senha obrigatória";
    } else if (form.senha.length < 6) {
      e.senha = "Senha deve ter pelo menos 6 caracteres";
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setMsg({ text: "", type: "" });

    const res = await loginUser(form);
    setLoading(false);

    if (res.error) {
      setMsg({ text: "❌ " + res.error, type: "error" });
    } else {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("auth-change"));
      setMsg({ text: "✅ Login realizado!", type: "success" });
      setTimeout(() => navigate(from, { replace: true }), 1000);
    }
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "12px", margin: "6px 0 2px",
    borderRadius: "10px",
    border: errors[field] ? "2px solid #e53935" : "1px solid #ccc",
    fontSize: "1rem", boxSizing: "border-box", outline: "none",
  });

  return (
    <div className="page">
      <div className="card">
        <h2>Entrar na conta 🔐</h2>

        {msg.text && (
          <p style={{ color: msg.type === "error" ? "#e53935" : "#2e7d32", fontWeight: "600", textAlign: "center", marginBottom: "12px" }}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label style={{ fontWeight: "600", color: "#555", fontSize: "0.9rem" }}>Email</label>
          <input type="email" name="email" placeholder="seu@email.com"
            value={form.email} onChange={handleChange} style={inputStyle("email")} />
          {errors.email && <span style={{ color: "#e53935", fontSize: "0.82rem", display: "block", marginBottom: "8px" }}>{errors.email}</span>}

          <label style={{ fontWeight: "600", color: "#555", fontSize: "0.9rem", marginTop: "8px", display: "block" }}>Senha</label>
          <input type="password" name="senha" placeholder="Sua senha"
            value={form.senha} onChange={handleChange} style={inputStyle("senha")} />
          {errors.senha && <span style={{ color: "#e53935", fontSize: "0.82rem", display: "block", marginBottom: "8px" }}>{errors.senha}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar 🚀"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.9rem", color: "#555" }}>
          Não tem conta?{" "}
          <a href="/cadastro" style={{ color: "#2e7d32", fontWeight: "600" }}>Cadastre-se</a>
        </p>
      </div>

      <style>{`
        .page { display: flex; justify-content: center; align-items: center; height: 100vh; background: #e8f5e9; }
        .card { background: white; padding: 40px; border-radius: 20px; width: 100%; max-width: 360px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        h2 { color: #1b5e20; margin-bottom: 20px; }
        button[type="submit"] { width: 100%; padding: 12px; background: #2e7d32; color: white; border: none; border-radius: 10px; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
        button[type="submit"]:disabled { background: #a5d6a7; cursor: not-allowed; }
        button[type="submit"]:not(:disabled):hover { background: #1b5e20; }
      `}</style>
    </div>
  );
}