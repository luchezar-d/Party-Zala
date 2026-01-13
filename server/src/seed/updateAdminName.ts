import { User } from '../models/User.js';
import { config } from '../config/env.js';

export async function updateAdminName() {
  try {
    // Find admin user by email
    const admin = await User.findOne({ email: config.ADMIN_EMAIL });
    
    if (!admin) {
      console.log('ℹ️  Admin user not found yet, will be created on first run');
      return;
    }

    // Only update if the name is different
    if (admin.name !== config.ADMIN_NAME) {
      admin.name = config.ADMIN_NAME;
      await admin.save();
      console.log(`✅ Admin name updated to: ${config.ADMIN_NAME}`);
    } else {
      console.log(`ℹ️  Admin name already set to: ${config.ADMIN_NAME}`);
    }
  } catch (error) {
    console.error('⚠️  Failed to update admin name (non-critical):', error);
    // Don't throw - this is not critical enough to stop server startup
  }
}
