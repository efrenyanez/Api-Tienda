const express = require("express");
const router = express.Router();

const Login = require("../controller/login.controller");

router.post("/", Login.login);

module.exports = router;
