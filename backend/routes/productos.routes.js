const express = require('express');
const router = express.Router();
const ProductoController = require('../controller/producto.controller');

router.post('/guardarProducto', ProductoController.guardarProducto);

router.get('/todosProductos', ProductoController.obtenerTodos);

router.get('/porId/:id', ProductoController.obtenerPorId);

router.patch('/actualizar/:id', ProductoController.actualizarPorId);

router.delete('/eliminar/:id', ProductoController.eliminarPorId);

module.exports = router;