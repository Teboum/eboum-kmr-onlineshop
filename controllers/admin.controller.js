const { addProduct } = require("../models/products.model");
const { getOrderFilter } = require("../models/cart.order.model");
const validationResult = require("express-validator").validationResult;

exports.getAdd = (req, res, next) => {
  res.render("add-product", {
    checkErrors: req.flash("validationError"),
    isUser: true,
    isAdmin: true,
    pageTitle: "Add product",
  });
};

exports.postAdd = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    addProduct({ ...req.body, image: req.file.filename })
      .then(() => {
        res.redirect("/admin/add");
      })
      .catch((err) => {
        req.flash("serverError", err);
      });
  } else {
    req.flash("validationError", validationResult(req).array());
    res.redirect("/admin/add");
  }
};

exports.getOrders = (req, res, next) => {
  if (Object.entries(req.query).length === 0 || req.query.status === "All") {
    getOrderFilter({}).then((orders) => {
      res
        .render("manage-order", {
          isUser: true,
          isAdmin: true,
          pageTitle: "Orders",
          orders: orders,
          error: false,
        })
        
    }).catch((err) => console.log(err));;
  } else {
    console.log(validationResult(req).array());
    getOrderFilter(req.query).then((orders) => {
      res
        .render("manage-order", {
          isUser: true,
          isAdmin: true,
          pageTitle: "Orders",
          orders: orders,
          error:validationResult(req).array()[0]&& validationResult(req).array()[0].param === "userEmail"?validationResult(req).array()[0]:false,
        })
        ;
    }).catch((err) => {
      console.log(err);
    });
  }
};
