// src/pages/AnuncioDetalhePage.js
// Página de detalhes de um anúncio — URL própria para compartilhar

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${BASE_URL}/api/anuncios/publico/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAnuncio(data);
        } else {
          navigate("/anuncie");
        }
      } catch (err) {
        console.error("Erro ao carregar anúncio:", err);
        navigate("/anuncie");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id, navigate]);

  const abrirWhatsApp = () => {
    const telefone = (anuncio.contact || "").replace(/\D/g, "");
    const mensagem = `Olá! Vi seu anúncio de *${anuncio.itemName}* no EarthLoop e tenho interesse. Pode me dar mais informações?`;
    if (telefone) {
      window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");
    } else {
      alert("Telefone não informado neste anúncio.");
    }
  };

  const compartilhar = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: anuncio.itemName, text: `Vi este anúncio no EarthLoop: ${anuncio.itemName}`, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", color: "#2e7d32", fontSize: "1.2rem" }}>
      Carregando anúncio...
    </div>
  );

  if (!anuncio) return null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Voltar */}
        <button onClick={() => navigate("/anuncie")}
          style={{ background: "none", border: "none", color: "#2e7d32", fontWeight: "600", fontSize: "1rem", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Voltar aos anúncios
        </button>

        <div style={{ background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}>

          {/* Imagem */}
          {anuncio.imagePreview && (
            <img src={anuncio.imagePreview} alt={anuncio.itemName}
              style={{ width: "100%", height: "320px", objectFit: "cover" }} />
          )}

          <div style={{ padding: "2rem" }}>
            {/* Badge + preço */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ padding: "8px 20px", borderRadius: "999px", fontWeight: "700", background: anuncio.type === "doacao" ? "#e8f5e9" : "#fff3e0", color: anuncio.type === "doacao" ? "#2e7d32" : "#ef6c00", fontSize: "1rem" }}>
                {anuncio.type === "doacao" ? "🌱 Doação" : "🛒 Venda"}
              </span>
              {anuncio.type === "venda" && anuncio.price && (
                <span style={{ fontSize: "2rem", fontWeight: "800", color: "#2e7d32" }}>R$ {anuncio.price}</span>
              )}
            </div>

            {/* Título */}
            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1b5e20", margin: "0 0 1rem" }}>
              {anuncio.itemName}
            </h1>

            {/* Descrição */}
            {anuncio.description && (
              <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                {anuncio.description}
              </p>
            )}

            {/* Detalhes */}
            <div style={{ background: "#f8faf5", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888", fontWeight: "600" }}>QUANTIDADE</span>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1b5e20", margin: "4px 0 0" }}>📦 {anuncio.quantity} unidades</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#888", fontWeight: "600" }}>LOCALIZAÇÃO</span>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#444", margin: "4px 0 0" }}>📍 {anuncio.location}</p>
                </div>
              </div>
            </div>

            {/* Negócio */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#1b5e20", margin: "0 0 8px" }}>{anuncio.businessName}</h3>
              <p style={{ color: "#666", margin: 0 }}>📞 {anuncio.contact}</p>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={abrirWhatsApp}
                style={{ flex: 1, padding: "16px", background: "#25D366", color: "white", border: "none", borderRadius: "14px", fontWeight: "700", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                💬 Contato via WhatsApp
              </button>
              <button onClick={compartilhar}
                style={{ padding: "16px 20px", background: copiado ? "#2e7d32" : "#f0f0f0", color: copiado ? "white" : "#444", border: "none", borderRadius: "14px", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                {copiado ? "✅ Copiado!" : "🔗 Compartilhar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}