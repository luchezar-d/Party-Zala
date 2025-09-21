# MongoDB Setup Instructions

## ✅ Configuration Complete

Your MongoDB connection has been configured for the Party Zala project!

## 🔧 Final Setup Step

**You need to replace `<db_password>` with your actual MongoDB password:**

1. **Open** `server/.env`
2. **Find this line:**
   ```
   MONGODB_URI=mongodb+srv://luchezarddimitrov:<db_password>@cluster0.etep2gv.mongodb.net/party-zala?retryWrites=true&w=majority&appName=Cluster0
   ```
3. **Replace** `<db_password>` with your actual MongoDB Atlas password
4. **Save** the file

## 🚀 Test the Connection

After updating the password, you can test the connection by running:

```bash
npm run dev
```

The server will attempt to connect to MongoDB and you should see:
- ✅ Connected to MongoDB
- ✅ Admin user ensured  
- 🚀 Server running on port 4000

## 🗄️ Database Collections

The app will automatically create these collections in your `party-zala` database:
- **users** - Stores the admin user account
- **parties** - Stores all party information

## 🔐 Security Notes

- Your `.env` file is now protected by `.gitignore`
- Never commit your actual database password to version control
- The admin user will be created automatically on first server start

## 📋 Admin Login Credentials

Default admin account (you can change these in `server/.env`):
- **Email:** admin@party-zala.local
- **Password:** ChangeMe123!

---

**Ready to party! 🎉** Your database is configured and ready to store all your kids' party information!
