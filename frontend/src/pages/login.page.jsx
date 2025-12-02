import React, { useState } from 'react';
import './css/login.css'
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setIsAuthenticated, setUserRole }) {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            setError("Llena todos los campos.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("El correo no es válido.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);
            
            if (result.success) {
                console.log("Login exitoso con JWT:", result.data);
                
                // Mantener compatibilidad con el sistema anterior
                if (setIsAuthenticated) {
                    setIsAuthenticated(true);
                }
                if (setUserRole && result.data.usuario?.rol) {
                    setUserRole(result.data.usuario.rol);
                }
                
                // Redirigir a /principal
                navigate("/principal");
            } else {
                setError(result.message);
            }

        } catch (err) {
            setError(err.message || "Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>

            <div className="form">

                <input
                    className="input"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

                <a className="link" href="/register">Crear cuenta</a>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
}
