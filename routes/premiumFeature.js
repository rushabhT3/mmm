const express = require("express");
const router = express.Router();

const premiumFeatureController = require("../controllers/premiumFeature");

const authenticatemiddleware = require("../middlewares/auth");

router.get(
  "/showLeaderBoard",
  authenticatemiddleware.authenticate,
  premiumFeatureController.getUserLeaderBoard
);

module.exports = router;
