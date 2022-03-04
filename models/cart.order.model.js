const mongoose = require("mongoose");

const DB_URL =
  "mongodb://admin:MvHVMeRzCtIp1Cyj@cluster0-shard-00-00.dacyj.mongodb.net:27017,cluster0-shard-00-01.dacyj.mongodb.net:27017,cluster0-shard-00-02.dacyj.mongodb.net:27017/online-shop?ssl=true&replicaSet=atlas-enldim-shard-0&authSource=admin&retryWrites=true&w=majority";

const cartSchema = mongoose.Schema({
  name: String,
  price: Number,
  amount: Number,
  userId: String,
  productId: String,
  timestamp: Number,
});

const CartItem = mongoose.model("cart", cartSchema);

exports.addNewItem = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return CartItem.findOne({ productId: data.productId }, (err, obj) => {
          if (obj) {
            let x = obj.amount + +data.amount;

            CartItem.updateOne(
              { productId: data.productId },
              { amount: x }
            ).then(() => {
              mongoose.disconnect();
              resolve();
            });
          } else {
            let item = new CartItem(data);
            return item.save();
          }
        });
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.getItemsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() =>
        CartItem.find({ userId: userId }, {}, { sort: { timestamp: 1 } })
      )
      .then((items) => {
        mongoose.disconnect();
        resolve(items);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.editItem = (id, newData) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => CartItem.updateOne({ _id: id }, newData))
      .then((items) => {
        mongoose.disconnect();
        resolve(items);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => CartItem.findByIdAndDelete(id))
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.deleteAllItems = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => CartItem.deleteMany({ userId: id }))
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
//--------------------- /// ----------Orders----------- /////--------------------------///
const orderSchema = mongoose.Schema({
  name: String,
  price: Number,
  amount: Number,
  userId: String,
  adress: String,
  status: String,
  productId: String,
  timestamp: Number,
  userEmail: String,
});

const OrderItem = mongoose.model("order", orderSchema);

exports.addNewOrder = (cartId, adress,userEmail) => {
  console.log(adress, userEmail);
 
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() =>

        CartItem.findOne({ _id: cartId }, { timestamp: false }, (err, obj) => {
          if (!obj) {
            mongoose.disconnect();
            return reject(err);
          } else {
            console.log(adress);
            let order = new OrderItem({
              userEmail: userEmail,
              name: obj.name,
              price: +obj.price * +obj.amount,
              amount: obj.amount,
              userId: obj.userId,
              adress: adress,
              status: "Pending",
              productId: obj.productId,
              timestamp: Date.now(),
            });
            return order.save();
          }
        })
      )
      .then(() => CartItem.deleteOne({ _id: cartId }))
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject("bas");
      });
  });
};

exports.getOrderByUser = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return OrderItem.find({ userId: id });
      })
      .then((orders) => {
        console.log(orders);
        mongoose.disconnect();
        resolve(orders);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return OrderItem.findByIdAndDelete(id);
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject();
      });
  });
};

exports.deleteOrders = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return OrderItem.deleteMany({ userId: id });
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject();
      });
  });
};

exports.getOrderFilter = (filter) => {
  console.log(filter, "filter");
  return new Promise((resolve, reject) => {
    console.log(filter,232);
    mongoose
      .connect(DB_URL)
      .then(() => {
        console.log(filter);
        return OrderItem.find(filter);
      })
      .then((orders) => {
        console.log(orders,'resolved');
        mongoose.disconnect();
        resolve(orders);
      })
      .catch((err) => {
        mongoose.disconnect();
        console.log(err);
        reject(err);
      });
  });
};

exports.modifyOrder = (id, status) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return OrderItem.findByIdAndUpdate(id, { status: status });
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject();
      });
  });
};
