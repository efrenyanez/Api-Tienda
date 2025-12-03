const Usuario = require("../model/usuario.model");

/* =========================================================
   Obtener todos los usuarios (solo ADMIN)
   ========================================================= */
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-contraseña");
        res.json({ usuarios });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener usuarios", error: error.message });
    }
};

/* =========================================================
   Exportar controladores correctamente
   ========================================================= */
module.exports = {
    obtenerUsuarios,
};