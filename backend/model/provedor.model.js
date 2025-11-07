const { Schema, model } = require('mongoose');

const ProveedorSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = model('Proveedor', ProveedorSchema, 'proveedores');
