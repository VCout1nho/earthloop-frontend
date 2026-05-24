import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaSave } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
}

export default function PerfilPage() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [form, setForm] = useState({ nome: "", email: "", senhaAtual: "", novaSenha: "", confirmarSenha: "" });
  const [errors, setErrors] = useState({});
  const [abaAtiva, setAbaAtiva] = useState("dados"); // dados | senha

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const res = await apiFetch("/api/perfil");
        if (res.ok) {
          const data = await res.json();
          setPerfil(data);
          setForm(prev => ({ ...prev, nome: data.nome || "", email: data.email || "" }));
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (abaAtiva === "dados") {
      if (!form.nome.trim()) e.nome = "Nome obrigatório";
      if (!form.email.trim()) e.email = "Email obrigatório";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    }
    if (abaAtiva === "senha") {
      if (!form.senhaAtual) e.senhaAtual = "Informe a senha atual";
      if (!form.novaSenha) e.novaSenha = "Informe a nova senha";
      else if (form.novaSenha.length < 6) e.novaSenha = "Mínimo 6 caracteres";
      if (form.novaSenha !== form.confirmarSenha) e.confirmarSenha = "As senhas não coincidem";
    }
    return e;
  };

  const handleSalvar = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSaving(true);
    setMsg({ text: "", type: "" });

    const body = abaAtiva === "dados"
      ? { nome: form.nome, email: form.email }
      : { senhaAtual: form.senhaAtual, novaSenha: form.novaSenha };

    try {
      const res = await apiFetch("/api/perfil", { method: "PUT", body: JSON.stringify(body) });
      const data = await res.json();

      if (res.ok) {
        // Atualiza token e dados no localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-change"));
        setMsg({ text: "✅ " + data.message, type: "success" });
        setForm(prev => ({ ...prev, senhaAtual: "", novaSenha: "", confirmarSenha: "" }));
        setPerfil(data.user);
      } else {
        setMsg({ text: "❌ " + data.error, type: "error" });
      }
    } catch (err) {
      setMsg({ text: "❌ Erro de conexão", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "14px 16px", borderRadius: "12px",
    border: errors[field] ? "2px solid #ef4444" : "1.5px solid var(--border)",
    background: "var(--bg-primary)", color: "var(--text-primary)",
    fontSize: "1rem", outline: "none", boxSizing: "border-box", marginTop: "6px",
  });

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", color: "var(--text-secondary)", fontSize: "1.2rem" }}>
      Carregando perfil...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Avatar e nome */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "2.5rem", fontWeight: "800", color: "white", boxShadow: "0 8px 25px rgba(99,102,241,0.4)" }}>
            {(perfil?.nome || perfil?.email || "U")[0].toUpperCase()}
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 0.3rem" }}>
            {perfil?.nome || "Usuário"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>{perfil?.email}</p>
        </div>

        {/* Card principal */}
        <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "2rem", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}>

          {/* Abas */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "2rem", background: "var(--bg-primary)", borderRadius: "12px", padding: "6px" }}>
            {[
              { key: "dados", label: "👤 Meus Dados", icon: <FaUser /> },
              { key: "senha", label: "🔒 Alterar Senha", icon: <FaLock /> },
            ].map(aba => (
              <button key={aba.key} onClick={() => { setAbaAtiva(aba.key); setErrors({}); setMsg({ text: "", type: "" }); }}
                style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: abaAtiva === aba.key ? "var(--accent)" : "transparent", color: abaAtiva === aba.key ? "white" : "var(--text-secondary)", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem", transition: "all 0.2s" }}>
                {aba.label}
              </button>
            ))}
          </div>

          {msg.text && (
            <div style={{ padding: "12px 16px", borderRadius: "12px", marginBottom: "1.5rem", background: msg.type === "success" ? "#e8f5e9" : "#fef2f2", color: msg.type === "success" ? "#2e7d32" : "#ef4444", fontWeight: "600", textAlign: "center" }}>
              {msg.text}
            </div>
          )}

          {/* Aba Dados */}
          {abaAtiva === "dados" && (
            <div>
              <label style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaUser /> Nome completo
              </label>
              <input name="nome" value={form.nome} onChange={handleChange} style={inputStyle("nome")} placeholder="Seu nome" />
              {errors.nome && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.nome}</span>}

              <label style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", marginTop: "1.2rem" }}>
                <FaEnvelope /> Email
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle("email")} placeholder="seu@email.com" />
              {errors.email && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.email}</span>}
            </div>
          )}

          {/* Aba Senha */}
          {abaAtiva === "senha" && (
            <div>
              <label style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLock /> Senha atual
              </label>
              <input name="senhaAtual" type="password" value={form.senhaAtual} onChange={handleChange} style={inputStyle("senhaAtual")} placeholder="Digite sua senha atual" />
              {errors.senhaAtual && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.senhaAtual}</span>}

              <label style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", marginTop: "1.2rem" }}>
                <FaLock /> Nova senha
              </label>
              <input name="novaSenha" type="password" value={form.novaSenha} onChange={handleChange} style={inputStyle("novaSenha")} placeholder="Mínimo 6 caracteres" />
              {errors.novaSenha && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.novaSenha}</span>}

              <label style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", marginTop: "1.2rem" }}>
                <FaLock /> Confirmar nova senha
              </label>
              <input name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={handleChange} style={inputStyle("confirmarSenha")} placeholder="Repita a nova senha" />
              {errors.confirmarSenha && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.confirmarSenha}</span>}
            </div>
          )}

          {/* Botão salvar */}
          <button onClick={handleSalvar} disabled={saving}
            style={{ marginTop: "2rem", width: "100%", padding: "1rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "1.1rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
            <FaSave /> {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>

        {/* Botão sair */}
        <button onClick={handleLogout}
          style={{ marginTop: "1.5rem", width: "100%", padding: "1rem", background: "transparent", color: "#ef4444", border: "2px solid #ef4444", borderRadius: "12px", fontWeight: "700", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}>
          <FaSignOutAlt /> Sair da conta
        </button>
      </div>
    </div>
  );
}