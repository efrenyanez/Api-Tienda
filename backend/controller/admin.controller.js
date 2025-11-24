//les comento las funciones para que se den cuenta donde estan cada una

const Admin = require('../model/admin.model');
const mongoose = require('mongoose');

//Funcion 1 crear Admin
const crearAdmin = async(req, res) =>{
    try {
        const {nombre, email, password} =req.body;
        if(!nombre || !email || !password){
            return res.status(400).json({
                status: "error",
                message: "Todos los campos son obligatorios"
            });
        }
        const adminExistente = await Admin.findOne({email});
        if (adminExistente){
            return res.status(409).json({
                status: "error",
                message: "email ya registrado"
            });
        }
        const nuevoAdmin = new Admin({
            nombre,
            email,
            password
        });
        const adminGuardado = await nuevoAdmin.save();
        return res.status(201).json({
            status: "success",
            message: "Administrador creado correcto",
            data: adminGuardado
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "error al crear el administrador",
            error: error.message
        });
    }
};

// 2 Función Obtener Todos
const obtenerTodos = async (req, res) =>{
    try {
        const admins = await Admin.find();
        return res.status(200).json({
            status: "success",
            data: admins
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener Todos",
            error: error.message
        });
    }
}

// 3 Obtener por ID
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "ID inválido."
            });
        }
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                status: "error",
                message: "Administrador no encontrado."
            });
        }
        return res.status(200).json({
            status: "success",
            data: admin
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener administrador",
            error: error.message
        });
    }
};

// 4 Actualizar por ID
const actualizarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const camposActualizados = req.body;

        const adminActualizado = await Admin.findByIdAndUpdate(id, camposActualizados, {
            new: true,
            runValidators: true
        });

        if (!adminActualizado) {
            return res.status(404).json({
                status: "error",
                message: "Administrador no encontrado."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Administrador actualizado correctamente",
            data: adminActualizado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar administrador",
            error: error.message
        });
    }
};

// 5 Eliminar por ID
const eliminarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const adminEliminado = await Admin.findByIdAndDelete(id);

        if (!adminEliminado) {
            return res.status(404).json({
                status: "error",
                message: "Administrador no encontrado."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Administrador eliminado correctamente",
            data: adminEliminado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar administrador",
            error: error.message
        });
    }
};

module.exports = {
    crearAdmin,
    obtenerTodos,
    obtenerPorId,
    actualizarPorId,
    eliminarPorId
};