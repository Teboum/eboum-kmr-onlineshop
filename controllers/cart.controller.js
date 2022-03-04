const cartModel = require("../models/cart.order.model");

const validationResult = require("express-validator").validationResult;

exports.getCart = (req, res, next) => {
  cartModel
    .getItemsByUser(req.session.userId)
    .then((items) => {
      console.log(items);
      res.render("cart", {
        items: items,
        isUser: true,
        error: req.flash("validationErrors")[0],
        isAdmin: req.session.isAdmin,
        pageTitle: "Cart",
      });
    })
    .catch((err) => {console.log(err);return next(err)});
};
exports.postCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .addNewItem({
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        productId: req.body.productId,
        userId: req.session.userId,
        timestamp: Date.now(),
      })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => next(err));
  } else {
    req.flash("validationError", validationResult(req).array());
    res.redirect(req.body.redirectTo);
  }
};

exports.postSave = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .editItem(req.body.cartId, {
        amount: req.body.amount,
        timestamp: Date.now(),
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => next(err));
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/cart");
  }
};

exports.postDelete = (req, res, next) => {
  cartModel
    .deleteItem(req.body.cartId)
    .then(() => res.redirect("/cart"))
    .catch((err) => next(err));
};

exports.postDeleteAll = (req, res, next) => {
  cartModel
    .deleteAllItems(req.session.userId)
    .then(() => res.redirect("/cart"))
    .catch((err) => next(err));
};

//// ----------------------Orders----------------//////////
exports.putOrder = (req, res, next) => {
  res.render("verifyOrder", {
    isUser: true,
    cartId: req.query.cartId,
    isAdmin: req.session.isAdmin,
    error: req.flash("validationErrors")[0],
    pageTitle: "Add Adress & Confirm",
  });
};

exports.postOrder = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    const adress=req.body.adress
    console.log(req.body.cartId, adress,'adress', req.session.email);
    cartModel
      .addNewOrder(
        req.body.cartId,
        adress,
        req.session.email
      )
      .then(() => {
        res.redirect("/order");
      })
      .catch((err) => console.log(err));
  } else {
    req.flash("validationErrors", validationResult(req).array());
    req.flash("cartId", req.body.cartId);
    req.flash("adress", req.body.adress);
    res.redirect("/cart/verifyOrder");
  }
};
