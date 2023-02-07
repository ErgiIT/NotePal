const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userControllers");

router.route("/").post(usersController.registerUser);

module.exports = router;
