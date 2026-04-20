const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80).required(),
  lastName: Joi.string().trim().min(1).max(80).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  phoneNumber: Joi.string().trim().min(7).max(20).required(),
  roleId: Joi.string().uuid().required(),
  deaneryId: Joi.string().uuid().optional().allow(null, ""),
  parishId: Joi.string().uuid().optional().allow(null, ""),
  baptismalName: Joi.string().trim().max(80).optional().allow(""),
  membershipId: Joi.string().trim().max(50).optional().allow(""),
  position: Joi.string().trim().max(80).optional().allow(""),
  dateOfBirth: Joi.date().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(1).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80),
  lastName: Joi.string().trim().min(1).max(80),
  email: Joi.string().email().lowercase().trim(),
  phoneNumber: Joi.string().trim().min(7).max(20),
  roleId: Joi.string().uuid(),
  deaneryId: Joi.string().uuid().allow(null, ""),
  parishId: Joi.string().uuid().allow(null, ""),
  baptismalName: Joi.string().trim().max(80).allow(""),
  membershipId: Joi.string().trim().max(50).allow(""),
  position: Joi.string().trim().max(80).allow(""),
  dateOfBirth: Joi.date(),
  isActive: Joi.boolean(),
}).min(1);

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().min(10).max(256).required(),
  password: Joi.string().min(8).max(128).required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).required(),
  newPassword: Joi.string().min(8).max(128).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
