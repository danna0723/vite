import { useState } from 'react';
import "../css/Navbar.css";




export default function Navbar({ user, onLogout, theme, onToggleTheme }) {
  return (
    <nav className="navbar">
      <a href="#" className="logo">
        <img src="https://images.vexels.com/media/users/3/320109/isolated/preview/3c5bd5afae30fa42737e2945846cff64-cute-cat-in-pixel-art-style.png" alt="PixelCatGames Logo" />
      </a>
      <ul className="menu">
        <li>Inicio</li>
        <li>Servicios</li>
        <li>Contacto</li>
      </ul>
      <div className="usuario">
        {/*Tema*/}
        <button onClick={onToggleTheme} aria-label="Cambiar Tema">{theme === "light" ? "🌙" : "☀️"}</button>

        {user ? (
          <>
            <span style={{ marginRight: 8 }}>Holi {user}</span>
            <img src="https://i.pinimg.com/736x/c7/a4/dc/c7a4dcd0de4b07295caa8386f98f63db.jpg" alt="Profile" className="profile-image" />
            <button onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
