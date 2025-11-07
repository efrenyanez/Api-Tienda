const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
// Evitar escanear `index.js` para que no se incluya la propia ruta
// que sirve la documentación. Especificamos explícitamente los
// archivos de rutas para asegurar que swagger-autogen los procese.
const endpointsFiles = [
  "./routes/productos.routes.js",
  "./routes/provedor.routes.js",
];

const doc = {
  info: {
    title: "API de Eventos",
    description: "Esta es una api de eventos"
  },
  host: "localhost:3000",
  basePath: "/api/v1",
  schemes: ["http"]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
