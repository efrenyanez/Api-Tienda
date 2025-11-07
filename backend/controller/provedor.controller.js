const Proveedor = require('../model/provedor.model');

const guardarProveedor = async (req, res) => {
    try {
    const { nombre, direccion, telefono, correo } = req.body;
    if (!nombre || !direccion || !telefono || !correo) {
    return res.status(400).json({
        status: "error",
        message: "Todos los campos (nombre, dirección, teléfono, correo) son obligatorios."
    });
    }

    const proveedorExistente = await Proveedor.findOne({
    $or: [{ nombre: nombre.trim() }, { correo: correo.trim() }]
    });

    if (proveedorExistente) {
    return res.status(409).json({
        status: "error",
        message: `Ya existe un proveedor con el nombre o correo ingresado.`
    });
    }

    const nuevoProveedor = new Proveedor({
        nombre,
        direccion,
        telefono,
        correo
    });

    const proveedorGuardado = await nuevoProveedor.save();

    return res.status(201).json({
        status: "success",
        message: "Proveedor guardado correctamente.",
        data: proveedorGuardado
    });
} catch (error) {
    console.error("Error al guardar el proveedor:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al guardar el proveedor.",
        error: error.message
    });
    }
};

const obtenerProveedores = async (req, res) => {
    try {
    const proveedores = await Proveedor.find();
    return res.status(200).json({
        status: "success",
        data: proveedores
    });
    } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al obtener los proveedores.",
        error: error.message
    });
    }
};

const obtenerProveedorPorId = async (req, res) => {
try {
    const { id } = req.params;
    const proveedor = await Proveedor.findById(id);

    if (!proveedor) {
        return res.status(404).json({
        status: "error",
        message: "Proveedor no encontrado."
    });
    }

    return res.status(200).json({
        status: "success",
        data: proveedor
    });
} catch (error) {
    console.error("Error al obtener el proveedor:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al obtener el proveedor.",
        error: error.message
    });
    }
};

// Actualizar proveedor por ID
const actualizarProveedor = async (req, res) => {
try {
    const { id } = req.params;
    const camposActualizados = req.body;

    const proveedorActualizado = await Proveedor.findByIdAndUpdate(
        id,
        camposActualizados,
        { new: true, runValidators: true }
    );

    if (!proveedorActualizado) {
        return res.status(404).json({
        status: "error",
        message: "Proveedor no encontrado para actualizar."
    });
    }

    return res.status(200).json({
        status: "success",
        message: "Proveedor actualizado correctamente.",
        data: proveedorActualizado
    });
} catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al actualizar el proveedor.",
        error: error.message
    });
}
};

const eliminarProveedor = async (req, res) => {
try {
    const { id } = req.params;

    const proveedorEliminado = await Proveedor.findByIdAndDelete(id);

    if (!proveedorEliminado) {
        return res.status(404).json({
        status: "error",
        message: "Proveedor no encontrado para eliminar."
    });
    }

    return res.status(200).json({
        status: "success",
        message: "Proveedor eliminado correctamente.",
        data: proveedorEliminado
    });
} catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al eliminar el proveedor.",
        error: error.message
    });
}
};

module.exports = {
    guardarProveedor,
    obtenerProveedores,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor
};
