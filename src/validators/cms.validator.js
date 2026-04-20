const Joi = require("joi");

const createNewsSchema = Joi.object({
  title: Joi.string().trim().min(2).max(240).required(),
  summary: Joi.string().trim().max(500).optional().allow(""),
  body: Joi.string().trim().max(20000).required(),
  source: Joi.string().trim().max(120).optional().allow(""),
  externalUrl: Joi.string().uri().optional().allow(""),
  publishedAt: Joi.date().optional(),
});

const updateNewsSchema = Joi.object({
  title: Joi.string().trim().min(2).max(240),
  summary: Joi.string().trim().max(500).allow(""),
  body: Joi.string().trim().max(20000),
  source: Joi.string().trim().max(120).allow(""),
  externalUrl: Joi.string().uri().allow(""),
  publishedAt: Joi.date(),
}).min(1);

const createGalleryItemSchema = Joi.object({
  title: Joi.string().trim().max(200).optional().allow(""),
  caption: Joi.string().trim().max(500).optional().allow(""),
  album: Joi.string().trim().max(120).optional().allow(""),
});

const createFeedbackSchema = Joi.object({
  name: Joi.string().trim().max(120).optional().allow(""),
  email: Joi.string().email().lowercase().trim().required(),
  phoneNumber: Joi.string().trim().max(20).optional().allow(""),
  subject: Joi.string().trim().max(200).required(),
  message: Joi.string().trim().min(1).max(5000).required(),
});

const createPolicySchema = Joi.object({
  title: Joi.string().trim().min(2).max(240).required(),
  slug: Joi.string().trim().lowercase().max(240).pattern(/^[a-z0-9-]+$/).required(),
  body: Joi.string().trim().max(50000).required(),
  isPublished: Joi.boolean().optional(),
});

const updatePolicySchema = Joi.object({
  title: Joi.string().trim().min(2).max(240),
  slug: Joi.string().trim().lowercase().max(240).pattern(/^[a-z0-9-]+$/),
  body: Joi.string().trim().max(50000),
  isPublished: Joi.boolean(),
}).min(1);

module.exports = {
  createNewsSchema,
  updateNewsSchema,
  createGalleryItemSchema,
  createFeedbackSchema,
  createPolicySchema,
  updatePolicySchema,
};
