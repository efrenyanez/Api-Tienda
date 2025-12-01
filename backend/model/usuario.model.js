const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", UsuarioSchema);
