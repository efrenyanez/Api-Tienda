const express = require('express');
const router = express.Router();
const ProvedorController = require('../controller/provedor.controller');
const { authMiddleware, adminOrGerenteMiddleware, readOnlyMiddleware } = require('../middleware/auth.middleware');

// Rutas públicas (solo lectura)
router.get('/obtenertodos', ProvedorController.obtenerProveedores);
router.get('/por/:id', ProvedorController.obtenerProveedorPorId);

// Rutas para usuarios autenticados con solo lectura (incluye cajero)
router.get('/auth/obtenertodos', authMiddleware, readOnlyMiddleware, ProvedorController.obtenerProveedores);
router.get('/auth/por/:id', authMiddleware, readOnlyMiddleware, ProvedorController.obtenerProveedorPorId);

// Rutas protegidas - Solo admin y gerente (acceso completo)
router.post('/guardarProveedor', authMiddleware, adminOrGerenteMiddleware, ProvedorController.guardarProveedor);
router.patch('/actualizar/:id', authMiddleware, adminOrGerenteMiddleware, ProvedorController.actualizarProveedor);
router.delete('/eliminar/:id', authMiddleware, adminOrGerenteMiddleware, ProvedorController.eliminarProveedor);

module.exports = router;