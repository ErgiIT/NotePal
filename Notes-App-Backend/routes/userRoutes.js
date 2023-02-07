const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createNewUser,
  logoutUser,
  resetPassword,
  emailInput,
} = require("../controllers/userControllers");

const router = express.Router();

// route is api endpoint
// registering data of user - post request
router.route("/").get(getAllUsers).post(createNewUser);
router.route("/update/:userId").put(updateUser);
router.route("/get/:userId").get(getUser);
router.route("/delete/:userId").delete(deleteUser);
router.route("/logout/:userId").patch(logoutUser);
router.route("/reset-password").post(emailInput);
router.route("/reset-password/:resetToken").post(resetPassword);

module.exports = router;
