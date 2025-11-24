const { Schema, model } = require('mongoose');

const GerenteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: "gerente"
    }
}, {
    timestamps: true
});

module.exports = model(
    "Gerente",
    GerenteSchema,
    "gerente"
);
