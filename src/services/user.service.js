const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse.js");
const AUTH_SECRET_KEY = "CYONLAGOSAYD2023";
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.getAllUser = async function () {
  try {
    const allUsers = await User.findAll();
    return allUsers;
  } catch (e) {
    // Log Errors
    throw new ErrorResponse("Error occured", 404);
  }
};

exports.register = async function (query) {
  const { firstName, lastName, email, password, phoneNumber, deaneryId } =
    query;
  if (
    !firstName ||
    !lastName ||
    !password ||
    !email ||
    !phoneNumber ||
    !deaneryId
  ) {
    return next(new ErrorResponse(`Please fill in all fields`, 400));
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorResponse("That email is already registered", 400));
  } else {
    let hashedPassword;
    try {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(Password, salt);
    } catch (error) {
      throw error;
    }
  }
  const user = await new model({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    role,
    phoneNumber,
    deaneryId,
  }).save();

  return user;
};

exports.getUserById = async function ({ id }) {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (e) {
    // Log Errors
    throw new ErrorResponse("Error occured", 404);
  }
};
