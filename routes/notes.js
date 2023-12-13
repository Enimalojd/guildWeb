const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/adminCheck")

router.get("/", auth,isAdmin  () => );
