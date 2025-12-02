const express = require("express");
const router = express.Router();

const Register = require("../controller/register.controller");

// RUTA PARA REGISTRAR USUARIO
router.post("/", Register.register);

// RUTA PARA OBTENER TODOS LOS USUARIOS (solo admin)
router.get("/todos", Register.obtenerUsuarios);

// RUTA PARA OBTENER UN USUARIO POR ID
router.get("/porId/:id", Register.obtenerPorId);

// RUTA PARA ACTUALIZAR USUARIO POR ID (editar correo, contraseña o rol)
router.patch("/actualizar/:id", Register.actualizarUsuario);

// RUTA PARA ELIMINAR USUARIO POR ID
router.delete("/eliminar/:id", Register.eliminarUsuario);

// RUTA PARA ASIGNAR ROL (admin asigna rol)
router.patch("/rol/:id", Register.asignarRol);

module.exports = router;
