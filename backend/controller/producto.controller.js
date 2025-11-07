const Producto = require('../model/producto.model');
const Proveedor = require('../model/provedor.model');

const guardarProducto = async(req, res) =>{
    try {
        const {nombre, precio, stock, fechaCaducidad, fechaCompra, provedor, precioCompra, imagen} = req.body;
        if (!nombre || !precio || !stock || !fechaCaducidad || !fechaCompra || !provedor || !precioCompra) {
            return res.status(400).json({
        status: "error",
        message: "Todos los campos (nombre, precio, stock, fechaCaducidad, fechaCompra, provedor, precioCompra) son obligatorios."
        });
    }
    const proveedorExiste = await Proveedor.findById(proveedor);
    if (!proveedorExiste) {
        return res.status(404).json({
        status: "error",
        message: "El proveedor indicado no existe."
    });
    }
    //fecha de caducidad sea posterior a la de compra
    if (new Date(fechaCaducidad) <= new Date(fechaCompra)) {
        return res.status(400).json({
        status: "error",
        message: "La fecha de caducidad debe ser posterior a la fecha de compra."
    });
    }
    //Nombres no repetidos
    const productoExistente = await Producto.findOne({ nombre: nombre.trim() });
    if (productoExistente) {
        return res.status(409).json({
        status: "error",
        message: `Ya existe un producto con el nombre "${nombre}".`
        });
    }

    const nuevoProducto = new Producto({
        nombre,
        precio,
        stock,
        fechaCaducidad,
        fechaCompra,
        provedor,
        precioCompra,
        imagen
    });

    const productoGuardado = await nuevoProducto.save();

    return res.status(201).json({
        status: "success",
        message: "Producto guardado correctamente",
        data: productoGuardado
    });
    } catch (error) {
        console.error("Error al guardar el producto:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al guardar el producto",
        error: error.message
        });
    }
};

const obtenerTodos = async (req, res) => {
    try {
    const productos = await Producto.find();
    return res.status(200).json({
        status: "success",
        data: productos
    });
    } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al obtener los productos",
        error: error.message
    });
    }
};

const obtenerPorId = async (req, res) => {
    try {
    const { id } = req.params;
    const producto = await Producto.findById(id);

    if (!producto) {
        return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
    });
    }

    return res.status(200).json({
        status: "success",
        data: producto
    });
    } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al obtener el producto",
        error: error.message
    });
    }
};

const actualizarPorId = async (req, res) => {
    try {
    const { id } = req.params;
    const camposActualizados = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(id, camposActualizados, {
        new: true,
        runValidators: true
    });

    if (!productoActualizado) {
        return res.status(404).json({
        status: "error",
        message: "Producto no encontrado para actualizar"
    });
    }

    return res.status(200).json({
        status: "success",
        message: "Producto actualizado correctamente",
        data: productoActualizado
    });
    } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al actualizar el producto",
        error: error.message
    });
    }
};

const eliminarPorId = async (req, res) => {
    try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
        return res.status(404).json({
        status: "error",
        message: "Producto no encontrado para eliminar"
    });
    }

    return res.status(200).json({
        status: "success",
        message: "Producto eliminado correctamente",
        data: productoEliminado
    });
    } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({
        status: "error",
        message: "Error en el servidor al eliminar el producto",
        error: error.message
    });
    }
};

module.exports = {
    guardarProducto,
    obtenerTodos,
    obtenerPorId,
    actualizarPorId,
    eliminarPorId
}