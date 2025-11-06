const mongose = require('mongoose');

const conection = async()=>{
    console.log('Intentando conectar');
    try {
        await mongose.connect("mongodb://127.0.0.1:27017/TiendaRopa");
        console.log("::: Exito al conectar la BD :::")
    } catch (error) {
        console.log('Error', error);
        throw new error(' :: Error al establecer la conexion con la BD ::')
    }
}

module.exports = conection