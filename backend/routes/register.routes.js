const express = require("express");
const router = express.Router();

const Register = require("../controller/register.controller");

router.post("/", Register.register);

module.exports = router;
