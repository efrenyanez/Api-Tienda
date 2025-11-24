const Gerente = require('../model/gerente.model');
const mongoose = require('mongoose');

// Crear gerente
const crearGerente = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Todos los campos son obligatorios."
            });
        }

        const gerenteExistente = await Gerente.findOne({ email });
        if (gerenteExistente) {
            return res.status(409).json({
                status: "error",
                message: "El email ya está registrado."
            });
        }

        const nuevoGerente = new Gerente({
            nombre,
            email,
            password
        });

        const gerenteGuardado = await nuevoGerente.save();

        return res.status(201).json({
            status: "success",
            message: "Gerente creado correctamente",
            data: gerenteGuardado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al crear gerente",
            error: error.message
        });
    }
};

// Obtener todos
const obtenerTodos = async (req, res) => {
    try {
        const gerentes = await Gerente.find();
        return res.status(200).json({
            status: "success",
            data: gerentes
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener gerentes",
            error: error.message
        });
    }
};

// Obtener por ID
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "ID inválido."
            });
        }

        const gerente = await Gerente.findById(id);

        if (!gerente) {
            return res.status(404).json({
                status: "error",
                message: "Gerente no encontrado."
            });
        }

        return res.status(200).json({
            status: "success",
            data: gerente
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener gerente",
            error: error.message
        });
    }
};

// Actualizar por ID
const actualizarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const camposActualizados = req.body;

        const gerenteActualizado = await Gerente.findByIdAndUpdate(id, camposActualizados, {
            new: true,
            runValidators: true
        });

        if (!gerenteActualizado) {
            return res.status(404).json({
                status: "error",
                message: "Gerente no encontrado."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Gerente actualizado correctamente",
            data: gerenteActualizado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar gerente",
            error: error.message
        });
    }
};

// Eliminar por ID
const eliminarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const gerenteEliminado = await Gerente.findByIdAndDelete(id);

        if (!gerenteEliminado) {
            return res.status(404).json({
                status: "error",
                message: "Gerente no encontrado."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Gerente eliminado correctamente",
            data: gerenteEliminado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar gerente",
            error: error.message
        });
    }
};

module.exports = {
    crearGerente,
    obtenerTodos,
    obtenerPorId,
    actualizarPorId,
    eliminarPorId
};
