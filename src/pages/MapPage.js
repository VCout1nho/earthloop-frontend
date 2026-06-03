import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const doacaoIcon = L.divIcon({ className: 'custom-marker', html: `<div style="background:#2e7d32;color:white;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;border:4px solid white;box-shadow:0 6px 15px rgba(0,0,0,0.3);">🌱</div>`, iconSize: [46, 46], iconAnchor: [23, 46] });
const vendaIcon = L.divIcon({ className: 'custom-marker', html: `<div style="background:#ef6c00;color:white;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;border:4px solid white;box-shadow:0 6px 15px rgba(0,0,0,0.3);">🛒</div>`, iconSize: [46, 46], iconAnchor: [23, 46] });
const restaurantIcon = L.divIcon({ className: 'custom-marker', html: `<div style="background:#d32f2f;color:white;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;border:4px solid white;box-shadow:0 6px 15px rgba(0,0,0,0.3);">🍴</div>`, iconSize: [46, 46], iconAnchor: [23, 46] });
const supermarketIcon = L.divIcon({ className: 'custom-marker', html: `<div style="background:#2e7d32;color:white;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;border:4px solid white;box-shadow:0 6px 15px rgba(0,0,0,0.3);">🛒</div>`, iconSize: [46, 46], iconAnchor: [23, 46] });

function MapPage() {
  const [position] = useState([-16.73, -43.86]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [loadingAnuncios, setLoadingAnuncios] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    async function carregarAnuncios() {
      setLoadingAnuncios(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${BASE_URL}/api/anuncios/todos`, { headers });
        setAnuncios(res.data || []);
      } catch (err) {
        console.warn("Anúncios do backend indisponíveis:", err.message);
        const local = JSON.parse(localStorage.getItem("anuncios")) || [];
        setAnuncios(local);
      } finally {
        setLoadingAnuncios(false);
      }
    }
    carregarAnuncios();
  }, []);

  useEffect(() => {
    fetchNearbyPlaces(-16.73, -43.86);
  }, []);

  const fetchNearbyPlaces = async (lat, lng) => {
    setLoading(true);
    try {
      const query = `[out:json][timeout:20];(node["shop"="supermarket"](around:7000,${lat},${lng});node["amenity"="restaurant"](around:7000,${lat},${lng}););out center;`;
      const res = await axios.get(`${BASE_URL}/api/places`, { params: { data: query } });
      const formatted = (res.data.elements || []).map(p => ({
        id: p.id, lat: p.lat, lng: p.lon,
        name: p.tags?.name || 'Local sem nome',
        type: p.tags?.shop === 'supermarket' ? 'supermarket' : 'restaurant',
        address: `${p.tags?.["addr:street"] || 'Rua principal'}, Montes Claros - MG`,
        phone: '(38) 9XXXX-XXXX',
        donationItems: ['Arroz integral (5kg)', 'Feijão orgânico (1kg)', 'Óleo de soja (900ml)'],
        saleItems: ['Macarrão (500g)', 'Leite desnatado (1L)', 'Macarrão instantâneo'],
      }));
      setFilteredPlaces(formatted);
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (item, isAnuncio = false) => {
    setSelectedItem({ ...item, isAnuncio });
    setCopiado(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: `${searchQuery} Montes Claros MG`, format: 'json', limit: 1 }
      });
      if (res.data?.[0]) fetchNearbyPlaces(parseFloat(res.data[0].lat), parseFloat(res.data[0].lon));
    } catch {
      alert("Erro ao realizar a busca.");
    } finally {
      setLoading(false);
    }
  };

  const compartilharAnuncio = (item) => {
    const url = `${window.location.origin}/anuncio/${item._id || item.id}`;
    if (navigator.share) {
      navigator.share({ title: item.itemName, text: `Vi um anúncio de ${item.itemName} no EarthLoop!`, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const abrirWhatsApp = (item) => {
    const telefone = (item.contact || item.phone || "").replace(/\D/g, "");
    const nome = item.businessName || item.name || "estabelecimento";
    const produto = item.itemName || "";
    const mensagem = produto
      ? `Olá! Vi seu anúncio de *${produto}* no EarthLoop e tenho interesse!`
      : `Olá! Vi o *${nome}* no EarthLoop e gostaria de mais informações.`;
    if (telefone) {
      window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");
    } else {
      alert(`Entre em contato com ${nome} pelo telefone informado.`);
    }
  };

  const anunciosFiltrados = anuncios.filter(a => {
    if (!a.lat || !a.lng) return false;
    if (filtroAtivo === "doacao") return a.type === "doacao";
    if (filtroAtivo === "venda") return a.type === "venda";
    return true;
  });

  const lugaresFiltrados = (filtroAtivo === "todos" || filtroAtivo === "lugares") ? filteredPlaces : [];
  const totalAnuncios = anuncios.filter(a => a.lat && a.lng).length;

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '76px', flexShrink: 0 }} />

      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* ── Painel lateral ── */}
        {selectedItem && (
          <div style={{
            width: '360px', background: 'white', borderRight: '1px solid #e0e8db',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '4px 0 20px rgba(0,0,0,0.08)'
          }}>

            {/* Header colorido */}
            <div style={{
              background: selectedItem.isAnuncio
                ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)'
                : 'linear-gradient(135deg, #bf360c 0%, #d84315 60%, #e64a19 100%)',
              padding: '20px 20px 16px', position: 'relative', flexShrink: 0
            }}>
              <button onClick={() => setSelectedItem(null)} style={{
                position: 'absolute', top: '14px', right: '14px', width: '28px', height: '28px',
                background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%',
                color: 'white', fontSize: '14px', cursor: 'pointer'
              }}>✕</button>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600',
                letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px',
                background: 'rgba(255,255,255,0.18)',
                color: selectedItem.isAnuncio
                  ? (selectedItem.type === 'doacao' ? '#c8f5c0' : '#ffd580')
                  : '#ffd580',
                border: '1px solid rgba(255,255,255,0.25)'
              }}>
                {selectedItem.isAnuncio
                  ? (selectedItem.type === 'doacao' ? '🌱 Doação' : '🛒 Venda')
                  : (selectedItem.type === 'supermarket' ? '🛒 Supermercado' : '🍴 Restaurante')}
              </div>

              <div style={{
                fontFamily: 'Georgia, serif', fontSize: '20px', color: 'white',
                lineHeight: '1.2', marginBottom: '6px', paddingRight: '36px'
              }}>
                {selectedItem.isAnuncio ? selectedItem.itemName : selectedItem.name}
              </div>

              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                📍 {selectedItem.isAnuncio ? selectedItem.location : selectedItem.address}
              </div>
            </div>

            {/* Imagem (só para anúncios com foto) */}
            {selectedItem.isAnuncio && selectedItem.imagePreview && (
              <img
                src={selectedItem.imagePreview}
                alt={selectedItem.itemName}
                style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block', flexShrink: 0 }}
              />
            )}

            {/* Corpo scrollável */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {selectedItem.isAnuncio ? (
                <>
                  {[
                    { icon: '📦', label: 'Quantidade', value: selectedItem.quantity },
                    { icon: '🏪', label: 'Anunciante', value: selectedItem.businessName },
                    { icon: '📞', label: 'Contato', value: selectedItem.contact },
                    ...(selectedItem.type === 'venda' && selectedItem.price
                      ? [{ icon: '💰', label: 'Preço', value: `R$ ${selectedItem.price}` }]
                      : []),
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f0f4ed' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                        {row.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{row.label}</div>
                        <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>{row.value}</div>
                      </div>
                    </div>
                  ))}
                  {selectedItem.description && (
                    <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.6', marginTop: '12px' }}>
                      {selectedItem.description}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f0f4ed' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>📞</div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Telefone</div>
                      <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>{selectedItem.phone}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '16px 0 8px' }}>
                    🌱 Itens para Doação
                  </div>
                  <div>
                    {selectedItem.donationItems.map((item, i) => (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', background: '#f0f7ee', border: '1px solid #c8e6c9', borderRadius: '999px', padding: '5px 11px', fontSize: '12.5px', color: '#2e7d32', margin: '3px 3px 3px 0' }}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#e65100', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '16px 0 8px' }}>
                    🛒 Itens à Venda
                  </div>
                  <div>
                    {selectedItem.saleItems.map((item, i) => (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '999px', padding: '5px 11px', fontSize: '12.5px', color: '#e65100', margin: '3px 3px 3px 0' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer fixo com botões */}
            <div style={{ padding: '14px 16px', background: 'white', borderTop: '1px solid #e8f0e5', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => abrirWhatsApp(selectedItem)}
                style={{ width: '100%', padding: '13px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                📲 Entrar em contato via WhatsApp
              </button>

              {selectedItem.isAnuncio && (
                <button
                  onClick={() => compartilharAnuncio(selectedItem)}
                  style={{ width: '100%', padding: '11px', background: copiado ? '#2e7d32' : 'white', color: copiado ? 'white' : '#2e7d32', border: '1.5px solid #2e7d32', borderRadius: '10px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  {copiado ? '✅ Link copiado!' : '🔗 Compartilhar anúncio'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Mapa + barra de busca ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 20px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: '580px', background: '#f8faf5', border: '1px solid #ddd', borderRadius: '50px', overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="Buscar supermercados, restaurantes ou bairros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ flex: 1, padding: '14px 20px', border: 'none', background: 'transparent', fontSize: '1.05rem', outline: 'none' }}
              />
              <button onClick={handleSearch} style={{ padding: '0 26px', background: '#2e7d32', color: '#fff', border: 'none', cursor: 'pointer' }}>🔎</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { key: "todos", label: "🗺️ Todos" },
                { key: "doacao", label: `🌱 Doações (${anuncios.filter(a => a.lat && a.type === 'doacao').length})` },
                { key: "venda", label: `🛒 Vendas (${anuncios.filter(a => a.lat && a.type === 'venda').length})` },
                { key: "lugares", label: `🏪 Estabelecimentos (${filteredPlaces.length})` },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFiltroAtivo(f.key)}
                  style={{ padding: '8px 16px', borderRadius: '999px', border: `2px solid ${filtroAtivo === f.key ? '#2e7d32' : '#ddd'}`, background: filtroAtivo === f.key ? '#2e7d32' : 'white', color: filtroAtivo === f.key ? 'white' : '#444', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loadingAnuncios ? (
              <span style={{ fontSize: '0.85rem', color: '#888' }}>Carregando anúncios...</span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: '600' }}>
                {totalAnuncios > 0 ? `✅ ${totalAnuncios} anúncio(s) no mapa` : '📭 Nenhum anúncio com localização ainda'}
              </span>
            )}
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            {loading && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2000, background: 'rgba(255,255,255,0.95)', padding: '1rem 2rem', borderRadius: '16px', color: '#2e7d32', fontWeight: '600' }}>
                Buscando...
              </div>
            )}

            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {lugaresFiltrados.map((place) => (
                <Marker
                  key={`place-${place.id}`}
                  position={[place.lat, place.lng]}
                  icon={place.type === 'supermarket' ? supermarketIcon : restaurantIcon}
                  eventHandlers={{ click: () => handleMarkerClick(place, false) }}
                />
              ))}
              {anunciosFiltrados.map((item) => (
                <Marker
                  key={`anuncio-${item._id || item.id}`}
                  position={[item.lat, item.lng]}
                  icon={item.type === "doacao" ? doacaoIcon : vendaIcon}
                  eventHandlers={{ click: () => handleMarkerClick(item, true) }}
                />
              ))}
            </MapContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MapPage;