const express = require("express");
const cors = require("cors");
const db = require("./database/database.js");
const Productorutas = require('./routes/productos.routes.js');
const ProveedorRutas = require('./routes/provedor.routes.js');


//scalar
const { apiReference } = require('@scalar/express-api-reference');


db.connect();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/productos', Productorutas);
app.use('/api/v1/proveedor', ProveedorRutas);

app.use(
  '/doc',
  apiReference({
    // Cargar la especificación directamente desde el archivo JSON para
    // evitar exponer la ruta GET /swagger.json en la UI.
      // Cargar la especificación mediante URL — serviremos /swagger.json
      // desde este mismo servidor. Como `swagger.js` ya no escanea
      // `index.js`, la ruta no se agregará al spec generado.
      spec: {
        url: '/swagger.json'
      },
    // 🎨 TEMAS DISPONIBLES:
    // 'default', 'alternate', 'moon', 'purple', 'solarized', 'bluePlanet', 
    // 'saturn', 'kepler', 'mars', 'deepSpace'
    theme: 'mars',
    
    // 🌓 Modo oscuro: true, false, o 'auto'
    darkMode: true,
    
    // 📐 Layout: 'modern' o 'classic'
    layout: 'modern',
    
    // 🔍 Mostrar barra lateral
    showSidebar: true,
    
    // ⌨️ Atajo de búsqueda (Ctrl/Cmd + K por defecto)
    searchHotKey: 'k',
    
    // 🎨 CSS personalizado (opcional)
    customCss: `
      .scalar-api-client {
        border-radius: 16px;
      }
    `,
    
    // 📱 Configuración adicional
    hideModels: false, // Ocultar modelos de datos
    hideDownloadButton: false, // Ocultar botón de descarga
    hideDarkModeToggle: false, // Ocultar toggle de modo oscuro
  })
);

// Servir swagger.json para que la UI pueda obtenerlo desde /swagger.json
app.get('/swagger.json', (req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

const start = async () => {
  try {
    await db.connect(); // Conecta ambas bases (defaultConn y teamsConn)
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en: http://localhost:${PORT}`);
      console.log("📚 Documentación API (Scalar): http://localhost:" + PORT + "/doc");
    });
  } catch (err) {
    console.error("No se pudo iniciar la aplicación:", err.message);
    process.exit(1);
  }
};

start();