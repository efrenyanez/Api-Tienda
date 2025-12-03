const Usuario = require("../model/usuario.model");
const bcrypt = require("bcrypt");

/* =========================================================
   Registrar nuevo usuario (registro público)
   ========================================================= */
const register = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !correo || !contraseña) {
            return res.status(400).json({ msg: "Nombre, correo y contraseña son requeridos" });
        }

        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

        const hashed = await bcrypt.hash(contraseña, 10);

        const nuevo = new Usuario({
            nombre,
            correo,
            contraseña: hashed,
            rol: "pendiente" 
        });

        await nuevo.save();

        res.json({
            msg: "Usuario registrado correctamente. Espera a que el administrador te asigne un rol.",
            usuario: { nombre: nuevo.nombre, correo: nuevo.correo }
        });

    } catch (error) {
        res.status(500).json({ msg: "Error al registrar", error: error.message });
    }
};



/* =========================================================
   Obtener todos los usuarios (solo ADMIN)
   ========================================================= */
const obtenerTodos = async (req, res) => {
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
const obtenerPorId = async (req, res) => {
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
   ========================================================= */
const actualizarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

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
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminado = await Usuario.findByIdAndDelete(id);

        if (!eliminado) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ msg: "Usuario eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar usuario", error: error.message });
    }
};



/* =========================================================
   Exportar controladores correctamente
   ========================================================= */
module.exports = {
    register,
    obtenerTodos,
    obtenerPorId,
    actualizarPorId,
    eliminarUsuario
};
