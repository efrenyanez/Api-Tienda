const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
router.post("/verify", authController.verifyJWT);
router.get("/me", authMiddleware, authController.getUserInfo);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;