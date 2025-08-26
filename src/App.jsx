import { Fragment, useState, useEffect } from 'react';
import './components/css/Navbar.css';
import React from 'react';
import ListaDeGustos from "./components/pages/Lista.jsx";
import Navbar from "./components/pages/Navbar.jsx";
import Footer from "./components/pages/Footer";
import Login from "./components/pages/Login.jsx";
import Todo from "./components/pages/Todo.jsx";

export default function App() {
  const [sesionActiva, setSesionActiva] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const ses = localStorage.getItem("sesion") === "activa";
    const usu = localStorage.getItem("usuario"); // string
    setSesionActiva(ses);
    setUser(usu); // user es string

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleLoginSucess = (usuario) => {
    setSesionActiva(true);
    setUser(usuario); // string
    localStorage.setItem("sesion", "activa");
    localStorage.setItem("usuario", usuario); // string
  };

  const handleLogout = () => {
    setSesionActiva(false);
    localStorage.removeItem("sesion");
    localStorage.removeItem("usuario");
    setUser(null);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      {sesionActiva && (
        <Navbar 
          user={user} 
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      <main style={{ 
        paddingTop: '120px', 
        paddingBottom: '2rem',
        minHeight: 'calc(100vh - 120px)',
        position: 'relative'
      }}>
        {!sesionActiva ? (
          <Login onLogin={handleLoginSucess} />
        ) : (
          <>
            <ListaDeGustos />
            <Todo user={user} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}