import mongoose from 'mongoose';
import { config } from '../config/env.js';

export async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('🗄️  MongoDB connection established');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

export default mongoose;
