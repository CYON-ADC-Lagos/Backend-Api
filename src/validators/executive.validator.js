const Joi = require("joi");

const createExecutiveSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80).required(),
  lastName: Joi.string().trim().min(1).max(80).required(),
  title: Joi.string().trim().max(40).optional().allow(""),
  position: Joi.string().trim().max(120).required(),
  email: Joi.string().email().lowercase().trim().optional().allow(""),
  phoneNumber: Joi.string().trim().max(20).optional().allow(""),
  deaneryId: Joi.string().uuid().optional().allow(null, ""),
  adcId: Joi.string().trim().max(80).optional().allow(""),
  order: Joi.number().integer().optional(),
});

const updateExecutiveSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80),
  lastName: Joi.string().trim().min(1).max(80),
  title: Joi.string().trim().max(40).allow(""),
  position: Joi.string().trim().max(120),
  email: Joi.string().email().lowercase().trim().allow(""),
  phoneNumber: Joi.string().trim().max(20).allow(""),
  deaneryId: Joi.string().uuid().allow(null, ""),
  adcId: Joi.string().trim().max(80).allow(""),
  order: Joi.number().integer(),
}).min(1);

module.exports = { createExecutiveSchema, updateExecutiveSchema };
