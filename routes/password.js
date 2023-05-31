const express = require("express");
const router = express.Router();

const passwordController = require("../controllers/password");

router.get(
  "/updatepassword/:resetpasswordid",
  passwordController.updatepassword
);

router.get("/resetpassword/:id", passwordController.resetpassword);

// ? router.use pr delete, post, get, put kuchh bhi laga sakte. hum post kr rhe
router.use("/forgotpassword", passwordController.forgotpassword);

module.exports = router;
