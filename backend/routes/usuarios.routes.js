const express = require("express");
const router = express.Router();
const { obtenerUsuarios } = require("../controller/usuarios.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

// Ruta para obtener todos los usuarios (solo ADMIN)
router.get("/usuarios", authMiddleware, adminMiddleware, obtenerUsuarios);

module.exports = router;