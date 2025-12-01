import './css/register.css';
import React, { useState } from 'react';
import { registerRequest, isUserAdmin } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage({ setIsAuthenticated, setIsAdmin }) {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Validaciones
        if (!email || !password || !confirmPassword) {
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

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const data = await registerRequest(email, password);
            console.log("Registro correcto:", data);

            // Mostrar mensaje de éxito del backend
            alert(data.msg || "Usuario registrado correctamente. Espera a que el administrador te asigne un rol.");
            
            // Redirigir al login para que inicie sesión cuando tenga rol asignado
            navigate("/");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <h1>Regístrate</h1>

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

                <input
                    className="input"
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button 
                    className="btn" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Crear cuenta'}
                </button>

                <a className="link" href="/">¿Ya tienes cuenta? Inicia sesión</a>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
}