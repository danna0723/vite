import { useState } from "react";
import "../css/Login.css";

export default function Login({onLogin}){
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [registrando, setRegistrando] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setMensaje(""); // Limpiar mensaje anterior
        
        //guardar usuario nuevo
        if(registrando){
            if(usuario.trim() === "" || clave.trim() === ""){
                setMensaje("Por favor completa todos los campos");
                return;
            }
            localStorage.setItem("usuario", JSON.stringify({usuario, clave}));
            setMensaje("Usuario registrado exitosamente. Ya puedes iniciar sesión");
            setRegistrando(false);
            setClave("");
            return;
        }
        
        //intento de login
        const datos = JSON.parse(localStorage.getItem("usuario") || "null");
        if(datos && datos.usuario === usuario && datos.clave === clave){
            localStorage.setItem("sesion","activa");
            setMensaje("Bienvenido " + usuario);
            //avisar al componente padre (APP) que el login fue exitoso
            onLogin?.();
        }
        else{
            setMensaje("Usuario o contraseña incorrectos");
        }
    };

    return(
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <img 
                        src="https://images.vexels.com/media/users/3/320109/isolated/preview/3c5bd5afae30fa42737e2945846cff64-cute-cat-in-pixel-art-style.png" 
                        alt="PixelCatGames Logo" 
                        className="login-logo"
                    />
                    <h2>{registrando ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
                    <p>{registrando ? "Regístrate para acceder" : "Accede a tu cuenta"}</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {mensaje && (
                        <div className={mensaje.includes("exitosamente") || mensaje.includes("Bienvenido") ? "success-message" : "error-message"}>
                            {mensaje}
                        </div>
                    )}
                    
                    <div className="input-group">
                        <label htmlFor="usuario">Usuario</label>
                        <input 
                            type="text" 
                            id="usuario"
                            placeholder="Ingresa tu usuario" 
                            value={usuario} 
                            onChange={(e) => setUsuario(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="clave">Contraseña</label>
                        <input 
                            type="password" 
                            id="clave"
                            placeholder="Ingresa tu contraseña" 
                            value={clave} 
                            onChange={(e) => setClave(e.target.value)} 
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        {registrando ? "Registrarse" : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {registrando ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
                        <button 
                            type="button"
                            onClick={() => {
                                setRegistrando(!registrando);
                                setMensaje("");
                                setClave("");
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#667eea",
                                cursor: "pointer",
                                textDecoration: "underline",
                                font: "inherit"
                            }}
                        >
                            {registrando ? "Inicia sesión aquí" : "Regístrate aquí"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}