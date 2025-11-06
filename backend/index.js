const express = require("express");
const cors = require("cors");
const conection = require("./database");
const Productorutas = require('./routes/productos.routes.js');

conection();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/productos', Productorutas);

app.listen(PORT, () => {
    console.log(`Servidor Corriendo http://localhost:${PORT}`);
});