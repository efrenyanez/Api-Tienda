const { verifyToken, decodeToken } = require("../utils/jwt.utils");

/**
 * Verifica si un token JWT es válido
 */
module.exports.verifyJWT = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ 
                msg: "Token requerido",
                valid: false 
            });
        }

        const decoded = verifyToken(token);
        
        res.json({
            msg: "Token válido",
            valid: true,
            payload: {
                id: decoded.id,
                correo: decoded.correo,
                rol: decoded.rol,
                exp: decoded.exp,
                iat: decoded.iat
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                msg: "Token inválido",
                valid: false 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                msg: "Token expirado",
                valid: false 
            });
        }

        res.status(500).json({ 
            msg: "Error verificando token", 
            valid: false,
            error: error.message 
        });
    }
};

/**
 * Obtiene información del usuario actual basado en el token JWT
 */
module.exports.getUserInfo = async (req, res) => {
    try {
        // El middleware de auth ya verificó el token y agregó req.user
        res.json({
            msg: "Información del usuario",
            usuario: {
                id: req.user.id,
                correo: req.user.correo,
                rol: req.user.rol,
                tokenExp: req.user.exp,
                tokenIat: req.user.iat
            }
        });

    } catch (error) {
        res.status(500).json({ 
            msg: "Error obteniendo información del usuario", 
            error: error.message 
        });
    }
};

/**
 * Logout (invalidar token del lado del cliente)
 * Nota: JWT es stateless, por lo que la invalidación real debe hacerse del lado del cliente
 */
module.exports.logout = async (req, res) => {
    try {
        res.json({
            msg: "Logout exitoso. Token invalidado del lado del cliente.",
            instructions: "Elimina el token del localStorage/sessionStorage del cliente"
        });

    } catch (error) {
        res.status(500).json({ 
            msg: "Error en logout", 
            error: error.message 
        });
    }
};