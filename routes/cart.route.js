const router = require("express").Router()
const bodyParser= require('body-parser');
const authGuard = require('./guards/auth.guard')
const check = require('express-validator').check

const cartController = require('../controllers/cart.controller')

router.get('/',authGuard.isAuth,cartController.getCart)
router.post('/',authGuard.isAuth,
    bodyParser.urlencoded({extended:true}),
    check('amount')
        .not()
        .isEmpty()
        .withMessage('amount is required')
        .isInt({min:1})
        .withMessage('amount must be greater then 0'),
        cartController.postCart
        )
router.post('/save',authGuard.isAuth,
    bodyParser.urlencoded({extended:true}),
    check('amount')
        .not()
        .isEmpty()
        .withMessage('amount is required')
        .isInt({min:1})
        .withMessage('amount must be greater then 0'),
        cartController.postSave)

router.post('/delete',authGuard.isAuth,bodyParser.urlencoded({extended:true}),cartController.postDelete)

router.post('/deleteAll',authGuard.isAuth,bodyParser.urlencoded({extended:true}),cartController.postDeleteAll)

router.get('/verifyOrder',authGuard.isAuth,bodyParser.urlencoded({extended:true}),cartController.putOrder)

router.post('/order',authGuard.isAuth,bodyParser.urlencoded({extended:true}),check('adress').isLength({min:8}).withMessage('It must be an Adress'),cartController.postOrder)
module.exports = router