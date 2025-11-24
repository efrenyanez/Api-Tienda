const express = require('express');
const GerenteController = require('../controller/gerente.controller');

const router = express.Router();

router.post('/crear', GerenteController.crearGerente);
router.get('/todos', GerenteController.obtenerTodos);
router.get('/porId/:id', GerenteController.obtenerPorId);
router.patch('/actualizar/:id', GerenteController.actualizarPorId);
router.delete('/eliminar/:id', GerenteController.eliminarPorId);

module.exports = router;
