const Usuario = require("../model/usuario.model");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) return res.status(404).json({ msg: "Correo no registrado" });

        const valid = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!valid) return res.status(400).json({ msg: "Contraseña incorrecta" });

        res.json({
            msg: "Login exitoso",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({ msg: "Error en login", error: error.message });
    }
};
