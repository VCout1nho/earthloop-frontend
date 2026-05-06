import React, { useState } from "react";
import { registerUser } from "../api";

export default function CadastroPage() {
  const [tipo, setTipo] = useState("pessoa");

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    nomeEstabelecimento: "",
    documentoDono: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser({
      tipo,
      ...form
    });

    if (res.error) {
      setMsg("❌ " + res.error);
    } else {
      setMsg("✅ Cadastro realizado com sucesso!");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Criar Conta 🌱</h2>

        {/* Seleção */}
        <div className="tipo">
          <button onClick={() => setTipo("pessoa")} className={tipo === "pessoa" ? "active" : ""}>
            Pessoa
          </button>
          <button onClick={() => setTipo("loja")} className={tipo === "loja" ? "active" : ""}>
            Loja
          </button>
        </div>

        {msg && <p>{msg}</p>}

        <form onSubmit={handleSubmit}>
          {tipo === "pessoa" && (
            <>
              <input name="nome" placeholder="Nome completo" onChange={handleChange} required />
              <input name="cpf" placeholder="CPF" onChange={handleChange} required />
            </>
          )}

          {tipo === "loja" && (
            <>
              <input name="nomeEstabelecimento" placeholder="Nome do estabelecimento" onChange={handleChange} required />
              <input name="documentoDono" placeholder="CPF/CNPJ do dono" onChange={handleChange} required />
            </>
          )}

          <input name="telefone" placeholder="Telefone" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="senha" type="password" placeholder="Senha" onChange={handleChange} required />
          <input name="confirmarSenha" type="password" placeholder="Confirmar senha" onChange={handleChange} required />

          <button type="submit">Cadastrar 🚀</button>
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
          width: 350px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .tipo {
          display: flex;
          margin-bottom: 15px;
        }

        .tipo button {
          flex: 1;
          padding: 10px;
          border: none;
          cursor: pointer;
          background: #ddd;
        }

        .tipo .active {
          background: #2e7d32;
          color: white;
        }

        input {
          width: 100%;
          margin: 8px 0;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        button {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}