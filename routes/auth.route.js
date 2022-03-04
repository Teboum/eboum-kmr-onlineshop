const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check

const authController = require("../controllers/auth.controller");
const authGuard=require('./guards/auth.guard')

router.get("/signup", authGuard.notAuth,authController.getSignup);

router.post(
  "/signup",
  authGuard.notAuth,
  bodyParser.urlencoded({ extended: true }),
  check('username').not().isEmpty().withMessage('userName is require'),
  check('email').not().isEmpty().withMessage('email is require').isEmail().withMessage('invalid format'),
  check('password').isLength({min:6}).withMessage('password must be at least 6 character'),
  check('confirmPassword').custom((value,{req})=>{ //req destructing from meta object
    if(value===req.body.password)return true
    else throw "passwords don't equal"
  }),
  authController.postSignup
);

router.get("/login",authGuard.notAuth, authController.getLogin);
router.post('/login',authGuard.notAuth,bodyParser.urlencoded({ extended: true }),
check('email').not().isEmpty().withMessage('Email is require').isEmail().withMessage('invalid format'),
check('password').not().isEmpty().withMessage("Password is required").isLength({min:6}).withMessage('password must be at least 6 character'),authController.postLogin)

router.all('/logout',authGuard.isAuth, authController.logout)
module.exports = router;
