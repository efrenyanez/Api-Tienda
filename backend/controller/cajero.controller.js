const Cajero = require('../model/cajero.model');
const mongoose = require('mongoose');

// Obtener todos los cajeros
const obtenerTodos = async (req, res) => {
    try {
        const cajeros = await Cajero.find().populate("productos");

        return res.status(200).json({
            status: "success",
            data: cajeros
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los cajeros",
            error: error.message
        });
    }
};

// Obtener cajero por ID
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "ID inválido."
            });
        }

        const cajero = await Cajero.findById(id).populate("productos");

        if (!cajero) {
            return res.status(404).json({
                status: "error",
                message: "Cajero no encontrado."
            });
        }

        return res.status(200).json({
            status: "success",
            data: cajero
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener cajero",
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId
};
