const express = require("express");
const userController = require("../controllers/user.controller");
const upload = require("../middleware/storage.middleware");

const route = express.Router();

<<<<<<< HEAD
route.get("/", userController.getUsers);
// route.get("/:userId",);
// route.put("/:userId",);
// route.delete(":/userId");
route.post("/new", upload.single('picture'), userController.createUser);
route.post("/login", userController.loginUser);
=======
route.get("/all", userController.getUser);
route.get("/user/all", userController.getAllUser);
route.get("/:id", userController.getUserById);
route.post("/signup", userController.register);
>>>>>>> a870fe1 (updated file)

module.exports = route;
