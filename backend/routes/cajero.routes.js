const express = require('express');
const CajeroController = require('../controller/cajero.controller');

const router = express.Router();

router.get('/todos', CajeroController.obtenerTodos);
router.get('/porId/:id', CajeroController.obtenerPorId);

module.exports = router;
z