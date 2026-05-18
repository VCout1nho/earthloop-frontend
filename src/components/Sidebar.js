import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaMapMarkedAlt, FaStore, FaRobot, FaBullhorn, FaHeadset, FaUserPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Lê o usuário do localStorage sempre que a rota muda
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '76px',
      background: '#2e7d32',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      gap: '2.5rem',
      color: 'white',
    }}>

      {/* Logo + Nome */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '1.75rem',
        }}
      >
        <img
          src="/logo.png"
          alt="EarthLoop Logo"
          style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
        />
        <span>EarthLoop</span>
      </div>

      {/* Menu Principal */}
      <nav style={{ display: 'flex', gap: '6px', flex: 1 }}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '12px 20px',
              borderRadius: '999px',
              background: isActive(item.path) ? 'white' : 'transparent',
              color: isActive(item.path) ? '#2e7d32' : 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              fontSize: '1.05rem',
            }}
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </nav>

      {/* Área de autenticação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          // Usuário logado — mostra nome e botão de sair
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.15)',
              padding: '10px 18px',
              borderRadius: '999px',
              fontWeight: '600',
              fontSize: '1rem',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'white',
                color: '#2e7d32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1rem',
              }}>
                {(user.nome || user.email || "U")[0].toUpperCase()}
              </div>
              <span>{user.nome || user.email}</span>
            </div>

            <div
              onClick={handleLogout}
              style={{
                padding: '11px 22px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255,255,255,0.4)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <FaSignOutAlt />
              Sair
            </div>
          </>
        ) : (
          // Usuário deslogado — mostra botões de cadastro e login
          <>
            <div
              onClick={() => navigate('/cadastro')}
              style={{
                padding: '11px 22px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255,255,255,0.4)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <FaUserPlus />
              Crie sua conta
            </div>

            <div
              onClick={() => navigate('/login')}
              style={{
                padding: '11px 22px',
                borderRadius: '999px',
                background: 'white',
                color: '#2e7d32',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <FaSignInAlt />
              Entre
            </div>
          </>
        )}
      </div>
    </header>
  );
}
