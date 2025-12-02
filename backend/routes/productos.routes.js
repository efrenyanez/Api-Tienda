const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProductoController = require('../controller/producto.controller');
const { authMiddleware, adminOrGerenteMiddleware, readOnlyMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 🔹 Rutas
// Rutas públicas (solo lectura)
router.get('/todosProductos', ProductoController.obtenerTodos);
router.get('/porId/:id', ProductoController.obtenerPorId);

// Rutas para usuarios autenticados con solo lectura (incluye cajero)
router.get('/auth/todosProductos', authMiddleware, readOnlyMiddleware, ProductoController.obtenerTodos);
router.get('/auth/porId/:id', authMiddleware, readOnlyMiddleware, ProductoController.obtenerPorId);

// Rutas protegidas - Solo admin y gerente (acceso completo)
router.post('/guardarProducto', authMiddleware, adminOrGerenteMiddleware, upload.single('imagen'), ProductoController.guardarProducto);
router.patch('/actualizar/:id', authMiddleware, adminOrGerenteMiddleware, upload.single('imagen'), ProductoController.actualizarPorId);
router.delete('/eliminar/:id', authMiddleware, adminOrGerenteMiddleware, ProductoController.eliminarPorId);

module.exports = router;
