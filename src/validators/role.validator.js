const Joi = require("joi");

const createRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  description: Joi.string().trim().max(240).optional().allow(""),
});

module.exports = { createRoleSchema };
