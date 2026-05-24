import React, { useState, useEffect } from "react";
import { FaLeaf, FaShoppingCart, FaUsers, FaBullhorn, FaHeadset, FaChartLine } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState("Carregando insights da IA...");

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();

    // Insights com efeito de typing
    const text = "A IA detectou que 62% dos usuários ativos estão concentrados em Montes Claros e região. O pico de engajamento ocorre às 19h-21h. Sugestão: lançar campanha de doação de alimentos às 20h para maximizar alcance.";
    let i = 0;
    const typingInterval = setInterval(() => {
      setInsights(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(typingInterval);
    }, 30);
    return () => clearInterval(typingInterval);
  }, []);

  // Animação de contador
  function AnimatedNumber({ target, prefix = "", suffix = "" }) {
    const [value, setValue] = useState(0);
    useEffect(() => {
      if (!target && target !== 0) return;
      let start = 0;
      const steps = 60;
      const increment = target / steps;
      const interval = setInterval(() => {
        start += increment;
        setValue(Math.min(Math.round(start), target));
        if (start >= target) clearInterval(interval);
      }, 2000 / steps);
      return () => clearInterval(interval);
    }, [target]);
    return <span>{prefix}{value.toLocaleString()}{suffix}</span>;
  }

  const cards = stats ? [
    { icon: <FaUsers size={32} color="var(--accent)" />, label: "Total de Usuários", value: stats.totalUsers, suffix: "", color: "var(--accent)" },
    { icon: <FaChartLine size={32} color="#4caf50" />, label: "Crescimento este mês", value: stats.growth, suffix: "%", color: "#4caf50", prefix: stats.growth >= 0 ? "+" : "" },
    { icon: <FaBullhorn size={32} color="#f59e0b" />, label: "Anúncios publicados", value: stats.totalAnuncios, suffix: "", color: "#f59e0b" },
    { icon: <FaHeadset size={32} color="#6366f1" />, label: "Tickets de suporte", value: stats.totalTickets, suffix: "", color: "#6366f1" },
    { icon: <FaUsers size={32} color="#2e7d32" />, label: "Novos usuários este mês", value: stats.usersEsseMes, suffix: "", color: "#2e7d32" },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "800", marginBottom: "2.5rem", background: "linear-gradient(90deg, var(--accent), #81c784)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>
        📊 Dashboard
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)", fontSize: "1.2rem" }}>
          Carregando dados reais...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: "1400px", margin: "0 auto" }}>

          {cards.map((card, i) => (
            <div key={i} style={{ background: "var(--bg-card)", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", transition: "all 0.3s ease", border: "1px solid rgba(0,0,0,0.05)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                {card.icon}
                <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-secondary)" }}>{card.label}</h3>
              </div>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: card.color, textAlign: "center" }}>
                <AnimatedNumber target={card.value} prefix={card.prefix} suffix={card.suffix} />
              </div>
            </div>
          ))}

          {/* Insights da IA */}
          <div style={{ background: "var(--bg-card)", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.05)", gridColumn: "span 2" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ width: "40px", height: "40px", background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "0.9rem" }}>IA</div>
              <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Insights da IA</h3>
            </div>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "var(--text-primary)", minHeight: "80px", whiteSpace: "pre-wrap" }}>
              {insights}
            </p>
          </div>
        </div>
      )}

      <footer style={{ padding: "4rem 2rem 2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "1rem", borderTop: "1px solid var(--border)", marginTop: "3rem" }}>
        EarthLoop © Copyright {new Date().getFullYear()} • Dados em tempo real
      </footer>
    </div>
  );
}