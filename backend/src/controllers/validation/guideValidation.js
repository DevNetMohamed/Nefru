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
  avatar: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (/^https?:\/\//i.test(value) || value.startsWith("/uploads/")) {
        return value;
      }
      return helpers.error("string.uri");
    }, "profile image URL validation"),
  headline: Joi.string().trim().max(120).allow(""),
  location: Joi.string().trim().max(100).allow(""),
  phoneNumber: Joi.string().trim().max(30).allow(""),
  gender: Joi.string().valid("male", "female", "other"),
  nationality: Joi.string().trim().max(80).allow(""),
  dateOfBirth: Joi.date().iso().max("now").allow(null),
  preferredLanguage: Joi.string().trim().min(2).max(20),
  about: Joi.string().trim().max(2000).allow(""),
  yearsExperience: Joi.number().integer().min(0).max(60),
  languages: languagesSchema,
  specialties: specialtiesSchema,
})
  .min(1)
  .messages({
    "object.min": "At least one guide profile field is required",
  });
