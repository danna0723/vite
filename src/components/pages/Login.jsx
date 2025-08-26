import { useState } from "react";
import "../css/Login.css";
export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [registrando, setRegistrando] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Obtener lista de usuarios
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        if (registrando) {
            // Verificar si el usuario ya existe
            if (usuarios.some(u => u.usuario === usuario)) {
                setMensaje("Ese usuario ya existe");
                return;
            }
            // Guardar usuario nuevo
            const nuevo = { usuario, clave };
            localStorage.setItem("usuarios", JSON.stringify([...usuarios, nuevo]));
            setMensaje("Usuario registrado. Ahora inicia sesión.");
            setRegistrando(false);
            setClave("");
            return;
        }

        // Intento de login
        const datos = usuarios.find(u => u.usuario === usuario && u.clave === clave);
        if (datos) {
            localStorage.setItem("sesion", "activa");
            localStorage.setItem("usuario", datos.usuario); // Guarda solo el string
            setMensaje("Bienvenido " + usuario);
            // Avisar al componente padre (App) que el login fue exitoso
            onLogin?.(usuario);
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