import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'leaflet/dist/leaflet.css';

export default function HomePage() {
  const navigate = useNavigate();

  const [co2Saved, setCo2Saved] = useState(0);
  const [wasteAvoided, setWasteAvoided] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  // Animação dos contadores
  useEffect(() => {
    const animateValue = (start, end, setter, duration = 2800, round = false) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        setter(round ? value : Number(value.toFixed(1)));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setter(end);
        }
      };
      window.requestAnimationFrame(step);
    };

    animateValue(0, 1240, setUsersCount, 2800, true);
    animateValue(0, 875, setWasteAvoided, 3000, true);
    animateValue(0, 324, setCo2Saved, 2600);
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8faf5' }}>

      {/* HERO SECTION - Mais impactante */}
      <section style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        color: 'white',
        padding: '120px 5% 100px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', fontSize: '1.1rem', letterSpacing: '3px', opacity: '0.9' }}>
            CONSUMO CONSCIENTE • IMPACTO REAL
          </div>

          <h1 style={{
            fontSize: 'clamp(3.8rem, 9vw, 6.2rem)',
            fontWeight: '800',
            lineHeight: '1.05',
            marginBottom: '24px'
          }}>
            Suas compras podem<br />
            salvar o planeta
          </h1>

          <p style={{
            fontSize: '1.45rem',
            maxWidth: '760px',
            margin: '0 auto 40px',
            opacity: '0.95'
          }}>
            Descubra produtos sustentáveis perto de você, reduza desperdício e acompanhe o impacto positivo que você gera.
          </p>

          <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/mapa')}
              style={{
                padding: '18px 42px',
                background: 'white',
                color: '#1b5e20',
                border: 'none',
                borderRadius: '999px',
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Explorar Mapa Local
            </button>

            <button 
              onClick={() => navigate('/mercado')}
              style={{
                padding: '18px 42px',
                background: 'transparent',
                color: 'white',
                border: '3px solid white',
                borderRadius: '999px',
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Ver Produtos Sustentáveis
            </button>
          </div>
        </div>
      </section>

      {/* Benefícios - Cards inspirados no Mercado Livre */}
      <section style={{ padding: '100px 5%', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.8rem', 
            color: '#1b5e20', 
            marginBottom: '70px' 
          }}>
            Faça a diferença com cada compra
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: '32px' 
          }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4.2rem', marginBottom: '24px' }}>🌍</div>
              <h3 style={{ fontSize: '1.7rem', marginBottom: '16px', color: '#1b5e20' }}>Reduza seu impacto</h3>
              <p style={{ color: '#555', lineHeight: '1.6' }}>
                Escolha produtos locais e sustentáveis. Acompanhe quantos quilos de CO₂ você ajudou a evitar.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4.2rem', marginBottom: '24px' }}>♻️</div>
              <h3 style={{ fontSize: '1.7rem', marginBottom: '16px', color: '#1b5e20' }}>Combata o desperdício</h3>
              <p style={{ color: '#555', lineHeight: '1.6' }}>
                Doe o que sobra e compre apenas o necessário. Transforme consumo em consciência.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4.2rem', marginBottom: '24px' }}>🤝</div>
              <h3 style={{ fontSize: '1.7rem', marginBottom: '16px', color: '#1b5e20' }}>Apoie quem cuida</h3>
              <p style={{ color: '#555', lineHeight: '1.6' }}>
                Fortaleça produtores e comércios locais que respeitam o meio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto da Comunidade */}
      <section style={{ padding: '100px 5%', background: '#e8f5e9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.7rem', color: '#1b5e20', marginBottom: '20px' }}>
            A comunidade EarthLoop já gerou
          </h2>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '90px', 
            flexWrap: 'wrap', 
            marginTop: '60px' 
          }}>
            <div>
              <div style={{ fontSize: '4.2rem', fontWeight: '800', color: '#2e7d32' }}>{usersCount}+</div>
              <p style={{ fontSize: '1.25rem', color: '#444' }}>Pessoas conscientes</p>
            </div>
            <div>
              <div style={{ fontSize: '4.2rem', fontWeight: '800', color: '#2e7d32' }}>{wasteAvoided}kg</div>
              <p style={{ fontSize: '1.25rem', color: '#444' }}>Desperdício evitado</p>
            </div>
            <div>
              <div style={{ fontSize: '4.2rem', fontWeight: '800', color: '#2e7d32' }}>{co2Saved}kg</div>
              <p style={{ fontSize: '1.25rem', color: '#444' }}>CO₂ economizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Forte */}
      <section style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
        color: 'white',
        padding: '110px 5%',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>
          Pronto para fazer parte da mudança?
        </h2>
        <p style={{ fontSize: '1.4rem', maxWidth: '680px', margin: '0 auto 50px', opacity: '0.95' }}>
          Junte-se a milhares de pessoas que já estão consumindo de forma mais consciente e responsável.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/mercado')}
            style={{
              padding: '20px 48px',
              background: 'white',
              color: '#1b5e20',
              border: 'none',
              borderRadius: '999px',
              fontSize: '1.35rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 12px 35px rgba(0,0,0,0.25)'
            }}
          >
            Começar a comprar agora
          </button>

          <button 
            onClick={() => navigate('/mapa')}
            style={{
              padding: '20px 48px',
              background: 'transparent',
              color: 'white',
              border: '3px solid white',
              borderRadius: '999px',
              fontSize: '1.35rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Ver pontos próximos
          </button>
        </div>

        <p style={{ marginTop: '30px', opacity: '0.85', fontSize: '1.15rem' }}>
         Ajude a espalhar a palavra. Compartilhe o EarthLoop com amigos e familiares e amplifique seu impacto positivo!
        </p>
      </section>

      {/* Rodapé */}
      <footer style={{ 
        background: '#1b5e20', 
        color: '#c8e6c9', 
        padding: '70px 5% 40px', 
        textAlign: 'center' 
      }}>
        <p style={{ fontSize: '1.1rem' }}>
          EarthLoop © {new Date().getFullYear()} • Transformando consumo em consciência
        </p>
      </footer>
    </div>
  );
}