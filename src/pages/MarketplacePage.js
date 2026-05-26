import React, { useState, useCallback, useReducer, useEffect } from "react";
import confetti from "canvas-confetti";
import { FaLeaf, FaShoppingCart, FaStar, FaTimes, FaTrash, FaPlus, FaMinus, FaCheckCircle } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

const products = [
  { id: 1, name: "Camisa Ecológica", price: 40, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Vestuário", eco: true, rating: 4.8, stock: "Em estoque", description: "Feita de algodão orgânico 100% sustentável.", details: "Tecido respirável, GOTS certificado, tingimento natural." },
  { id: 2, name: "Tênis Reciclados", price: 120, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Calçados", eco: true, rating: 4.9, stock: "Poucas unidades", description: "Solado reciclado de pneus + tecido PET reciclado.", details: "Conforto anatômico, respirável, sola antiderrapante." },
  { id: 3, name: "Jaqueta Verde", price: 150, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Vestuário", eco: true, rating: 4.7, stock: "Em estoque", description: "Forro de lã reciclada e zíper ecológico.", details: "Impermeável leve, bolsos internos, capuz ajustável." },
  { id: 4, name: "Bolsa Sustentável", price: 85, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Acessórios", eco: true, rating: 4.6, stock: "Em estoque", description: "Feita de lona reciclada de banners publicitários.", details: "Compartimentos internos, alça ajustável, resistente à água." },
  { id: 5, name: "Garrafa Térmica Eco", price: 65, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Acessórios", eco: true, rating: 4.9, stock: "Em estoque", description: "Aço inoxidável reutilizável com tampa de bambu.", details: "24h quente / 48h frio, sem BPA, tampa anti-vazamento." },
  { id: 6, name: "Mochila Eco Urbana", price: 110, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Acessórios", eco: true, rating: 4.8, stock: "Em estoque", description: "Feita de garrafas PET recicladas. Espaço para notebook.", details: "Compartimento acolchoado, bolsos organizadores." },
  { id: 7, name: "Calça Sustentável", price: 95, image: "https://images.unsplash.com/photo-1605733160316-4fc7dac6a878?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Vestuário", eco: true, rating: 4.7, stock: "Em estoque", description: "Feita de algodão orgânico e elastano reciclado.", details: "Corte slim, bolsos funcionais, costura reforçada." },
  { id: 8, name: "Kit de Higiene Eco", price: 55, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Cuidados Pessoais", eco: true, rating: 4.9, stock: "Em estoque", description: "Escova de dentes de bambu, sabonete natural.", details: "100% biodegradável, embalagem mínima." },
  { id: 9, name: "Caderno Sustentável", price: 35, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Papelaria", eco: true, rating: 4.6, stock: "Em estoque", description: "Papel reciclado e capa de cortiça natural.", details: "80 folhas pontilhadas, espiral reciclada." },
  { id: 10, name: "Óculos de Sol Eco", price: 130, image: "https://images.unsplash.com/photo-1577474083793-3e3d4c9e8e7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Acessórios", eco: true, rating: 4.8, stock: "Em estoque", description: "Armação de madeira reciclada e lentes polarizadas.", details: "Proteção UV400, estojo de cortiça." },
];

// ─── Formulário de Checkout ───────────────────────────────────────────────────
function CheckoutModal({ cart, totalPrice, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = formulário, 2 = sucesso
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", endereco: "", pagamento: "pix" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.email.trim()) e.email = "Email obrigatório";
    if (!form.telefone.trim()) e.telefone = "Telefone obrigatório";
    if (!form.endereco.trim()) e.endereco = "Endereço obrigatório";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    // Simula envio do pedido para o backend
    await new Promise(res => setTimeout(res, 1500));
    setLoading(false);
    setStep(2);

confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#4caf50', '#81c784', '#2e7d32'] });
onSuccess();
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: errors[field] ? "2px solid #ef4444" : "1.5px solid var(--border)",
    background: "var(--bg-primary)", color: "var(--text-primary)",
    fontSize: "1rem", outline: "none", boxSizing: "border-box",
    marginTop: "6px",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 }}
      onClick={onClose}>
      <div style={{ background: "var(--bg-card)", borderRadius: "24px", maxWidth: "560px", width: "90%", maxHeight: "90vh", overflowY: "auto", padding: "2.5rem", position: "relative", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "var(--text-secondary)" }}>
          <FaTimes />
        </button>

        {step === 1 ? (
          <>
            <h2 style={{ color: "var(--accent)", marginBottom: "0.5rem" }}>🛒 Finalizar Pedido</h2>

            {/* Resumo do pedido */}
            <div style={{ background: "var(--bg-primary)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                  <span>{item.name} x{item.quantity}</span>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontWeight: "800", fontSize: "1.1rem", color: "var(--accent)" }}>
                <span>Total</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Dados do comprador */}
            <h3 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>Seus dados</h3>

            <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: "600" }}>Nome completo</label>
            <input style={inputStyle("nome")} value={form.nome} onChange={e => { setForm({ ...form, nome: e.target.value }); setErrors({ ...errors, nome: "" }); }} placeholder="João Silva" />
            {errors.nome && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.nome}</span>}

            <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: "600", marginTop: "1rem", display: "block" }}>Email</label>
            <input style={inputStyle("email")} value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} placeholder="joao@email.com" type="email" />
            {errors.email && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.email}</span>}

            <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: "600", marginTop: "1rem", display: "block" }}>Telefone</label>
            <input style={inputStyle("telefone")} value={form.telefone} onChange={e => { setForm({ ...form, telefone: e.target.value }); setErrors({ ...errors, telefone: "" }); }} placeholder="(38) 99999-9999" />
            {errors.telefone && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.telefone}</span>}

            <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: "600", marginTop: "1rem", display: "block" }}>Endereço de entrega</label>
            <input style={inputStyle("endereco")} value={form.endereco} onChange={e => { setForm({ ...form, endereco: e.target.value }); setErrors({ ...errors, endereco: "" }); }} placeholder="Rua das Flores, 123 - Bairro, Cidade" />
            {errors.endereco && <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>{errors.endereco}</span>}

            {/* Forma de pagamento */}
            <h3 style={{ color: "var(--text-primary)", margin: "1.5rem 0 1rem" }}>Forma de pagamento</h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {[
                { value: "pix", label: "💚 PIX", desc: "Aprovação imediata" },
                { value: "cartao", label: "💳 Cartão", desc: "Crédito ou débito" },
                { value: "boleto", label: "📄 Boleto", desc: "Vence em 3 dias" },
              ].map(opt => (
                <div key={opt.value} onClick={() => setForm({ ...form, pagamento: opt.value })}
                  style={{ flex: 1, minWidth: "130px", padding: "14px", borderRadius: "12px", border: `2px solid ${form.pagamento === opt.value ? "var(--accent)" : "var(--border)"}`, background: form.pagamento === opt.value ? "rgba(99,102,241,0.08)" : "transparent", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)" }}>{opt.label}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>{opt.desc}</div>
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={loading}
              style={{ marginTop: "2rem", width: "100%", padding: "1.1rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "999px", fontWeight: "800", fontSize: "1.15rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.3s" }}>
              {loading ? "Processando..." : `Confirmar Pedido · R$ ${totalPrice.toFixed(2)}`}
            </button>
          </>
        ) : (
          // Tela de sucesso
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <FaCheckCircle size={72} color="#4caf50" style={{ marginBottom: "1.5rem" }} />
            <h2 style={{ color: "var(--accent)", fontSize: "2rem", marginBottom: "1rem" }}>Pedido confirmado! 🎉</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.7" }}>
              Obrigado, <strong>{form.nome}</strong>!<br />
              Você receberá a confirmação em <strong>{form.email}</strong>.<br />
              Entrega em até <strong>5 dias úteis</strong>.
            </p>
            <button
  onClick={onClose}
  style={{
    marginTop: "1.5rem", padding: "0.9rem 2.5rem",
    background: "var(--accent)", color: "white", border: "none",
    borderRadius: "999px", fontWeight: "700", fontSize: "1.1rem",
    cursor: "pointer",
  }}
>
  Fechar ✓
</button>   
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [filter, setFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, dispatchCart] = useReducer(cartReducer, []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [pendingAdd, setPendingAdd] = useState(null);

  const itemsPerPage = 6;

  const filteredProducts = products
    .filter(p => (filter === "Todos" || p.category === filter))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    if (pendingAdd) {
      dispatchCart({ type: 'ADD_TO_CART', payload: pendingAdd });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#4caf50', '#81c784', '#2e7d32', '#ffffff'] });
      setToastMessage(`${pendingAdd.name} adicionado ao carrinho!`);
      setTimeout(() => setToastMessage(null), 3000);
      setPendingAdd(null);
    }
  }, [pendingAdd]);

  const addToCart = useCallback((product) => {
    setSelectedProduct(null);
    setPendingAdd(product);
  }, []);

  const removeFromCart = useCallback((id) => dispatchCart({ type: 'REMOVE_FROM_CART', payload: id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatchCart({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }), []);
  const clearCart = useCallback(() => dispatchCart({ type: 'CLEAR_CART' }), []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", padding: "3rem 2rem", overflowX: "hidden", position: "relative" }}>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          totalPrice={totalPrice}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => { dispatchCart({ type: 'CLEAR_CART' }); setShowCart(false); }}
        />
      )}

      {/* Cabeçalho */}
      <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative" }}>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.2rem)", fontWeight: "900", marginBottom: "0.8rem", background: "linear-gradient(90deg, var(--accent), #81c784, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🛍️ Mercado Sustentável
        </h1>
        <p style={{ fontSize: "1.4rem", color: "var(--text-secondary)", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
          Produtos que cuidam de você e do planeta ♻️
        </p>

        {/* Carrinho */}
        <div style={{ position: "absolute", top: "0", right: "0", background: "var(--bg-card)", padding: "1rem 1.5rem", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", border: "1px solid rgba(var(--accent), 0.2)", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
          onClick={() => setShowCart(true)}>
          <div style={{ position: "relative" }}>
            <FaShoppingCart size={28} color="var(--accent)" />
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "var(--accent)", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold" }}>
                {totalItems}
              </span>
            )}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>
            <div style={{ fontWeight: "600" }}>R$ {totalPrice.toFixed(2)}</div>
            <div style={{ fontSize: "0.9rem" }}>{totalItems} item{totalItems !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>

      {/* Busca + Filtro */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
        <input type="text" placeholder="Buscar por nome do produto..." value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={{ padding: "0.9rem 1.5rem", borderRadius: "999px", border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", width: "100%", maxWidth: "500px", fontSize: "1.1rem", outline: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {["Todos", "Vestuário", "Calçados", "Acessórios"].map(cat => (
            <button key={cat} onClick={() => { setFilter(cat); setCurrentPage(1); }}
              style={{ padding: "0.8rem 1.8rem", borderRadius: "999px", border: "2px solid var(--border)", background: filter === cat ? "var(--accent)" : "transparent", color: filter === cat ? "white" : "var(--text-primary)", fontWeight: filter === cat ? "700" : "500", cursor: "pointer", transition: "all 0.3s ease" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de produtos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", maxWidth: "1400px", margin: "0 auto" }}>
        {currentItems.map((product, index) => (
          <div key={product.id} onClick={() => setSelectedProduct(product)}
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer", border: "1px solid rgba(var(--accent), 0.15)", opacity: 0, transform: "translateY(30px)", animation: `fadeUp 0.6s ease-out ${index * 0.1}s forwards` }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-15px) scale(1.04)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)"; }}>
            <style>{`@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ height: "300px", background: `url(${product.image}) center/cover no-repeat`, position: "relative" }}>
              <div style={{ position: "absolute", top: "15px", right: "15px", background: "rgba(0,0,0,0.6)", color: "white", padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.9rem", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FaLeaf size={14} /> Eco-Friendly
              </div>
            </div>

            <div style={{ padding: "1.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <h3 style={{ fontSize: "1.5rem", margin: 0, color: "var(--text-primary)", fontWeight: "700" }}>{product.name}</h3>
                <div style={{ display: "flex", alignItems: "center", color: "#f59e0b" }}>
                  <FaStar size={18} />
                  <span style={{ marginLeft: "0.4rem", fontSize: "1rem", fontWeight: "600" }}>{product.rating}</span>
                </div>
              </div>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.2rem", lineHeight: "1.6" }}>{product.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.7rem", fontWeight: "800", color: "var(--accent)" }}>R$ {product.price}</span>
                <span style={{ fontSize: "0.9rem", color: product.stock.includes("Poucas") ? "#ef4444" : "var(--text-secondary)", fontWeight: "500" }}>{product.stock}</span>
              </div>
              <button style={{ marginTop: "1.5rem", padding: "0.9rem 1.8rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "700", width: "100%", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", transition: "all 0.3s ease" }}
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                <FaShoppingCart size={20} /> Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)}
              style={{ padding: "0.7rem 1.2rem", borderRadius: "999px", border: "1px solid var(--border)", background: currentPage === page ? "var(--accent)" : "transparent", color: currentPage === page ? "white" : "var(--text-primary)", fontWeight: currentPage === page ? "700" : "500", cursor: "pointer", transition: "all 0.3s ease" }}>
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal de produto */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
          onClick={() => setSelectedProduct(null)}>
          <div style={{ background: "var(--bg-card)", borderRadius: "20px", maxWidth: "600px", width: "90%", padding: "2rem", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", color: "var(--text-primary)" }}
            onClick={e => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => setSelectedProduct(null)}><FaTimes /></button>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "12px", marginBottom: "1.5rem" }} />
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--accent)" }}>{selectedProduct.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", color: "#f59e0b" }}><FaStar size={20} /><span style={{ marginLeft: "0.5rem", fontSize: "1.2rem", fontWeight: "600" }}>{selectedProduct.rating}</span></div>
              <span style={{ fontSize: "1.1rem", color: selectedProduct.stock.includes("Poucas") ? "#ef4444" : "var(--text-secondary)" }}>{selectedProduct.stock}</span>
            </div>
            <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{selectedProduct.description}</p>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>{selectedProduct.details}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--accent)" }}>R$ {selectedProduct.price}</span>
              <button style={{ padding: "1rem 2rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "700", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}
                onClick={(e) => { e.stopPropagation(); addToCart(selectedProduct); }}>
                <FaShoppingCart size={24} /> Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Carrinho */}
      {showCart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}
          onClick={() => setShowCart(false)}>
          <div style={{ background: "var(--bg-card)", borderRadius: "20px", maxWidth: "700px", width: "90%", maxHeight: "80vh", overflowY: "auto", padding: "2rem", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", color: "var(--text-primary)" }}
            onClick={e => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-secondary)", cursor: "pointer" }} onClick={() => setShowCart(false)}><FaTimes /></button>
            <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "var(--accent)", textAlign: "center" }}>Seu Carrinho</h2>

            {cart.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "1.2rem" }}>Seu carrinho está vazio. Que tal adicionar algo sustentável? ♻️</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: "var(--text-primary)" }}>{item.name}</h4>
                      <p style={{ margin: "0.3rem 0 0", color: "var(--text-secondary)" }}>R$ {item.price} x {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => updateQuantity(item.id, item.quantity - 1)}><FaMinus size={12} /></button>
                        <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                        <button style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => updateQuantity(item.id, item.quantity + 1)}><FaPlus size={12} /></button>
                      </div>
                      <button style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }} onClick={() => removeFromCart(item.id)}><FaTrash size={18} /></button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: "2rem", textAlign: "right", fontSize: "1.5rem", fontWeight: "700", color: "var(--accent)" }}>
                  Total: R$ {totalPrice.toFixed(2)}
                </div>

                <button style={{ marginTop: "1.5rem", padding: "1rem 2rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: "700", width: "100%", fontSize: "1.2rem" }}
                  onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                  Finalizar Compra 🛒
                </button>

                <button style={{ marginTop: "1rem", padding: "0.8rem 1.5rem", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "999px", cursor: "pointer", fontWeight: "600", width: "100%" }}
                  onClick={clearCart}>
                  Limpar Carrinho
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(0,0,0,0.8)", color: "white", padding: "1.5rem 3rem", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", zIndex: 3000, pointerEvents: "none" }}>
          {toastMessage}
        </div>
      )}

      <footer style={{ padding: "4rem 2rem 2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "1rem", borderTop: "1px solid var(--border)" }}>
        EarthLoop © Copyright {new Date().getFullYear()} • Compras conscientes para um planeta mais verde
      </footer>
    </div>
  );
}