// ./db/database.js

// 1. Corregir el typo aquí
const mongoose = require('mongoose');

// Cambié el nombre de la función para que coincida (opcional, pero más limpio)
const connect = async () => {
  console.log('Intentando conectar');
  try {
    // 2. Corregir el typo aquí
    await mongoose.connect("mongodb://127.0.0.1:27017/TiendaRopa");
    console.log("::: Exito al conectar la BD :::");
  } catch (error) {
    console.log('Error', error);
    // Typo aquí también: "new error" debe ser "new Error"
    throw new Error(' :: Error al establecer la conexion con la BD ::');
  }
};

// 3. ¡LA PARTE MÁS IMPORTANTE!
// Exporta un objeto con la función 'connect'
module.exports = {
  connect: connect
};