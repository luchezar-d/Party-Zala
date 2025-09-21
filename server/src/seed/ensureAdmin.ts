import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

export async function ensureAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: config.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      return;
    }

    // Hash the admin password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(config.ADMIN_PASSWORD, saltRounds);

    // Create admin user
    const adminUser = new User({
      email: config.ADMIN_EMAIL,
      name: config.ADMIN_NAME,
      passwordHash
    });

    await adminUser.save();
    console.log('👤 Admin user created successfully');
  } catch (error) {
    console.error('❌ Failed to ensure admin user:', error);
    throw error;
  }
}
