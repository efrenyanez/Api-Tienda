import React, { useState } from 'react';
import './css/login.css'
import { loginRequest, isUserAdmin } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setIsAuthenticated, setUserRole }) {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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

        try {
            const data = await loginRequest(email, password);
            console.log("Login correcto:", data);

            // Guardar el rol del usuario globalmente
            const userRole = data.usuario?.rol;
            console.log("Rol del usuario:", userRole);

            // Guardar en localStorage
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("isAuthenticated", "true");

            setIsAuthenticated(true);
            
            // Guardar el rol del usuario si se proporciona la función
            if (setUserRole) {
                setUserRole(userRole);
            }

            // Siempre redirigir a /principal, pero con diferente rol
            navigate("/principal");

        } catch (err) {
            setError(err.message);
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

                <button className="btn" onClick={handleSubmit}>Iniciar sesión</button>

                <a className="link" href="/register">Crear cuenta</a>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
}
