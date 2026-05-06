import React, { useState } from "react";
import { loginUser } from "../api";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginUser(form);

    if (res.error) {
      setMsg("❌ " + res.error);
    } else {
      setMsg("✅ Login realizado!");

      // 💾 salvar token
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // 🚀 redirecionar depois
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Entrar na conta 🔐</h2>

        {msg && <p>{msg}</p>}

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

          <button type="submit">Entrar 🚀</button>
        </form>
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
          width: 320px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}