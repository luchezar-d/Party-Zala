import { User } from '../models/User.js';
import { config } from '../config/env.js';

export async function updateAdminName() {
  try {
    // Find admin user by email
    const admin = await User.findOne({ email: config.ADMIN_EMAIL });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    // Update the name
    admin.name = config.ADMIN_NAME;
    await admin.save();
    
    console.log(`✅ Admin name updated to: ${config.ADMIN_NAME}`);
  } catch (error) {
    console.error('❌ Failed to update admin name:', error);
    throw error;
  }
}
