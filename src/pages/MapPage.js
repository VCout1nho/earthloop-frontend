import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

// ==================== ÍCONES ====================

const doacaoIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:#2e7d32; color:white; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; border:4px solid white; box-shadow:0 6px 15px rgba(0,0,0,0.3);">🌱</div>`,
  iconSize: [46, 46],
  iconAnchor: [23, 46],
});

const vendaIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:#ef6c00; color:white; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; border:4px solid white; box-shadow:0 6px 15px rgba(0,0,0,0.3);">🛒</div>`,
  iconSize: [46, 46],
  iconAnchor: [23, 46],
});

const restaurantIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:#d32f2f; color:white; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; border:4px solid white; box-shadow:0 6px 15px rgba(0,0,0,0.3);">🍴</div>`,
  iconSize: [46, 46],
  iconAnchor: [23, 46],
});

const supermarketIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:#2e7d32; color:white; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; border:4px solid white; box-shadow:0 6px 15px rgba(0,0,0,0.3);">🛒</div>`,
  iconSize: [46, 46],
  iconAnchor: [23, 46],
});

function MapPage() {
  const [position] = useState([-16.73, -43.86]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [anuncios, setAnuncios] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Carregar anúncios do localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("anuncios")) || [];
    setAnuncios(data);
  }, []);

  // Busca inicial de lugares
  useEffect(() => {
    fetchNearbyPlaces(-16.73, -43.86);
  }, []);

  const fetchNearbyPlaces = async (lat, lng) => {
    setLoading(true);
    try {
      const query = `
[out:json][timeout:20];
(
  node["shop"="supermarket"](around:7000,${lat},${lng});
  node["amenity"="restaurant"](around:7000,${lat},${lng});
);
out body;
>;
out skel qt;
`;

      const res = await axios.get("https://earthloop-backend.onrender.com/api/places", { params: { data: query } });

      const formatted = (res.data.elements || []).map(p => ({
        id: p.id,
        lat: p.lat,
        lng: p.lon,
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
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: `${searchQuery} Montes Claros MG`, format: 'json', limit: 1 }
      });
      if (res.data?.[0]) {
        fetchNearbyPlaces(parseFloat(res.data[0].lat), parseFloat(res.data[0].lon));
      }
    } catch (err) {
      alert("Erro ao realizar a busca.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '76px', flexShrink: 0 }} />

      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* ==================== PAINEL LATERAL ==================== */}
        {selectedItem && (
          <div style={{
            width: '380px',
            background: '#f8faf5',
            borderRight: '1px solid #ddd',
            padding: '25px',
            overflowY: 'auto',
            boxShadow: '4px 0 15px rgba(0,0,0,0.08)',
            zIndex: 1000,
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              position: 'relative'
            }}>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  width: '36px', height: '36px', background: '#f1f1f1',
                  border: 'none', borderRadius: '50%', fontSize: '22px',
                  cursor: 'pointer', color: '#555'
                }}
              >
                ✕
              </button>

              {selectedItem.isAnuncio ? (
                // ==================== CARD PARA ANÚNCIO ====================
                <>
                  {selectedItem.imagePreview && (
                    <img 
                      src={selectedItem.imagePreview} 
                      alt={selectedItem.itemName}
                      style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }}
                    />
                  )}
                  <h2 style={{ color: '#1b5e20', margin: '0 0 8px' }}>
                    {selectedItem.itemName}
                  </h2>
                  <p style={{ color: selectedItem.type === 'doacao' ? '#2e7d32' : '#ef6c00', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {selectedItem.type === 'doacao' ? '🌱 Doação' : '🛒 Venda'}
                  </p>

                  <p><strong>Quantidade:</strong> {selectedItem.quantity}</p>
                  {selectedItem.type === 'venda' && selectedItem.price && (
                    <p><strong>Preço:</strong> R$ {selectedItem.price}</p>
                  )}
                  <p style={{ marginTop: '12px' }}>{selectedItem.description}</p>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <strong>{selectedItem.businessName}</strong><br />
                    📍 {selectedItem.location}<br />
                    📞 {selectedItem.contact}
                  </div>
                </>
              ) : (
                // ==================== CARD PARA SUPERMERCADO/RESTAURANTE (original) ====================
                <>
                  <h2 style={{ color: '#2e7d32', margin: '0 0 12px' }}>{selectedItem.name}</h2>
                  <p style={{ color: '#555', marginBottom: '20px' }}>{selectedItem.address}</p>
                  <p style={{ color: '#2e7d32', fontWeight: '600' }}>📞 {selectedItem.phone}</p>

                  <div style={{ marginTop: '28px' }}>
                    <h3 style={{ color: '#2e7d32' }}>🌱 Itens para Doação</h3>
                    <ul style={{ paddingLeft: '22px', color: '#444' }}>
                      {selectedItem.donationItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  <div style={{ marginTop: '26px' }}>
                    <h3 style={{ color: '#2e7d32' }}>🛒 Itens à Venda</h3>
                    <ul style={{ paddingLeft: '22px', color: '#444' }}>
                      {selectedItem.saleItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => alert(`✅ Contato solicitado com ${selectedItem.businessName || selectedItem.name}!`)}
              style={{ 
                marginTop: '30px', width: '100%', padding: '16px', 
                background: '#2e7d32', color: 'white', border: 'none', 
                borderRadius: '12px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' 
              }}
            >
              Entrar em Contato
            </button>
          </div>
        )}

        {/* ==================== MAPA + BUSCA ==================== */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Barra de Pesquisa */}
          <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: '580px', background: '#f8faf5', border: '1px solid #ddd', borderRadius: '50px', overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="Buscar supermercados, restaurantes ou bairros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ flex: 1, padding: '14px 20px', border: 'none', background: 'transparent', fontSize: '1.05rem', outline: 'none' }}
              />
              <button onClick={handleSearch} style={{ padding: '0 26px', background: '#2e7d32', color: '#fff', border: 'none', cursor: 'pointer' }}>
                🔎
              </button>
            </div>
          </div>

          {/* Mapa */}
          <div style={{ flex: 1, position: 'relative' }}>
            {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2000, background: 'rgba(255,255,255,0.95)', padding: '1rem 2rem', borderRadius: '16px', color: '#2e7d32', fontWeight: '600' }}>Buscando...</div>}

            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marcadores de Supermercados e Restaurantes */}
              {filteredPlaces.map((place) => (
                <Marker
                  key={`place-${place.id}`}
                  position={[place.lat, place.lng]}
                  icon={place.type === 'supermarket' ? supermarketIcon : restaurantIcon}
                  eventHandlers={{ click: () => handleMarkerClick(place, false) }}
                />
              ))}

              {/* Marcadores de Anúncios */}
              {anuncios.map((item) => {
                if (!item.lat || !item.lng) return null;
                return (
                  <Marker
                    key={`anuncio-${item.id}`}
                    position={[item.lat, item.lng]}
                    icon={item.type === "doacao" ? doacaoIcon : vendaIcon}
                    eventHandlers={{ click: () => handleMarkerClick(item, true) }}
                  />
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;