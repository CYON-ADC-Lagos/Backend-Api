const Joi = require("joi");

const createChaplainSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80).required(),
  lastName: Joi.string().trim().min(1).max(80).required(),
  title: Joi.string().trim().max(40).optional().allow(""),
  email: Joi.string().email().lowercase().trim().optional().allow(""),
  phoneNumber: Joi.string().trim().max(20).optional().allow(""),
  parishId: Joi.string().uuid().optional().allow(null, ""),
  deaneryId: Joi.string().uuid().optional().allow(null, ""),
});

const updateChaplainSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80),
  lastName: Joi.string().trim().min(1).max(80),
  title: Joi.string().trim().max(40).allow(""),
  email: Joi.string().email().lowercase().trim().allow(""),
  phoneNumber: Joi.string().trim().max(20).allow(""),
  parishId: Joi.string().uuid().allow(null, ""),
  deaneryId: Joi.string().uuid().allow(null, ""),
}).min(1);

module.exports = { createChaplainSchema, updateChaplainSchema };
