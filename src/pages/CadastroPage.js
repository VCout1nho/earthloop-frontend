import React, { useState } from "react";
import { registerUser } from "../api";
import 'leaflet/dist/leaflet.css';

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

  const [msg, setMsg] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Remove o erro do campo assim que o usuário começa a corrigir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Validação completa do formulário
  const validate = () => {
    const newErrors = {};

    if (tipo === "pessoa") {
      if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório.";
      if (!form.cpf.trim()) newErrors.cpf = "CPF é obrigatório.";
    }

    if (tipo === "loja") {
      if (!form.nomeEstabelecimento.trim()) newErrors.nomeEstabelecimento = "Nome do estabelecimento é obrigatório.";
      if (!form.documentoDono.trim()) newErrors.documentoDono = "CPF/CNPJ é obrigatório.";
    }

    if (!form.telefone.trim()) newErrors.telefone = "Telefone é obrigatório.";
    if (!form.email.trim()) newErrors.email = "Email é obrigatório.";

    if (!form.senha) {
      newErrors.senha = "Senha é obrigatória.";
    } else if (form.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!form.confirmarSenha) {
      newErrors.confirmarSenha = "Confirme sua senha.";
    } else if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const res = await registerUser({ tipo, ...form });

    if (res.error) {
      setMsg({ text: "❌ " + res.error, type: "error" });
    } else {
      setMsg({ text: "✅ Cadastro realizado com sucesso!", type: "success" });
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    margin: "6px 0 2px",
    padding: "10px",
    borderRadius: "8px",
    border: errors[field] ? "1.5px solid #e53935" : "1px solid #ccc",
    outline: "none",
  });

  return (
    <div className="page">
      <div className="card">
        <h2>Criar Conta 🌱</h2>

        <div className="tipo">
          <button onClick={() => setTipo("pessoa")} className={tipo === "pessoa" ? "active" : ""}>
            Pessoa
          </button>
          <button onClick={() => setTipo("loja")} className={tipo === "loja" ? "active" : ""}>
            Loja
          </button>
        </div>

        {msg.text && (
          <p style={{ color: msg.type === "error" ? "#e53935" : "#2e7d32", fontWeight: "600" }}>
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {tipo === "pessoa" && (
            <>
              <input name="nome" placeholder="Nome completo" onChange={handleChange} style={inputStyle("nome")} />
              {errors.nome && <span className="error-msg">{errors.nome}</span>}

              <input name="cpf" placeholder="CPF" onChange={handleChange} style={inputStyle("cpf")} />
              {errors.cpf && <span className="error-msg">{errors.cpf}</span>}
            </>
          )}

          {tipo === "loja" && (
            <>
              <input name="nomeEstabelecimento" placeholder="Nome do estabelecimento" onChange={handleChange} style={inputStyle("nomeEstabelecimento")} />
              {errors.nomeEstabelecimento && <span className="error-msg">{errors.nomeEstabelecimento}</span>}

              <input name="documentoDono" placeholder="CPF Propietário(a) or CNPJ Estabelecimento" onChange={handleChange} style={inputStyle("documentoDono")} />
              {errors.documentoDono && <span className="error-msg">{errors.documentoDono}</span>}
            </>
          )}

          <input name="telefone" placeholder="Telefone" onChange={handleChange} style={inputStyle("telefone")} />
          {errors.telefone && <span className="error-msg">{errors.telefone}</span>}

          <input name="email" type="email" placeholder="Email" onChange={handleChange} style={inputStyle("email")} />
          {errors.email && <span className="error-msg">{errors.email}</span>}

          <input name="senha" type="password" placeholder="Senha (mín. 6 caracteres)" onChange={handleChange} style={inputStyle("senha")} />
          {errors.senha && <span className="error-msg">{errors.senha}</span>}

          <input name="confirmarSenha" type="password" placeholder="Confirmar senha" onChange={handleChange} style={inputStyle("confirmarSenha")} />
          {errors.confirmarSenha && <span className="error-msg">{errors.confirmarSenha}</span>}

          <button type="submit">Cadastrar 🚀</button>
        </form>
      </div>

      <style>{`
        .page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #e8f5e9;
          padding: 20px;
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        h2 { text-align: center; color: #1b5e20; margin-bottom: 20px; }

        .tipo {
          display: flex;
          margin-bottom: 20px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #ccc;
        }

        .tipo button {
          flex: 1;
          padding: 10px;
          border: none;
          cursor: pointer;
          background: #f0f0f0;
          font-weight: 600;
          transition: all 0.2s;
        }

        .tipo .active {
          background: #2e7d32;
          color: white;
        }

        button[type="submit"] {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        button[type="submit"]:hover { background: #1b5e20; }

        .error-msg {
          display: block;
          color: #e53935;
          font-size: 0.82rem;
          margin-bottom: 6px;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}