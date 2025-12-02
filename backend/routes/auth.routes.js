const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/v1/auth/verify:
 *   post:
 *     summary: Verifica si un token JWT es válido
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT a verificar
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o expirado
 */
router.post("/verify", authController.verifyJWT);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Obtiene información del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: Token no válido o no proporcionado
 */
router.get("/me", authMiddleware, authController.getUserInfo);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout del usuario (invalida token del lado cliente)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;