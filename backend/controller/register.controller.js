const Usuario = require("../model/usuario.model");
const bcrypt = require("bcryptjs");

module.exports.register = async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol } = req.body;

        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

        const hashed = await bcrypt.hash(contraseña, 10);

        const nuevo = new Usuario({
            nombre,
            correo,
            contraseña: hashed,
            rol
        });

        await nuevo.save();

        res.json({ msg: "Usuario registrado", usuario: nuevo });

    } catch (error) {
        res.status(500).json({ msg: "Error al registrar", error: error.message });
    }
};
