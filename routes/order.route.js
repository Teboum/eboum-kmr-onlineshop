const router = require("express").Router();
const bodyParser = require("body-parser");
const authGuard = require("./guards/auth.guard");

const {
  getOrder,
  deleteOneOrder,
  deleteAllOrders,
  changeStatusOrders,
} = require("../controllers/order.controller");

router.get(
  "/",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  getOrder
);
router.post(
  "/deleteOne/",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  deleteOneOrder
);
router.post(
  "/deleteAll/",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  deleteAllOrders
);
router.post(
  "/changeStatus",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  changeStatusOrders
);

module.exports = router;
