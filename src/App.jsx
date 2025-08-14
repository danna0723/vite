import { Fragment } from 'react'
import './components/css/Navbar.css';
import React from 'react';
import ListaDeGustos from "./components/pages/Lista.jsx";
import Navbar from "./components/pages/Navbar";
import Footer from "./components/pages/Footer";
import { useState, useEffect } from 'react';
import Login from "./components/pages/login.jsx";

export default function App() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const ses = localStorage.getItem("sesion") === "activa";
    const usu = JSON.parse(localStorage.getItem("usuario") || "null");
    setSesionActiva(ses);
    setUser(usu);
  }, []);

  const handleLoginSucess = () => {
    setSesionActiva(true);
    setUser(JSON.parse(localStorage.getItem("usuario") || "null"));
  }

  const handleLogout = () => {
    setSesionActiva(false);
    localStorage.removeItem("sesion");
    setUser(null);
  }

  if (!sesionActiva) {
    //muestra el login si no hay sesion
    return <Login onLogin={handleLoginSucess} />;
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout}/>
      <main style={{ 
        paddingTop: '120px', 
        paddingBottom: '2rem',
        minHeight: 'calc(100vh - 120px)',
        position: 'relative'
      }}>
        <ListaDeGustos/>
      </main>
      <Footer/>
    </>
  );
}

