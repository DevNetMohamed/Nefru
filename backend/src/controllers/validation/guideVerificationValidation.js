import fs from "fs";

import Joi from "joi";

import { DOCUMENT_TYPES } from "../../models/guideVerification.model.js";

const uploadVerificationDocumentSchema = Joi.object({
  documentType: Joi.string()
    .valid(...DOCUMENT_TYPES)
    .required(),
});

export const validateVerificationDocumentUpload = async (req, res, next) => {
  const { error, value } = uploadVerificationDocumentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    if (req.file?.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }

    res.status(400);
    next(new Error("A valid documentType is required"));
    return;
  }

  req.body = value;
  next();
};

