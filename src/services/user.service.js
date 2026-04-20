const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");
const ErrorResponse = require("../utils/errorResponse");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const PUBLIC_ATTRS = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "picture",
  "baptismalName",
  "membershipId",
  "position",
  "isActive",
  "deaneryId",
  "parishId",
  "roleId",
  "createdAt",
  "updatedAt",
];

const publicInclude = [
  { model: Role, attributes: ["id", "name"] },
  { model: Deanery, attributes: ["id", "name"] },
  { model: Parish, attributes: ["id", "name"] },
];

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
const verifyPassword = (plain, hashed) => bcrypt.compare(plain, hashed);

const findByEmail = (email) => User.findOne({ where: { email } });

const createUser = async (data) => {
  const existing = await findByEmail(data.email);
  if (existing) throw new ErrorResponse("Email already registered", 409);

  const role = await Role.findByPk(data.roleId);
  if (!role) throw new ErrorResponse("Invalid roleId", 400);

  const user = await User.create({
    ...data,
    password: await hashPassword(data.password),
  });

  return User.findByPk(user.id, {
    attributes: PUBLIC_ATTRS,
    include: publicInclude,
  });
};

const toPublicJson = (user) => {
  if (!user) return null;
  const u = user.toJSON ? user.toJSON() : user;
  delete u.password;
  return u;
};

module.exports = {
  PUBLIC_ATTRS,
  publicInclude,
  hashPassword,
  verifyPassword,
  findByEmail,
  createUser,
  toPublicJson,
};
