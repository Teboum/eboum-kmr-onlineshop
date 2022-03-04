const mongoose = require("mongoose");

const DB_URL =
  "mongodb://admin:MvHVMeRzCtIp1Cyj@cluster0-shard-00-00.dacyj.mongodb.net:27017,cluster0-shard-00-01.dacyj.mongodb.net:27017,cluster0-shard-00-02.dacyj.mongodb.net:27017/online-shop?ssl=true&replicaSet=atlas-enldim-shard-0&authSource=admin&retryWrites=true&w=majority";
const productSchema = mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  category: String,
});

const Product = mongoose.model("product", productSchema);

exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return Product.find({});
      })
      .then((products) => {
        mongoose.disconnect();
        resolve(products);
      }).catch -
      ((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.getProductsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return Product.find({ category: category });
      })
      .then((products) => {
        mongoose.disconnect();
        resolve(products);
      }).catch -
      ((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });

  //connect to db

  //get products

  //disconnect
};
exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return Product.findById(id);
      })
      .then((product) => {
        mongoose.disconnect();
        resolve(product);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.getFisrstProduct = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return Product.findOne({});
      })
      .then((product) => {
        mongoose.disconnect();
        resolve(product);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.addProduct = (product) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        product.price = +product.price;
        let newProduct = new Product({
          name: product.name,
          image: product.image,
          price: product.price,
          description: product.description,
          category: product.category,
        });
        return newProduct.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
        console.log(err);
      });
  });
};
