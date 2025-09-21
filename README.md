# Party Zala 🎉

A colorful calendar application for managing kids' parties. Built with React, Node.js, Express, and MongoDB.

## Features

- 🎪 **Colorful Calendar Interface** - Month view with intuitive navigation
- 👶 **Party Management** - Add, view, and delete kids' party details
- 🔐 **Admin Authentication** - Secure login system
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Playful UI** - Kid-friendly colors and modern design

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- React Hook Form + Zod for form validation
- Axios for API calls
- Date-fns for date manipulation
- Lucide React for icons

**Backend:**
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- JWT authentication with httpOnly cookies
- Bcrypt for password hashing
- Zod for request validation
- Rate limiting and security middleware

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd party-zala
   npm install
   ```

2. **Set up the server environment:**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` and update:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string (32+ characters)
   - `ADMIN_EMAIL` - Admin login email
   - `ADMIN_PASSWORD` - Admin login password
   - Other settings as needed

3. **Set up the client environment:**
   ```bash
   cp client/.env.example client/.env
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on http://localhost:4000
   - Frontend dev server on http://localhost:5173

5. **Login with admin credentials:**
   - Email: The email you set in `ADMIN_EMAIL`
   - Password: The password you set in `ADMIN_PASSWORD`

## Project Structure

```
party-zala/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Calendar/   # Calendar-specific components
│   │   │   ├── AuthGate.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── lib/            # Utilities (API, date helpers)
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose models
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── validators/     # Zod schemas
│   │   ├── utils/          # Helper functions
│   │   ├── config/         # Configuration
│   │   ├── db/             # Database connection
│   │   └── seed/           # Database seeding
│   └── package.json
└── package.json            # Root workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Parties
- `GET /api/parties?from=YYYY-MM-DD&to=YYYY-MM-DD` - List parties in date range
- `POST /api/parties` - Create new party
- `DELETE /api/parties/:id` - Delete party

### Health
- `GET /api/health` - API health check

## Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run lint` - Lint both client and server code

**Client:**
- `npm run dev --workspace=client` - Start client dev server
- `npm run build --workspace=client` - Build client for production

**Server:**
- `npm run dev --workspace=server` - Start server in development mode
- `npm run build --workspace=server` - Build server for production
- `npm run start --workspace=server` - Start production server

### Environment Variables

**Server (.env):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@party-zala.local
ADMIN_PASSWORD=ChangeMe123!
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
NODE_ENV=development
```

**Client (.env):**
```
VITE_API_URL=http://localhost:4000
```

## Usage

1. **Login** - Use your admin credentials to access the calendar
2. **Navigate** - Use the month navigation arrows or "Today" button
3. **Add Parties** - Click any day to open the party management modal
4. **Fill Details** - Add kid's name, age, location, time, and other party details
5. **Manage** - View existing parties for each day and delete if needed

## Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- CORS configuration
- Request validation with Zod
- Helmet security headers

## Deployment

The app is designed to be deployed on platforms like:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Heroku, DigitalOcean, or any Node.js hosting
- **Database**: MongoDB Atlas (recommended)

Make sure to:
1. Set production environment variables
2. Update `COOKIE_SECURE=true` in production
3. Set correct `CLIENT_ORIGIN` for CORS
4. Use a strong `JWT_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

---

**Party Zala** - Making kids' party planning fun and organized! 🎉
