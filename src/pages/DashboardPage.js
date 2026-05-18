import React, { useState, useEffect } from "react";
import { FaLeaf, FaShoppingCart } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';

export default function DashboardPage() {
  const [usersActive, setUsersActive] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState(0);
  const [engagement, setEngagement] = useState(0);
  const [insights, setInsights] = useState("Carregando insights da IA...");

  // Animação dos contadores
  useEffect(() => {
    const duration = 2000; // 2 segundos
    const steps = 60;

    // Usuários Ativos
    const targetUsers = 1200;
    const incrementUsers = targetUsers / steps;
    let countUsers = 0;
    const intervalUsers = setInterval(() => {
      countUsers += incrementUsers;
      setUsersActive(Math.min(Math.round(countUsers), targetUsers));
      if (countUsers >= targetUsers) clearInterval(intervalUsers);
    }, duration / steps);

    // Crescimento
    const targetGrowth = 23;
    const incrementGrowth = targetGrowth / steps;
    let countGrowth = 0;
    const intervalGrowth = setInterval(() => {
      countGrowth += incrementGrowth;
      setGrowth(Math.min(Math.round(countGrowth), targetGrowth));
      if (countGrowth >= targetGrowth) clearInterval(intervalGrowth);
    }, duration / steps);

    // Crescimento Mensal
    const targetMonthly = 890;
    const incrementMonthly = targetMonthly / steps;
    let countMonthly = 0;
    const intervalMonthly = setInterval(() => {
      countMonthly += incrementMonthly;
      setMonthlyGrowth(Math.min(Math.round(countMonthly), targetMonthly));
      if (countMonthly >= targetMonthly) clearInterval(intervalMonthly);
    }, duration / steps);

    // Engajamento (exemplo: 78%)
    const targetEngagement = 78;
    const incrementEngagement = targetEngagement / steps;
    let countEngagement = 0;
    const intervalEngagement = setInterval(() => {
      countEngagement += incrementEngagement;
      setEngagement(Math.min(Math.round(countEngagement), targetEngagement));
      if (countEngagement >= targetEngagement) clearInterval(intervalEngagement);
    }, duration / steps);

    // Insights da IA com efeito de typing
    const text = "A IA detectou que 62% dos usuários ativos estão concentrados em Montes Claros e região. O pico de engajamento ocorre às 19h-21h. Sugestão: lançar campanha de doação de alimentos às 20h para maximizar alcance. Novos usuários crescem 23% esta semana.";
    let i = 0;
    const typingInterval = setInterval(() => {
      setInsights(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(typingInterval);
    }, 50);

    return () => {
      clearInterval(intervalUsers);
      clearInterval(intervalGrowth);
      clearInterval(intervalMonthly);
      clearInterval(intervalEngagement);
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      padding: "2rem 1.5rem",
    }}>
      <h1 style={{
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: "800",
        marginBottom: "2.5rem",
        background: "linear-gradient(90deg, var(--accent), #81c784)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textAlign: "center",
      }}>
        Dashboard Inteligente
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}>
        {/* Card Usuários Ativos */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(var(--accent), 0.15)",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <FaLeaf size={32} color="var(--accent)" />
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Usuários Ativos</h3>
          </div>
          <div style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            color: "var(--accent)",
            textAlign: "center",
          }}>
            {usersActive.toLocaleString()}
          </div>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Hoje • Atualizado agora
          </p>
        </div>

        {/* Card Crescimento */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(var(--accent), 0.15)",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <FaLeaf size={32} color="var(--accent)" />
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Crescimento</h3>
          </div>
          <div style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            color: "#4caf50",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}>
            +{growth}%
            <span style={{ fontSize: "1.5rem", color: "#4caf50" }}>↑</span>
          </div>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Esta semana
          </p>
        </div>

        {/* Card Usuários Ativos Mensal */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(var(--accent), 0.15)",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <FaShoppingCart size={32} color="var(--accent)" />
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Usuários Ativos Mensal</h3>
          </div>
          <div style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            color: "var(--accent)",
            textAlign: "center",
          }}>
            {monthlyGrowth.toLocaleString()}
          </div>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Este mês
          </p>
        </div>

        {/* Card Engajamento */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(var(--accent), 0.15)",
          gridColumn: "span 2",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <FaLeaf size={32} color="var(--accent)" />
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Engajamento</h3>
          </div>
          <div style={{
            fontSize: "4rem",
            fontWeight: "900",
            color: "#4caf50",
            textAlign: "center",
            margin: "1rem 0",
          }}>
            {engagement}%
          </div>
          <div style={{
            height: "20px",
            background: "rgba(76,175,80,0.2)",
            borderRadius: "10px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${engagement}%`,
              background: "linear-gradient(90deg, #4caf50, #81c784)",
              transition: "width 2s ease-out",
            }} />
          </div>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "1rem" }}>
            Taxa média de interação esta semana
          </p>
        </div>

        {/* Insights da IA */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(var(--accent), 0.15)",
          gridColumn: "span 2",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "var(--accent)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.5rem",
            }}>
              IA
            </div>
            <h3 style={{ fontSize: "1.5rem", margin: 0 }}>Insights da IA</h3>
          </div>
          <p style={{
            fontSize: "1.2rem",
            lineHeight: "1.7",
            color: "var(--text-primary)",
            minHeight: "120px",
            whiteSpace: "pre-wrap",
          }}>
            {insights}
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <footer style={{
        padding: "4rem 2rem 2rem",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: "1rem",
        borderTop: "1px solid var(--border)",
      }}>
        EarthLoop © Copyright {new Date().getFullYear()} • Dashboard Inteligente para um planeta mais verde
      </footer>
    </div>
  );
}