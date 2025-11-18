const Producto = require('../model/producto.model');
const Proveedor = require('../model/provedor.model');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const guardarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, fechaCaducidad, fechaCompra, provedor, precioCompra } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !fechaCaducidad || !fechaCompra || !provedor || !precioCompra) {
      return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios." });
    }

    const proveedorExiste = await Proveedor.findById(provedor);
    if (!proveedorExiste)
      return res.status(404).json({ status: "error", message: "Proveedor no existe." });

    if (new Date(fechaCaducidad) <= new Date(fechaCompra)) {
      return res.status(400).json({ status: "error", message: "Fecha caducidad debe ser posterior a compra." });
    }

    const productoExistente = await Producto.findOne({ nombre: nombre.trim() });
    if (productoExistente)
      return res.status(409).json({ status: "error", message: `Producto "${nombre}" ya existe.` });

    let imageUrl = "";
    if (req.file) {
      imageUrl = `http://localhost:3000/uploads/products/${req.file.filename}`;
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      fechaCaducidad,
      fechaCompra,
      provedor,
      precioCompra,
      imagen: imageUrl
    });

    const productoGuardado = await nuevoProducto.save();

    return res.status(201).json({
      status: "success",
      message: "Producto guardado correctamente",
      data: productoGuardado
    });

  } catch (error) {
    console.error("Error al guardar el producto:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor al guardar el producto",
      error: error.message
    });
  }
};

const obtenerTodos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('provedor');
    return res.status(200).json({
      status: "success",
      data: productos
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor al obtener los productos",
      error: error.message
    });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('provedor');

    if (!producto) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      status: "success",
      data: producto
    });
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor al obtener el producto",
      error: error.message
    });
  }
};

const actualizarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido."
      });
    }
    
    const camposActualizados = req.body;

    if (req.file) {
      camposActualizados.imagen = `http://localhost:3000/uploads/products/${req.file.filename}`;
    }
    else if (req.body.imagen) {
      camposActualizados.imagen = req.body.imagen;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, camposActualizados, {
      new: true,
      runValidators: true
    });

    if (!productoActualizado) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado para actualizar"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Producto actualizado correctamente",
      data: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor al actualizar el producto",
      error: error.message
    });
  }
};

const eliminarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado para eliminar"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Producto eliminado correctamente",
      data: productoEliminado
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor al eliminar el producto",
      error: error.message
    });
  }
};

module.exports = {
  guardarProducto,
  obtenerTodos,
  obtenerPorId,
  actualizarPorId,
  eliminarPorId
};
