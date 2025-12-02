const { verifyToken } = require('../utils/jwt.utils');

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y extrae la información del usuario
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ 
                msg: 'Acceso denegado. No se proporcionó token de autenticación.' 
            });
        }

        // Verificar formato: "Bearer <token>"
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                msg: 'Formato de token inválido. Use: Bearer <token>' 
            });
        }

        const token = authHeader.substring(7); // Remover "Bearer "
        
        if (!token) {
            return res.status(401).json({ 
                msg: 'Acceso denegado. Token vacío.' 
            });
        }

        // Verificar y decodificar el token
        const decoded = verifyToken(token);
        
        // Agregar información del usuario a la request
        req.user = {
            id: decoded.id,
            correo: decoded.correo,
            rol: decoded.rol,
            iat: decoded.iat,
            exp: decoded.exp
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                msg: 'Token inválido.' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                msg: 'Token expirado. Por favor, inicia sesión nuevamente.' 
            });
        }

        console.error('Error en authMiddleware:', error);
        return res.status(500).json({ 
            msg: 'Error interno del servidor en autenticación.' 
        });
    }
};

/**
 * Middleware para verificar roles específicos
 * @param {string|Array<string>} allowedRoles - Rol o roles permitidos
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                msg: 'Acceso denegado. Usuario no autenticado.' 
            });
        }

        const userRole = req.user.rol;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(userRole)) {
            return res.status(403).json({ 
                msg: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}` 
            });
        }

        next();
    };
};

/**
 * Middleware específico para administradores
 */
const adminMiddleware = roleMiddleware('admin');

/**
 * Middleware específico para gerentes
 */
const gerenteMiddleware = roleMiddleware('gerente');

/**
 * Middleware específico para cajeros
 */
const cajeroMiddleware = roleMiddleware('cajero');

/**
 * Middleware para admin o gerente (acceso completo)
 */
const adminOrGerenteMiddleware = roleMiddleware(['admin', 'gerente']);

/**
 * Middleware para cualquier rol autenticado (solo lectura para cajero)
 */
const readOnlyMiddleware = roleMiddleware(['admin', 'gerente', 'cajero']);

module.exports = {
    authMiddleware,
    roleMiddleware,
    adminMiddleware,
    gerenteMiddleware,
    cajeroMiddleware,
    adminOrGerenteMiddleware,
    readOnlyMiddleware
};