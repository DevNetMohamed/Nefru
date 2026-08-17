import Joi from "joi";

export const registerUserSchema = Joi.object({
  // fullName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).required(),
  // password confirmation is for client-side only
  // confirmPassword: Joi.string().valid(Joi.ref("password")),
  // role: Joi.string().valid("tourist", "guide").default("tourist"),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),

  newPassword: Joi.string().min(8).required(),

  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required(),
});