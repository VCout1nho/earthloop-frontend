import React, { useState, useEffect } from "react";

export default function AnunciePage() {
  const [form, setForm] = useState({
    businessName: "",
    location: "",
    contact: "",
    itemName: "",
    quantity: "",
    price: "",
    type: "doacao",
    description: "",
    imagePreview: "",
  });

  const [items, setItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("anuncios")) || [];
    setItems(stored);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newItem = {
      ...form,
      id: editingId || Date.now(),
      date: new Date().toISOString(),
    };

    try {
      const position = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(resolve, () => {}, { enableHighAccuracy: true, timeout: 8000 });
      });
      newItem.lat = position.coords.latitude;
      newItem.lng = position.coords.longitude;
    } catch {}

    const stored = JSON.parse(localStorage.getItem("anuncios")) || [];
    let updated = editingId 
      ? stored.map(item => item.id === editingId ? newItem : item)
      : [newItem, ...stored];

    localStorage.setItem("anuncios", JSON.stringify(updated));
    setItems(updated);
    setEditingId(null);
    setSuccessMessage(editingId ? "✅ Anúncio atualizado!" : "✅ Anúncio publicado!");
    resetForm();
    setIsSubmitting(false);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const resetForm = () => {
    setForm({
      businessName: "", location: "", contact: "", itemName: "", quantity: "",
      price: "", type: "doacao", description: "", imagePreview: ""
    });
  };

  const startEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updated = items.filter(item => item.id !== itemToDelete);
    setItems(updated);
    localStorage.setItem("anuncios", JSON.stringify(updated));
    setSuccessMessage("🗑️ Anúncio removido!");
    setShowDeleteModal(false);
    setItemToDelete(null);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="page">
      <div className="wrapper">
        <div className="header">
          <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
          fontWeight: "900",
          marginBottom: "0.8rem",
          background: "linear-gradient(90deg, var(--accent), #81c784, #4caf50)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          📢Anuncie alimentos
        </h1>
        </div>
             <p style={{
              fontSize: "1.4rem",
              color: "var(--text-secondary)",
              maxWidth: "800px",
              margin: "0 auto 1.5rem",
            }}>
              Doe ou venda alimentos excedentes do seu negócio e ajude a combater o desperdício!
             </p>

        {successMessage && <div className="success">{successMessage}</div>}

        <div className="grid">
          {/* Formulário */}
          <form className="form" onSubmit={handleSubmit}>
            <h3>Seu negócio</h3>
            <label>Nome do negócio</label>
            <input name="businessName" placeholder="Ex: Horta da Dona Maria" value={form.businessName} onChange={handleChange} required />

            <label>Localização</label>
            <input name="location" placeholder="Ex: Bairro Vila Nova, Montes Claros - MG" value={form.location} onChange={handleChange} required />

            <label>Contato (WhatsApp ou Telefone)</label>
            <input name="contact" placeholder="(38) 99999-9999" value={form.contact} onChange={handleChange} required />

            <h3>Produto</h3>

            <label>Foto do produto (opcional)</label>
            <label className="upload-area">
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              <div className="upload-content">📸 Clique ou arraste uma foto<br/><small>PNG, JPG ou WEBP • Máx. 5MB</small></div>
            </label>

            {form.imagePreview && <img src={form.imagePreview} alt="Preview" className="preview-image" />}

            <label>Nome do alimento</label>
            <input name="itemName" placeholder="Ex: Banana prata" value={form.itemName} onChange={handleChange} required />

            <div className="row">
              <div className="col">
                <label>Quantidade</label>
                <input name="quantity" type="number" placeholder="Ex: 25" value={form.quantity} onChange={handleChange} required />
              </div>
              <div className="col">
                <label>Tipo</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="doacao">Doação</option>
                  <option value="venda">Venda</option>
                </select>
              </div>
            </div>

            {form.type === "venda" && (
              <>
                <label>Preço (R$)</label>
                <input name="price" type="number" step="0.01" placeholder="15.00" value={form.price} onChange={handleChange} />
              </>
            )}

            <label>Descrição</label>
            <textarea name="description" placeholder="Descreva o produto, validade, condições..." value={form.description} onChange={handleChange} rows={4} />

            <button type="submit" className="publish-btn" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : editingId ? "💾 Atualizar Anúncio" : "🚀 Publicar Anúncio"}
            </button>
          </form>

          {/* Preview e Lista */}
          <div className="preview">
            <div className="card destaque">
              {form.imagePreview && <img src={form.imagePreview} alt="Preview" className="preview-image" />}
              <div className="top">
                <span className={`badge ${form.type}`}>{form.type === "doacao" ? "🌱 Doação" : "🛒 Venda"}</span>
                {form.type === "venda" && form.price && <span className="price">R$ {form.price}</span>}
              </div>
              <h2>{form.itemName || "Seu produto aqui"}</h2>
              <p className="description">{form.description || "Descrição do produto..."}</p>
              <div className="meta">
                <span>📍 {form.location || "Localização"}</span>
                <span>📦 {form.quantity || 0} un</span>
              </div>
              <div className="footer">
                <strong>{form.businessName || "Seu negócio"}</strong>
                <small>{form.contact || "Contato"}</small>
              </div>
            </div>

            <h4>Seus anúncios ({items.length})</h4>

            {items.length === 0 ? (
              <p className="empty-message">Nenhum anúncio publicado ainda.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="card small">
                  {item.imagePreview && <img src={item.imagePreview} alt={item.itemName} className="announce-image" />}
                  <div className="card-content">
                    <div className="card-header">
                      <span className={`badge ${item.type}`}>{item.type === "doacao" ? "🌱 Doação" : "🛒 Venda"}</span>
                      {item.type === "venda" && item.price && <span className="price">R$ {item.price}</span>}
                    </div>
                    <h3>{item.itemName}</h3>
                    <p className="description">{item.description || "Sem descrição"}</p>
                    <div className="meta-info">
                      <span>📍 {item.location}</span>
                      <span>📦 {item.quantity} un</span>
                    </div>
                    <div className="footer-info">
                      <strong>{item.businessName}</strong>
                      <small>{item.contact}</small>
                    </div>
                  </div>
                  <div className="actions">
                    <button onClick={() => startEdit(item)} className="edit-btn">✏️ Editar</button>
                    <button onClick={() => openDeleteModal(item.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar exclusão</h3>
            <p>Tem certeza que deseja remover este anúncio?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-delete">Sim, remover</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .page { min-height: 100vh; background: linear-gradient(135deg, #e8f5e9, #f1f8e9); padding: 40px 20px; }
        .wrapper { max-width: 1200px; margin: auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 2.8rem; color: #1b5e20; }

        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }

        .form { background: white; padding: 32px; border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
        label { display: block; margin: 16px 0 6px; font-weight: 600; color: #2e7d32; }
        input, select, textarea { width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #ddd; }

        .row { display: flex; gap: 15px; }
        .col { flex: 1; }

        .upload-area { border: 2px dashed #66bb6a; border-radius: 16px; padding: 40px 20px; text-align: center; cursor: pointer; background: #f8fff8; }
        .upload-area:hover { border-color: #2e7d32; }

        .preview-image { width: 100%; height: 210px; object-fit: cover; border-radius: 16px; margin: 12px 0; }

        .publish-btn { margin-top: 30px; padding: 18px; width: 100%; border: none; border-radius: 16px; background: linear-gradient(135deg, #2e7d32, #66bb6a); color: white; font-size: 1.2rem; font-weight: 700; cursor: pointer; }

        .card.destaque { background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 3px solid #a5d6a7; position: sticky; top: 20px; }
        .top { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .badge { padding: 6px 16px; border-radius: 999px; font-weight: 700; }
        .badge.doacao { background: #e8f5e9; color: #2e7d32; }
        .badge.venda { background: #fff3e0; color: #ef6c00; }

        .card.small { position: relative; background: white; border-radius: 20px; box-shadow: 0 10px 28px rgba(0,0,0,0.08); margin-bottom: 20px; overflow: hidden; }
        .announce-image { width: 100%; height: 190px; object-fit: cover; }
        .card-content { padding: 20px; }
        .actions { padding: 0 20px 20px; display: flex; gap: 10px; }
        .edit-btn, .delete-btn { flex: 1; padding: 12px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .edit-btn { background: #1976d2; color: white; }
        .delete-btn { background: #d32f2f; color: white; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; padding: 30px; border-radius: 20px; width: 90%; max-width: 400px; text-align: center; }
        .modal-buttons { margin-top: 25px; display: flex; gap: 15px; justify-content: center; }
        .confirm-delete { background: #d32f2f; color: white; padding: 12px 28px; border: none; border-radius: 12px; font-weight: bold; }
        .cancel-btn { background: #666; color: white; padding: 12px 28px; border: none; border-radius: 12px; }

        @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}