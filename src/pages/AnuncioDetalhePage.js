import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);

  const logado = !!localStorage.getItem("token");

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`${BASE_URL}/api/anuncios/publico/${id}`);
        if (res.ok) {
          setAnuncio(await res.json());
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  const abrirWhatsApp = () => {
    const telefone = (anuncio.contact || "").replace(/\D/g, "");
    const mensagem = `Olá! Vi seu anúncio de *${anuncio.itemName}* no EarthLoop e tenho interesse!`;
    if (telefone) {
      window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#e8f5e9" }}>
      <div style={{ textAlign: "center", color: "#2e7d32" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌿</div>
        <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>Carregando anúncio...</p>
      </div>
    </div>
  );

  if (!anuncio) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#e8f5e9" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>Anúncio não encontrado.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: "1rem", padding: "12px 24px", background: "#2e7d32", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>
          Ir para o EarthLoop
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)" }}>

      {/* Header simples */}
      <div style={{ background: "#2e7d32", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "white", fontWeight: "700", fontSize: "1.4rem" }}>
          🌍 EarthLoop
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {!logado && (
            <>
              <button onClick={() => navigate("/login")} style={{ padding: "8px 18px", background: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "999px", cursor: "pointer", fontWeight: "600" }}>
                Entrar
              </button>
              <button onClick={() => navigate("/cadastro")} style={{ padding: "8px 18px", background: "white", color: "#2e7d32", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "700" }}>
                Cadastrar
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Card do anúncio */}
        <div style={{ background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.12)", marginBottom: "2rem" }}>

          {anuncio.imagePreview && (
            <img src={anuncio.imagePreview} alt={anuncio.itemName}
              style={{ width: "100%", height: "320px", objectFit: "cover" }} />
          )}

          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ padding: "8px 20px", borderRadius: "999px", fontWeight: "700", background: anuncio.type === "doacao" ? "#e8f5e9" : "#fff3e0", color: anuncio.type === "doacao" ? "#2e7d32" : "#ef6c00", fontSize: "1rem" }}>
                {anuncio.type === "doacao" ? "🌱 Doação" : "🛒 Venda"}
              </span>
              {anuncio.type === "venda" && anuncio.price && (
                <span style={{ fontSize: "2rem", fontWeight: "800", color: "#2e7d32" }}>R$ {anuncio.price}</span>
              )}
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1b5e20", margin: "0 0 1rem" }}>
              {anuncio.itemName}
            </h1>

            {anuncio.description && (
              <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                {anuncio.description}
              </p>
            )}

            <div style={{ background: "#f8faf5", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "600" }}>QUANTIDADE</span>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1b5e20", margin: "4px 0 0" }}>📦 {anuncio.quantity} unidades</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "600" }}>LOCALIZAÇÃO</span>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#444", margin: "4px 0 0" }}>📍 {anuncio.location}</p>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
              <strong style={{ color: "#1b5e20", fontSize: "1.1rem" }}>{anuncio.businessName}</strong>
              <p style={{ color: "#666", margin: "4px 0 0" }}>📞 {anuncio.contact}</p>
            </div>

            <button onClick={abrirWhatsApp}
              style={{ width: "100%", padding: "16px", background: "#25D366", color: "white", border: "none", borderRadius: "14px", fontWeight: "700", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              💬 Entrar em Contato via WhatsApp
            </button>
          </div>
        </div>

        {/* Call to action — só para não logados */}
        {!logado && (
          <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 15px 40px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1b5e20", marginBottom: "1rem" }}>
              Faça parte do EarthLoop!
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.7", marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
              Aqui você pode <strong>doar ou vender alimentos</strong>, encontrar produtos sustentáveis perto de você e ajudar a combater o desperdício. Tudo gratuito!
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/cadastro")}
                style={{ padding: "14px 32px", background: "linear-gradient(135deg, #2e7d32, #4caf50)", color: "white", border: "none", borderRadius: "999px", fontWeight: "700", fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 8px 20px rgba(46,125,50,0.3)" }}>
                🌱 Criar conta grátis
              </button>
              <button onClick={() => navigate("/login")}
                style={{ padding: "14px 32px", background: "white", color: "#2e7d32", border: "2px solid #2e7d32", borderRadius: "999px", fontWeight: "700", fontSize: "1.1rem", cursor: "pointer" }}>
                Já tenho conta
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {["🆓 100% gratuito", "🗺️ Mapa interativo", "♻️ Impacto real"].map(item => (
                <span key={item} style={{ fontSize: "0.95rem", color: "#2e7d32", fontWeight: "600" }}>{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Se já logado, convida a explorar o mapa */}
        {logado && (
          <div style={{ background: "white", borderRadius: "24px", padding: "2rem", boxShadow: "0 15px 40px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <p style={{ color: "#555", fontSize: "1rem", marginBottom: "1rem" }}>
              Explore outros anúncios perto de você no mapa!
            </p>
            <button onClick={() => navigate("/mapa")}
              style={{ padding: "12px 28px", background: "#2e7d32", color: "white", border: "none", borderRadius: "999px", fontWeight: "700", cursor: "pointer" }}>
              🗺️ Ver no Mapa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}