// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import AIPage from './pages/AIPage';
import AnunciePage from './pages/AnunciePage';
import SuportePage from './pages/SuportePage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/PerfilPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/mercado" element={<MarketplacePage />} />
          <Route path="/suporte" element={<SuportePage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas — exigem login */}
          <Route path="/painel" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/ai" element={<PrivateRoute><AIPage /></PrivateRoute>} />
          <Route path="/anuncie" element={<PrivateRoute><AnunciePage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><PerfilPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;