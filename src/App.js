// src/App.js
// Exemplo de como integrar o PrivateRoute nas suas rotas.
// Substitua o conteúdo do seu App.js por este (ajuste os imports conforme seu arquivo atual).

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Páginas (ajuste os caminhos conforme sua estrutura)
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import DashboardPage from "./pages/DashboardPage";
import AnunciePage from "./pages/AnunciePage";
import MarketplacePage from "./pages/MarketplacePage";
import MapPage from "./pages/MapPage";
import AIPage from "./pages/AIPage";
import SuportePage from "./pages/SuportePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/suporte" element={<SuportePage />} />

        {/* Rotas protegidas — exigem login */}
        <Route path="/dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/anuncie" element={
          <PrivateRoute><AnunciePage /></PrivateRoute>
        } />
        <Route path="/ai" element={
          <PrivateRoute><AIPage /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}