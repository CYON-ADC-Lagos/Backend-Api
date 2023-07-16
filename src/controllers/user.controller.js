const User = require("../models/User");

exports.getUser = (req, res, next) => {
  console.log("USer method")
  User.findAll()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.json({ msg: "failed", error: err }));
};
