import { env } from "../config/env.js";
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      if (env.nodeEnv === "development") {
        console.log(error.details);
      }

      res.status(400);
      throw new Error("Invalid request data");
    }

    req.body = value;
    next();
  };
};
