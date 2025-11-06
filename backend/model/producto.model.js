const {Schema, model } = require('mongoose');


const ProductoSchema = new Schema ({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true
    },
    fechaCaducidad: {
        type: Date,
        required: true,
    },
    fechaCompra: {
        type: Date,
        required: true
    },
    provedor:{
        type: String,
        required: true
    },
    precioCompra:{
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        trim: true
    }
})

module.exports = model(
    "Producto",
    ProductoSchema,
    "producto"
)