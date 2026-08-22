import mongoose from 'mongoose';
import { env } from './env.js';

export const connectedDB = async () => {
  try {
    console.log(env.mongoUri)
    await mongoose.connect(env.mongoUri);
    console.log(`Database connected: ${mongoose.connection.host}`);
  } catch (error) {
    
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectedDB;