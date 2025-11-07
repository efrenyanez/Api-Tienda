const express = require('express');
const router = express.Router();
const ProvedorController = require('../controller/provedor.controller')

router.post ('/guardarProveedor', ProvedorController.guardarProveedor);
router.get('/obtenertodos', ProvedorController.obtenerProveedores);
router.get('/por/:id', ProvedorController.obtenerProveedorPorId);
router.patch('/actualizar/:id', ProvedorController.actualizarProveedor);
router.delete('/eliminar/:id', ProvedorController.eliminarProveedor);

module.exports = router;