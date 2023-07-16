const Role = require("../models/Role");

exports.getRoles = (req, res, next) => {
  console.log("Role method")
  Role.findAll()
    .then((role) => {
      console.log(role);
      res.json(role);
    })
    .catch((err) => res.json({ msg: "failed", error: err }));
};
