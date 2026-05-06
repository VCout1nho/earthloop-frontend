// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import AIPage from './pages/AIPage'; 
import AnunciePage from './pages/AnunciePage'; 
import SuportePage from './pages/SuportePage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';

import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/painel" element={<DashboardPage />} />
          <Route path="/mercado" element={<MarketplacePage />} />
          <Route path="/ai" element={<AIPage />} />  
          <Route path="/anuncie" element={<AnunciePage />} />
          <Route path="/suporte" element={<SuportePage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;