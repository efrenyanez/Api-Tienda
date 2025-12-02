const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Archivo donde se guardará el secret JWT
const JWT_SECRET_FILE = path.join(__dirname, '../.jwt-secret');

/**
 * Genera un secret aleatorio para JWT
 * @returns {string} Secret aleatorio de 64 caracteres
 */
const generateRandomSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

/**
 * Obtiene o genera el JWT secret
 * @returns {string} JWT secret
 */
const getJWTSecret = () => {
    try {
        // Intentar leer el secret existente
        if (fs.existsSync(JWT_SECRET_FILE)) {
            return fs.readFileSync(JWT_SECRET_FILE, 'utf8');
        }
    } catch (error) {
        console.log('No se pudo leer el secret existente, generando uno nuevo...');
    }
    
    // Generar nuevo secret si no existe
    const newSecret = generateRandomSecret();
    
    try {
        fs.writeFileSync(JWT_SECRET_FILE, newSecret);
        console.log('✅ Nuevo JWT secret generado y guardado');
    } catch (error) {
        console.error('❌ Error al guardar el JWT secret:', error.message);
    }
    
    return newSecret;
};

/**
 * Regenera el JWT secret (solo para uso administrativo)
 */
const regenerateJWTSecret = () => {
    const newSecret = generateRandomSecret();
    try {
        fs.writeFileSync(JWT_SECRET_FILE, newSecret);
        console.log('🔄 JWT secret regenerado exitosamente');
        return newSecret;
    } catch (error) {
        console.error('❌ Error al regenerar el JWT secret:', error.message);
        throw error;
    }
};

// Configuración JWT
const JWT_CONFIG = {
    secret: getJWTSecret(),
    expiresIn: process.env.JWT_EXPIRES_IN, // Solo el tiempo se puede configurar via variable de entorno
    algorithm: 'HS256'
};

/**
 * Genera un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn: JWT_CONFIG.expiresIn,
        algorithm: JWT_CONFIG.algorithm
    });
};

/**
 * Verifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_CONFIG.secret, {
        algorithms: [JWT_CONFIG.algorithm]
    });
};

/**
 * Decodifica un token sin verificar (para obtener info del payload)
 * @param {string} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    regenerateJWTSecret,
    JWT_CONFIG
};