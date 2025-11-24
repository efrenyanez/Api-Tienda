const express = require('express');
const AdminController = require('../controller/admin.controller');

const router = express.Router();

// Las rutas
// Crear 
router.post('/crearAdmin', AdminController.crearAdmin);
// ObtenerTodos
router.get('/todos', AdminController.obtenerTodos);
// ObtenerporID
router.get('/porId/:id', AdminController.obtenerPorId)
// ActualizarPorID
router.patch('/actualizaradmin/:id', AdminController.actualizarPorId)
// Eliminar
router.delete('/eliminaradmin/:id', AdminController.eliminarPorId)