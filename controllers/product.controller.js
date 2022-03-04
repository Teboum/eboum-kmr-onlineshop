const productsModel = require("../models/products.model");


exports.getProduct = (req, res, next) => {
  productsModel.getFisrstProduct().then((product) => {
    res.render("product", {
      product: product,
      isAdmin:req.session.isAdmin,
      isUser:req.session.isUser,
      pageTitle:'Product'
    });
  }).catch(err=>next(err));
};

exports.getProductById = (req, res, next) => {
  //get id
  //get product
  //render

  let id = req.params.id;
  productsModel.getProductById(id).then((product) => {
    res.render("product", {
      product: product,
      isAdmin:req.session.isAdmin,
      isUser:req.session.isUser,
      pageTitle:'Product details'
    });
  }).catch(err=>next(err));
};