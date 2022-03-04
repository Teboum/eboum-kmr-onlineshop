const router = require("express").Router();
const check = require("express-validator").check;
const multer = require("multer");
const adminController = require("../controllers/admin.controller");
const adminGuard = require("./guards/admin.guard");

router.get("/add", adminGuard, adminController.getAdd);

router.post(
  "/add",
  adminGuard,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "images"); /// images--->folder destination
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); //file name with extention And to store it in db
      },
    }),
  }).single("image"),
  check("image").custom((value, { req }) => {
    if (req.file) return true;
    else throw "image is required";
  }),
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name of Product id require")
    .isString(),
  check("price")
    .isNumeric()
    .withMessage("price must be a numeric value")
    .not()
    .isEmpty()
    .withMessage("price is require"),
  check("category").not().isEmpty().withMessage("please select a category"),
  adminController.postAdd
);

router.get(
  "/manage-order",
  check("userEmail").isEmail().withMessage("Please wrigth a valid Email"),
  adminGuard,
  adminController.getOrders
);

module.exports = router;
