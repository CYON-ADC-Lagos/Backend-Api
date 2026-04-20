const Joi = require("joi");

const createAydSchema = Joi.object({
  theme: Joi.string().trim().min(2).max(240).required(),
  venue: Joi.string().trim().max(240).optional().allow(""),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  description: Joi.string().trim().max(5000).optional().allow(""),
  isActive: Joi.boolean().optional(),
});

const updateAydSchema = Joi.object({
  theme: Joi.string().trim().min(2).max(240),
  venue: Joi.string().trim().max(240).allow(""),
  startDate: Joi.date(),
  endDate: Joi.date(),
  description: Joi.string().trim().max(5000).allow(""),
  isActive: Joi.boolean(),
}).min(1);

const createDelegateSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80).required(),
  lastName: Joi.string().trim().min(1).max(80).required(),
  email: Joi.string().email().lowercase().trim().required(),
  phoneNumber: Joi.string().trim().min(7).max(20).required(),
  deaneryId: Joi.string().uuid().required(),
  parishId: Joi.string().uuid().required(),
  aydId: Joi.string().uuid().required(),
  position: Joi.string().trim().max(120).optional().allow(""),
  gender: Joi.string().valid("Male", "Female").required(),
});

module.exports = { createAydSchema, updateAydSchema, createDelegateSchema };
