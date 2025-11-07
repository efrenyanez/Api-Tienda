const express = require("express");
const cors = require("cors");
const conection = require("./database/database.js");
const Productorutas = require('./routes/productos.routes.js');
const Proveedorrutas = require('./routes/provedor.routes.js');
conection();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/productos', Productorutas);
app.use('/api/v1/provedor', Proveedorrutas)

app.listen(PORT, () => {
    console.log(`Servidor Corriendo http://localhost:${PORT}`);
});