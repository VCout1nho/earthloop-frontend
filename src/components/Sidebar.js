// v4 - com responsividade mobile
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaMapMarkedAlt, FaStore, FaRobot, FaBullhorn, FaHeadset, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const lerUsuario = () => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  };

  useEffect(() => { lerUsuario(); }, [location.pathname]);
  useEffect(() => {
    window.addEventListener("auth-change", lerUsuario);
    return () => window.removeEventListener("auth-change", lerUsuario);
  }, []);

  // Fecha menu ao navegar
  const irPara = (path) => { navigate(path); setMenuAberto(false); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
    setMenuAberto(false);
  };

  const menuItems = [
    { name: "Início", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/painel", icon: <FaChartBar /> },
    { name: "Mapa", path: "/mapa", icon: <FaMapMarkedAlt /> },
    { name: "Loja", path: "/mercado", icon: <FaStore /> },
    { name: "Análise", path: "/ai", icon: <FaRobot /> },
    { name: "Anuncie", path: "/anuncie", icon: <FaBullhorn /> },
    { name: "Contato", path: "/suporte", icon: <FaHeadset /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '76px', background: '#2e7d32', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '2rem', color: 'white' }}>

        {/* Logo */}
        <div onClick={() => irPara('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1.75rem', flexShrink: 0 }}>
          <img src="/logo.png" alt="EarthLoop Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          <span>EarthLoop</span>
        </div>

        {/* Menu desktop */}
        <nav style={{ display: 'flex', gap: '4px', flex: 1, flexWrap: 'nowrap', overflow: 'hidden' }} className="desktop-nav">
          {menuItems.map((item) => (
            <div key={item.path} onClick={() => irPara(item.path)}
              style={{ padding: '10px 14px', borderRadius: '999px', background: isActive(item.path) ? 'white' : 'transparent', color: isActive(item.path) ? '#2e7d32' : 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
              {item.icon}{item.name}
            </div>
          ))}
        </nav>

        {/* Auth desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }} className="desktop-auth">
          {user ? (
            <>
              <div onClick={() => irPara('/perfil')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '999px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'white', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                  {(user.nome || user.email || "U")[0].toUpperCase()}
                </div>
                <span>{user.nome || user.email}</span>
              </div>
              <div onClick={handleLogout} style={{ padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', border: '2px solid rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                <FaSignOutAlt /> Sair
              </div>
            </>
          ) : (
            <>
              <div onClick={() => irPara('/cadastro')} style={{ padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', border: '2px solid rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                <FaUserPlus /> Cadastro
              </div>
              <div onClick={() => irPara('/login')} style={{ padding: '10px 18px', borderRadius: '999px', background: 'white', color: '#2e7d32', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                <FaSignInAlt /> Entrar
              </div>
            </>
          )}
        </div>

        {/* Botão hamburguer (mobile) */}
<button onClick={() => { setMenuAberto(!menuAberto); console.log("menu:", !menuAberto); }} className="hamburger"
  style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', marginLeft: 'auto' }}>
  {menuAberto ? <FaTimes /> : <FaBars />}
</button>
      </header>

      {/* Menu mobile */}
      {menuAberto && (
<div className="mobile-menu" style={{ position: 'fixed', top: '76px', left: 0, right: 0, bottom: 0, background: '#1b5e20', zIndex: 999, padding: '1.5rem', overflowY: 'auto', flexDirection: 'column', gap: '8px' }}>          {menuItems.map((item) => (
            <div key={item.path} onClick={() => irPara(item.path)}
              style={{ padding: '16px 20px', borderRadius: '14px', background: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.1)', color: isActive(item.path) ? '#2e7d32' : 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
              {item.icon}{item.name}
            </div>
          ))}

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {user ? (
              <>
                <div onClick={() => irPara('/perfil')} style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                  <FaUser /> Meu Perfil ({user.nome || user.email})
                </div>
                <div onClick={handleLogout} style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                  <FaSignOutAlt /> Sair da conta
                </div>
              </>
            ) : (
              <>
                <div onClick={() => irPara('/cadastro')} style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                  <FaUserPlus /> Criar conta
                </div>
                <div onClick={() => irPara('/login')} style={{ padding: '16px 20px', borderRadius: '14px', background: 'white', color: '#2e7d32', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                  <FaSignInAlt /> Entrar
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
  @media screen and (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .desktop-auth { display: none !important; }
    .mobile-menu { display: flex !important; }
  }
  @media screen and (min-width: 769px) {
    .mobile-menu { display: none !important; }
    .hamburger { display: none !important; }
  }
`}</style>
    </>
  );
}