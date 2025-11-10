const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
const endpointsFiles = ["./index.js"];

const doc = {
  info: {
    title: "API de Eventos",
    description: "Esta es una api de eventos"
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
