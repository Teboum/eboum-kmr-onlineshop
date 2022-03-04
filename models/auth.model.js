const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DB_URL =
  "mongodb://admin:MvHVMeRzCtIp1Cyj@cluster0-shard-00-00.dacyj.mongodb.net:27017,cluster0-shard-00-01.dacyj.mongodb.net:27017,cluster0-shard-00-02.dacyj.mongodb.net:27017/online-shop?ssl=true&replicaSet=atlas-enldim-shard-0&authSource=admin&retryWrites=true&w=majority";

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false, ///important defaul value
  },
});

const User = mongoose.model("user", userSchema);

exports.createNewUser = (username, email, password) => {
  // check if email exists
  // yes =>error
  // no =>create
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          reject("email is used");
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hashedPassword) => {
        let user = new User({
          username: username,
          email: email,
          password: hashedPassword,
        });
        return user.save();
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

exports.login = (email, password) => {
  //check if email existe
  //no ==>email doesn't exist
  //yes => check password
  //no => error
  // yes =>
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => User.findOne({ email: email }))
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("there is no user matches");
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
              mongoose.disconnect();
              reject("passworf incorrect");
            } else {
              mongoose.disconnect();
              resolve({
                id: user._id,
                isAdmin: user.isAdmin,
                userEmail: user.email,
              });
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

const ipSchema = mongoose.Schema({
  ip: String,
  date: {type:String,default:new Date().toString()},
})

  const Ip = mongoose.model("ip", ipSchema);

  exports.createIp = (ip) => {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(DB_URL)
        .then(() => {
          let addip = new Ip({
            ip: ip,
          });
          return addip.save();
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