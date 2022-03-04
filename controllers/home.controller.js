const productsModel = require("../models/products.model");

exports.getHome = (req, res, next) => {
  //get products
  //render index.ejs

  let category = req.query.category;
  console.log(req.ip,1);
  let productsPromise;
  if (category && category !== "All") {
    productsPromise = productsModel.getProductsByCategory(category);
  } else productsPromise = productsModel.getAllProducts();
  productsPromise.then((products) => {
    res.render("index", {
      products: products,
      isUser:req.session.userId,
      validationError:req.flash('validationError')[0],
      isAdmin:req.session.isAdmin,
      pageTitle:'Home'
    });
    
  }).catch(err=>next(err));
};
