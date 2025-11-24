const { Schema, model } = require('mongoose');

const CajeroSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: "Producto"
    }]
}, {
    timestamps: true
});

module.exports = model(
    "Cajero",
    CajeroSchema,
    "cajero"
);
