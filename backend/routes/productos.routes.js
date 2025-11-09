const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProductoController = require('../controller/producto.controller');

const router = express.Router();

// 📁 Crear carpeta "uploads" si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Guarda en /uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
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
