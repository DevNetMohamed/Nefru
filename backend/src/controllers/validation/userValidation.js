import Joi from "joi";

export const registerUserSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid("tourist", "guide").required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});

export const googleAuthSchema = Joi.object({
  credential: Joi.string().required(),
  role: Joi.string().valid("tourist", "guide").optional(),
  rememberMe: Joi.boolean().default(false),
});

export const completeGoogleSignupSchema = Joi.object({
  onboardingToken: Joi.string().required(),
  role: Joi.string().valid("tourist", "guide").required(),
  rememberMe: Joi.boolean().default(false),
});

export const linkGoogleAccountSchema = Joi.object({
  linkingToken: Joi.string().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});

export const emailOnlySchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

export const tokenOnlySchema = Joi.object({
  token: Joi.string().required(),
});

export const forgotPasswordSchema = emailOnlySchema;

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().allow("").optional(),
  newPassword: Joi.string().min(8).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

export const connectGoogleAccountSchema = Joi.object({
  credential: Joi.string().required(),
});

const profileAvatarSchema = Joi.string()
  .trim()
  .custom((value, helpers) => {
    if (/^https?:\/\//i.test(value) || value.startsWith("/uploads/")) {
      return value;
    }
    return helpers.error("string.uri");
  }, "profile image URL validation");

export const updateTouristProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50),
  avatar: profileAvatarSchema,
  phoneNumber: Joi.string().trim().max(30).allow(""),
  gender: Joi.string().valid("male", "female", "other"),
  nationality: Joi.string().trim().max(80).allow(""),
  dateOfBirth: Joi.date().iso().max("now").allow(null),
  preferredLanguage: Joi.string().trim().min(2).max(20),
})
  .min(1)
  .messages({
    "object.min": "At least one traveler profile field is required",
  });
