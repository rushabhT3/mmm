const express = require("express");
const router = express.Router();

const controller = require("../controllers/controller");
const userauthentication = require("../middlewares/auth");

router.post("/user/signup", controller.signUp);
router.post("/user/login", controller.login);

router.get(
  "/dailyExpense/",
  userauthentication.authenticate,
  controller.getdailyExpense
);
router.post(
  "/dailyExpense",
  userauthentication.authenticate,
  controller.postdailyExpense
);
router.delete(
  "/deleteExpense/:id",
  userauthentication.authenticate,
  controller.deleteExpense
);
router.get(
  "/download",
  userauthentication.authenticate,
  controller.downloadExpenses
);

router.get("/random", controller.random);

module.exports = router;
