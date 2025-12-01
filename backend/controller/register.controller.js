const Usuario = require("../model/usuario.model");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

        const hashed = await bcrypt.hash(contraseña, 10);

        const nuevo = new Usuario({
            correo,
            contraseña: hashed,
            rol: "pendiente" // Rol temporal hasta que el admin lo asigne
        });

        await nuevo.save();

        res.json({ 
            msg: "Usuario registrado correctamente. Espera a que el administrador te asigne un rol para acceder al sistema.",
            usuario: { correo: nuevo.correo }
        });

    } catch (error) {
        res.status(500).json({ msg: "Error al registrar", error: error.message });
    }
};