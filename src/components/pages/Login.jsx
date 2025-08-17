import { useState } from "react";
import "../css/Login.css";
export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [registrando, setRegistrando] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (registrando) {
            // Guardar usuario nuevo
            localStorage.setItem("usuario", JSON.stringify({ usuario, clave }));
            setMensaje("Usuario registrado. Ahora inicia sesión.");
            setRegistrando(false);
            setClave("");
            return;
        }

        // Intento de login
        const datos = JSON.parse(localStorage.getItem("usuario") || "null");
        if (datos && datos.usuario === usuario && datos.clave === clave) {
            localStorage.setItem("sesion", "activa");
            setMensaje("Bienvenido " + usuario);
            // Avisar al componente padre (App) que el login fue exitoso
            onLogin?.();
        } else {
            setMensaje("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>{registrando ? "Registrar Usuario" : "Iniciar Sesión"}</h1>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        {registrando ? "Registrar" : "Ingresar"}
                    </button>
                </form>
                <div className="login-footer"> 
                <button
                    onClick={() => {
                        setRegistrando(!registrando);
                        setMensaje("");
                    }} className="login-button"
                >
                    {registrando ? "Ya tengo cuenta" : "Crear nueva cuenta"}
                </button>

                {mensaje && <p style={{ marginTop: "20px" }}>{mensaje}</p>}
            </div>
        </div>
</div>
    );
}