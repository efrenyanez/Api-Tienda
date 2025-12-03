const express = require("express");
const router = express.Router();

const Register = require("../controller/register.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

// RUTA PARA REGISTRAR USUARIO (público)
router.post("/", Register.register);

// RUTA PARA OBTENER TODOS LOS USUARIOS (solo admin)
router.get("/todos", authMiddleware, adminMiddleware, Register.obtenerTodos);

// RUTA PARA OBTENER UN USUARIO POR ID (solo admin)
router.get("/porId/:id", authMiddleware, adminMiddleware, Register.obtenerPorId);

// RUTA PARA ACTUALIZAR USUARIO POR ID (solo admin - editar correo, contraseña o rol)
router.patch("/actualizar/:id", authMiddleware, adminMiddleware, Register.actualizarPorId);

// RUTA PARA ELIMINAR USUARIO POR ID (solo admin)
router.delete("/eliminar/:id", authMiddleware, adminMiddleware, Register.eliminarUsuario);

module.exports = router;
