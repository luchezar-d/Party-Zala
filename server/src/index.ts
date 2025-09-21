// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

async function startServer() {
  try {
    // Import modules after dotenv is loaded
    const { default: app } = await import('./app.js');
    const { connectDB } = await import('./db/mongoose.js');
    const { ensureAdmin } = await import('./seed/ensureAdmin.js');
    const { config } = await import('./config/env.js');

    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Ensure admin user exists
    await ensureAdmin();
    console.log('✅ Admin user ensured');

    // Start the server
    const PORT = config.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 Client origin: ${config.CLIENT_ORIGIN}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
