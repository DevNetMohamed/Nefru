
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {

  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const token = authHeader && authHeader.split(" ")[1];

    
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
   
    const decoded = jwt.verify(token, env.jwtSecret);
   
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ msg: "User not found or inactive, authorization denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized"));
  }
};


