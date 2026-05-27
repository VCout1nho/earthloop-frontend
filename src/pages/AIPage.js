import React, { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';

export default function AnaliseMarcasPage() {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [searchBrand, setSearchBrand] = useState("");
  const [brandAnalysis, setBrandAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("Digite uma marca acima para começar a análise...");

  const handleSearchBrand = async (e) => {
    e.preventDefault();
    if (!searchBrand.trim()) return;

    setLoading(true);
    setBrandAnalysis(null);
    
    try {
      const marca = searchBrand.trim();

      const r = await fetch(`${BASE_URL}/api/esg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marca }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "Erro ao buscar ESG");

      const analysis = data?.analysis || data;
      setBrandAnalysis(analysis);
      setLoading(false);

      const text = analysis?.resumo || `Análise ESG para ${marca}: não foi possível gerar um resumo.`;

      let i = 0;
      const typing = setInterval(() => {
        setInsights(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(typing);
      }, 25);
    } catch (err) {
      setLoading(false);
      setInsights(
        "Não foi possível consultar ESG agora. Verifique se o backend está online e se as variáveis GOOGLE_API_KEY/GOOGLE_CSE_ID e OPENAI_API_KEY estão configuradas no Render."
      );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      padding: "3rem 2rem",
      overflowX: "hidden",
      animation: "fadeInPage 1s ease-out",
    }}>
      <style jsx global>{`
        @keyframes fadeInPage {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 0 0 rgba(var(--accent), 0.4); }
          70% { box-shadow: 0 0 20px 10px rgba(var(--accent), 0); }
          100% { box-shadow: 0 0 0 0 rgba(var(--accent), 0); }
        }
        .typing-cursor::after {
          content: "|";
          animation: blink 0.8s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <h1 style={{
        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
        fontWeight: "900",
        marginBottom: "3rem",
        background: "linear-gradient(90deg, var(--accent), #81c784, #4caf50)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center",
        animation: "fadeUp 1s ease-out",
      }}
      >
        Análise de Marcas com IA

      </h1>

      {/* Barra de Pesquisa */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto 4rem",
        textAlign: "center",
        animation: "fadeUp 1.2s ease-out",
      }}>
        <form onSubmit={handleSearchBrand} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Digite o nome da marca (ex: EarthLoop, Natura, O Boticário)"
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
            style={{
              padding: "1.2rem 1.8rem",
              borderRadius: "999px",
              border: "2px solid rgba(var(--accent), 0.3)",
              background: "rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              width: "100%",
              maxWidth: "500px",
              fontSize: "1.2rem",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "rgba(var(--accent), 0.3)"}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1.2rem 2.5rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "999px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "700",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              boxShadow: "0 6px 20px rgba(var(--accent), 0.3)",
              transition: "all 0.3s ease",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? (
              <>
                <FaSpinner className="spin" size={20} />
                Analisando...
              </>
            ) : (
              <>
                <FaSearch size={20} />
                Analisar Marca
              </>
            )}
          </button>
        </form>

        {insights && (
  <div style={{ marginTop: "2rem" }}>
    <p className="typing-cursor">{insights}</p>
  </div>
)}

        {/* Resultado da Análise */}
        {brandAnalysis && (
          <div style={{
            marginTop: "3rem",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(14px)",
            borderRadius: "24px",
            padding: "2.5rem",
            boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
            border: "1px solid rgba(var(--accent), 0.25)",
            animation: "fadeUp 0.8s ease-out",
          }}>
            <h2 style={{ fontSize: "2.4rem", marginBottom: "2rem", color: "var(--accent)", textAlign: "center" }}>
              Análise: {brandAnalysis.name}
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1.8rem",
              marginBottom: "3rem",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Sustentabilidade</div>
                <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#4caf50" }}>{brandAnalysis.sustainability}%</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Carbono (kg/ano)</div>
                <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#f59e0b" }}>{brandAnalysis.carbonEmission}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Popularidade</div>
                <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#2196f3" }}>{brandAnalysis.popularity}%</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Resp. Social</div>
                <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#4caf50" }}>{brandAnalysis.socialResponsibility}%</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Resp. Ambiental</div>
                <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#4caf50" }}>{brandAnalysis.environmentalResponsibility}%</div>
              </div>
            </div>

            <div style={{
              padding: "1.8rem",
              background: "rgba(76,175,80,0.12)",
              borderRadius: "16px",
              border: "1px solid rgba(76,175,80,0.35)",
            }}>
              <h4 style={{ color: "#4caf50", marginBottom: "1rem", fontSize: "1.4rem" }}>
                Por que esses dados?
              </h4>
              <p style={{ lineHeight: "1.9", fontSize: "1.15rem" }}>
                {brandAnalysis.why}
              </p>
            </div>

            <div style={{
              marginTop: "2rem",
              padding: "1.8rem",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "16px",
              border: "1px solid rgba(var(--accent), 0.15)",
              textAlign: "left",
            }}>
              <h4 style={{ marginBottom: "1rem", fontSize: "1.4rem", color: "var(--accent)" }}>
                Fontes ESG encontradas na internet
              </h4>
              {esgErro ? (
                <p style={{ color: "#ef4444" }}>{esgErro}</p>
              ) : esgResultados.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>
                  Nenhuma fonte retornada pela busca.
                </p>
              ) : (
                <ul style={{ lineHeight: "1.9", paddingLeft: "1.2rem" }}>
                  {esgResultados.map((r, idx) => (
                    <li key={`${r.link || idx}-${idx}`} style={{ marginBottom: "0.9rem" }}>
                      <div style={{ fontWeight: 700 }}>{r.titulo || "Sem título"}</div>
                      {r.descricao && (
                        <div style={{ color: "var(--text-secondary)" }}>{r.descricao}</div>
                      )}
                      {r.link && (
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--accent)" }}
                        >
                          {r.link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recomendações de Marcas */}
      <div style={{
        maxWidth: "1100px",
        margin: "4rem auto",
      }}>
        <h2 style={{
          fontSize: "2.2rem",
          textAlign: "center",
          marginBottom: "3rem",
          color: "var(--accent)",
        }}>
          Marcas Recomendadas para Comprar
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}>
          <div style={{
            background: "var(--bg-card)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            transition: "all 0.4s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-12px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <h3 style={{ color: "#4caf50", marginBottom: "1rem" }}>EarthLoop</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Líder absoluta em sustentabilidade. Recomendada porque compensa 100% do carbono, usa materiais 100% reciclados e tem cadeia rastreável.
            </p>
            <ul style={{ color: "var(--text-primary)", lineHeight: "2" }}>
              <li>✅ Sustentabilidade: 9.8/10</li>
              <li>✅ Zero desperdício na produção</li>
              <li>✅ Apoio a comunidades locais</li>
            </ul>
          </div>

          <div style={{
            background: "var(--bg-card)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            transition: "all 0.4s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-12px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <h3 style={{ color: "#4caf50", marginBottom: "1rem" }}>Natura</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Excelente escolha por investir em reflorestamento e comunidades indígenas. Alta transparência e impacto positivo real.
            </p>
            <ul style={{ color: "var(--text-primary)", lineHeight: "2" }}>
              <li>✅ Carbono neutro desde 2020</li>
              <li>✅ Ingredientes da biodiversidade brasileira</li>
              <li>✅ Programa de logística reversa forte</li>
            </ul>
          </div>

          <div style={{
            background: "var(--bg-card)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            transition: "all 0.4s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-12px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <h3 style={{ color: "#4caf50", marginBottom: "1rem" }}>O Boticário</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Destaque em embalagens recicláveis e logística reversa. Popular e confiável, com forte compromisso ambiental.
            </p>
            <ul style={{ color: "var(--text-primary)", lineHeight: "2" }}>
              <li>✅ 95% das embalagens recicláveis</li>
              <li>✅ Maior programa de logística reversa do país</li>
              <li>✅ Investe em educação ambiental</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Card ODS 12 */}
      <div style={{
        maxWidth: "900px",
        margin: "5rem auto 0",
        background: "rgba(76,175,80,0.12)",
        borderRadius: "24px",
        padding: "3rem",
        border: "2px solid rgba(76,175,80,0.4)",
        boxShadow: "0 15px 40px rgba(76,175,80,0.15)",
      }}>
        <h3 style={{ textAlign: "center", marginBottom: "1.8rem", color: "#4caf50", fontSize: "2rem" }}>
          Como comprar com a marca certa ajuda a ODS 12
        </h3>
        <p style={{ lineHeight: "1.9", fontSize: "1.2rem", color: "var(--text-primary)" }}>
          O Objetivo de Desenvolvimento Sustentável 12 (Consumo e Produção Responsáveis) é atendido quando escolhemos marcas que:
        </p>
        <ul style={{ lineHeight: "2.2", fontSize: "1.2rem", margin: "1.5rem 0" }}>
          <li>✅ Reduzem o desperdício e usam materiais reciclados</li>
          <li>✅ Compensam emissões de carbono e preservam recursos naturais</li>
          <li>✅ Garantem condições justas de trabalho na cadeia de produção</li>
          <li>✅ Promovem a economia circular e o consumo consciente</li>
        </ul>
        <p style={{ marginTop: "2rem", fontStyle: "italic", textAlign: "center", color: "var(--text-secondary)", fontSize: "1.3rem" }}>
          Cada compra consciente é um passo direto para reduzir o impacto ambiental e construir um futuro sustentável.
        </p>
      </div>

      {/* Rodapé */}
      <footer style={{
        padding: "5rem 2rem 3rem",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: "1.1rem",
        borderTop: "1px solid var(--border)",
      }}>
        EarthLoop © Copyright {new Date().getFullYear()} • Análise Inteligente para um consumo mais consciente
      </footer>
    </div>
  );
}