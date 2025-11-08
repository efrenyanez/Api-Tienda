const express = require('express');
const multer = require('multer');
const ProductoController = require('../controller/producto.controller');

const router = express.Router();

// 📦 Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// 🔹 Rutas
router.post('/guardarProducto', upload.single('imagen'), ProductoController.guardarProducto);
router.get('/todosProductos', ProductoController.obtenerTodos);
router.get('/porId/:id', ProductoController.obtenerPorId);
router.patch('/actualizar/:id', upload.single('imagen'), ProductoController.actualizarPorId);
router.delete('/eliminar/:id', ProductoController.eliminarPorId);

module.exports = router;
