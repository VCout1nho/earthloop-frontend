import React, { useState } from "react";
import { enviarContato } from "../api";

export default function ContatoPage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "Dúvida geral",
    mensagem: "",
  });

  const [enviado, setEnviado] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await enviarContato({
      nome: form.nome,
      email: form.email,
      assunto: form.assunto,
      mensagem: form.mensagem
    });

    if (response?.error) {
      alert("Erro ao enviar mensagem ❌");
      return;
    }

    setEnviado(true);

    setTimeout(() => {
      setEnviado(false);
      setForm({
        nome: "",
        email: "",
        assunto: "Dúvida geral",
        mensagem: ""
      });
    }, 2800);

  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor ❌");
  }
};

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      pergunta: "Como publico meu primeiro anúncio?",
      resposta: "É bem simples! Acesse 'Anuncie' no menu superior, preencha os dados do seu negócio e do produto, adicione uma foto se quiser e clique em 'Publicar Anúncio'. Seu anúncio aparecerá no mapa em poucos segundos."
    },
    {
      pergunta: "Os anúncios são gratuitos?",
      resposta: "Sim! Publicar anúncios de doação e venda é totalmente gratuito na EarthLoop."
    },
    {
      pergunta: "Como encontro doações perto de mim?",
      resposta: "Vá até a página 'Mapa'. Os marcadores verdes são doações e os laranjas são vendas. Clique em qualquer marcador para ver detalhes e entrar em contato."
    },
    {
      pergunta: "Posso vender alimentos que produzo em casa?",
      resposta: "Sim, desde que siga as normas sanitárias da sua cidade. Muitos produtores caseiros já utilizam a plataforma com sucesso."
    },
    {
      pergunta: "Como denuncio um anúncio inadequado?",
      resposta: "Envie um e-mail para earthloopsuporte@gmail.com com o link do anúncio ou uma captura de tela. Analisaremos o mais rápido possível."
    },
    {
      pergunta: "Vocês têm parceria com alguma ONG ou projeto social?",
      resposta: "Sim! Estamos abertos a parcerias. Se você representa uma instituição social, entre em contato conosco pelo suporte."
    }
  ];

  return (
    <div className="page">
      <div className="wrapper">
        <div className="hero">
          <div className="hero-icon">🌍</div>
          <h1>Estamos aqui para ajudar</h1>
          <p>Seu feedback e dúvidas são essenciais para construirmos um mundo mais sustentável juntos.</p>
        </div>

        <div className="content-grid">
          {/* ==================== CONTATO ==================== */}
          <div className="contact-card">
            <h2>Fale com a gente</h2>

            {/* Botão de Email Direto - Melhorado */}
            <button 
              className="email-direct-btn"
              onClick={() => window.location.href = "mailto:earthloopsuporte@gmail.com?subject=Contato%20EarthLoop"}
            >
              <span className="email-icon">✉️</span>
              Enviar e-mail 
            </button>

            <div className="divider">ou preencha o formulário abaixo</div>

            {enviado ? (
              <div className="success-message">
                ✅ Mensagem enviada com sucesso!<br />
                <small>Responderemos em até 24 horas.</small>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="nome" 
                  placeholder="Seu nome completo" 
                  value={form.nome} 
                  onChange={handleChange} 
                  required 
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Seu melhor e-mail" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
                
                <select name="assunto" value={form.assunto} onChange={handleChange}>
                  <option value="Dúvida geral">Dúvida geral</option>
                  <option value="Problema técnico">Problema técnico</option>
                  <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                  <option value="Parceria">Parceria ou Colaboração</option>
                  <option value="Outro">Outro</option>
                </select>

                <textarea 
                  name="mensagem" 
                  placeholder="Escreva sua mensagem aqui..." 
                  rows="6" 
                  value={form.mensagem} 
                  onChange={handleChange} 
                  required 
                />

                <button type="submit" className="submit-btn">
                  Enviar Mensagem 🌱
                </button>
              </form>
            )}
          </div>

          {/* ==================== PERGUNTAS FREQUENTES ==================== */}
          <div className="faq-card">
            <h2>Perguntas Frequentes</h2>
            
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question" 
                  onClick={() => toggleFaq(index)}
                >
                  {faq.pergunta}
                  <span className="faq-icon">{openFaq === index ? "−" : "+"}</span>
                </button>
                
                <div className={`faq-answer ${openFaq === index ? 'open' : ''}`}>
                  {faq.resposta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
          padding: 60px 20px 100px;
        }
        .wrapper { max-width: 1100px; margin: auto; }

        .hero { text-align: center; margin-bottom: 60px; }
        .hero-icon { font-size: 4.5rem; margin-bottom: 16px; }
        .hero h1 { font-size: 3rem; color: #1b5e20; margin: 0; }
        .hero p { font-size: 1.35rem; color: #33691e; max-width: 600px; margin: 16px auto 0; }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }

        .contact-card, .faq-card {
          background: white;
          padding: 40px;
          border-radius: 28px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.09);
        }

        /* Botão de Email Melhorado */
        .email-direct-btn {
          width: 100%;
          padding: 20px 24px;
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.18rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          transition: all 0.3s ease;
          margin-bottom: 30px;
          box-shadow: 0 8px 20px rgba(27, 94, 32, 0.35);
        }
        .email-direct-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(27, 94, 32, 0.45);
        }
        .email-icon { font-size: 1.6rem; }

        .divider {
          text-align: center;
          margin: 25px 0;
          color: #777;
          position: relative;
        }
        .divider:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0; right: 0;
          height: 1px;
          background: #ddd;
        }

        input, select, textarea {
          width: 100%;
          padding: 15px;
          margin-bottom: 18px;
          border: 1.5px solid #c8e6c9;
          border-radius: 14px;
          font-size: 1.05rem;
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #2e7d32, #4caf50);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
        }

        /* FAQ Melhorado */
        .faq-question {
          width: 100%;
          padding: 18px 24px;
          background: #f8fff8;
          border: none;
          border-radius: 14px;
          text-align: left;
          font-weight: 600;
          font-size: 1.05rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          color: #1b5e20;
        }

        .faq-icon {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4caf50;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          padding: 0 24px;
          background: white;
          color: #444;
          line-height: 1.75;
          transition: all 0.4s ease;
        }

        .faq-answer.open {
          max-height: 220px;
          padding: 20px 24px;
          border-top: 1px solid #eee;
        }

        @media (max-width: 900px) {
          .content-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}