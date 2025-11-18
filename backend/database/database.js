const mongoose = require('mongoose');

const connect = async () => {
  console.log('Intentando conectar');
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TiendaRopa");
    console.log("::: Exito al conectar la BD :::");
  } catch (error) {
    console.log('Error', error);
    throw new Error(' :: Error al establecer la conexion con la BD ::');
  }
};

module.exports = {
  connect: connect
};