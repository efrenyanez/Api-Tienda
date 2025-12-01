const express = require("express");
const cors = require("cors");
const db = require("./database/database.js");
const ProductoRutas = require("./routes/productos.routes.js");
const ProveedorRutas = require("./routes/provedor.routes.js");
const RegisterRutas = require("./routes/register.routes.js");
const LoginRutas= require("./routes/login.routes.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Scalar Docs
const { apiReference } = require("@scalar/express-api-reference");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "uploads");
const productsDir = path.join(__dirname, "uploads/products");
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, productsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.post("/api/v1/upload", upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

  const imageUrl = `http://localhost:${PORT}/uploads/products/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.use("/uploads", express.static(uploadDir));

app.use("/api/v1/productos", ProductoRutas);
app.use("/api/v1/proveedores", ProveedorRutas);
app.use("/api/v1/register", RegisterRutas);
app.use("/api/v1/login", LoginRutas);
// Documentación interactiva (Scalar)
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

app.get("/swagger.json", (req, res) => {
  res.sendFile(__dirname + "/swagger.json");
});

// Iniciar servidor
const start = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`Documentación API (Scalar): http://localhost:${PORT}/doc`);
    });
  } catch (err) {
    console.error(" XXX No se pudo iniciar la aplicación:", err.message);
    process.exit(1);
  }
};

start();
