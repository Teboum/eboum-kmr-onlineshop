const {
  getOrderByUser,
  deleteOrder,
  deleteOrders,
  modifyOrder,
} = require("../models/cart.order.model");

const validationResult = require("express-validator").validationResult;

exports.getOrder = (req, res, next) => {
  getOrderByUser(req.session.userId)
    .then((orders) => {
      res.render("order", {
        orders,
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Order",
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteOneOrder = (req, res, next) => {
  deleteOrder(req.body.orderId)
    .then(() => res.redirect("/admin/manage-order"))
    .catch((err) => next(err));
};

exports.deleteAllOrders = (req, res, next) => {
  deleteOrders(req.session.userId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => next(err));
};

exports.changeStatusOrders = (req, res, next) => {
  modifyOrder(req.body.orderId, req.body.newStatus)
    .then(() => {
      res.redirect("/admin/manage-order");
    })
    .catch((err) => next(err));
};
