import Joi from "joi";
import { GUIDE_SPECIALTIES } from "../../models/guide.model.js";

const languagesSchema = Joi.array()
  .items(Joi.string().trim().min(2).max(40))
  .max(10)
  .unique();

const specialtiesSchema = Joi.array()
  .items(Joi.string().valid(...GUIDE_SPECIALTIES))
  .max(3)
  .unique();

export const updateGuideProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50),
  avatar: Joi.string().trim().uri(),
  headline: Joi.string().trim().max(120).allow(""),
  location: Joi.string().trim().max(100).allow(""),
  about: Joi.string().trim().max(2000).allow(""),
  yearsExperience: Joi.number().integer().min(0).max(60),
  languages: languagesSchema,
  specialties: specialtiesSchema,
})
  .min(1)
  .messages({
    "object.min": "At least one guide profile field is required",
  });
