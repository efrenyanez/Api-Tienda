const Usuario = require("../model/usuario.model");
const bcrypt = require("bcrypt");

/* =========================================================
   Registrar nuevo usuario (registro público)
   ========================================================= */
module.exports.register = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

        const hashed = await bcrypt.hash(contraseña, 10);

        const nuevo = new Usuario({
            correo,
            contraseña: hashed,
            rol: "pendiente" // Rol asignado por admin después
        });

        await nuevo.save();

        res.json({
            msg: "Usuario registrado correctamente. Espera a que el administrador te asigne un rol.",
            usuario: { correo: nuevo.correo }
        });

    } catch (error) {
        res.status(500).json({ msg: "Error al registrar", error: error.message });
    }
};



/* =========================================================
   Obtener todos los usuarios (solo ADMIN)
   ========================================================= */
module.exports.obtenerTodos = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-contraseña");
        res.json({ usuarios });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener usuarios", error: error.message });
    }
};



/* =========================================================
   Obtener usuario por ID (solo ADMIN)
   ========================================================= */
module.exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id).select("-contraseña");

        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ usuario });

    } catch (error) {
        res.status(500).json({ msg: "Error al obtener usuario", error: error.message });
    }
};



/* =========================================================
   Actualizar usuario (solo ADMIN)
   Puede cambiar: correo, contraseña, rol
   ========================================================= */
module.exports.actualizarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Si admin quiere cambiar contraseña
        if (data.contraseña) {
            data.contraseña = await bcrypt.hash(data.contraseña, 10);
        }

        const actualizado = await Usuario.findByIdAndUpdate(id, data, { new: true })
            .select("-contraseña");

        if (!actualizado) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ msg: "Usuario actualizado correctamente", usuario: actualizado });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar usuario", error: error.message });
    }
};



/* =========================================================
   Eliminar usuario (solo ADMIN)
   ========================================================= */
module.exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminado = await Usuario.findByIdAndDelete(id);

        if (!eliminado) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ msg: "Usuario eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar usuario", error: error.message });
    }
};
