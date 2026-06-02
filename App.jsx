import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './src/pages/Login';
import CreateAccount from './src/pages/CreateAccount';
import ForgotPassword from './src/pages/ForgotPassword';
import Inventario from './src/pages/Inventario';
import Dashboard from './src/pages/index';
import EditarPerfil from './src/pages/EditarPerfil';
import CambiarContrasena from './src/pages/CambiarContrasena';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
      </Routes>
    </Router>
  );
}

export default App;