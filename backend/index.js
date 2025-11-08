const express = require("express");
const cors = require("cors");
const db = require("./database/database.js");
const ProductoRutas = require("./routes/productos.routes.js");
const ProveedorRutas = require("./routes/provedor.routes.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Scalar Docs
const { apiReference } = require("@scalar/express-api-reference");

const app = express();
const PORT = 3000;

// 🧩 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Carpeta para subir imágenes
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ⚙️ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📤 Ruta para subir imágenes
app.post("/api/v1/upload", upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// 🔹 Servir archivos estáticos desde /uploads
app.use("/uploads", express.static(uploadDir));

// 🔹 Rutas principales
app.use("/api/v1/productos", ProductoRutas);
app.use("/api/v1/proveedores", ProveedorRutas);

// 📚 Documentación interactiva (Scalar)
app.use(
  "/doc",
  apiReference({
    spec: { url: "/swagger.json" },
    theme: "mars",
    darkMode: true,
    layout: "modern",
    showSidebar: true,
    searchHotKey: "k",
    customCss: `
      .scalar-api-client {
        border-radius: 16px;
      }
    `,
    hideModels: false,
    hideDownloadButton: false,
    hideDarkModeToggle: false,
  })
);

// 📄 Servir swagger.json para Scalar
app.get("/swagger.json", (req, res) => {
  res.sendFile(__dirname + "/swagger.json");
});

// 🚀 Iniciar servidor
const start = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`📚 Documentación API (Scalar): http://localhost:${PORT}/doc`);
    });
  } catch (err) {
    console.error("❌ No se pudo iniciar la aplicación:", err.message);
    process.exit(1);
  }
};

start();
