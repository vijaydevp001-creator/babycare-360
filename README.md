# Baby360 - Complete Child Health Ecosystem

Production-ready full-stack web app for child health tracking.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Optional**: Socket.io, Firebase

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com/))

### 1. Clone & Install
```bash
git clone <repo>
cd Baby360
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET=your-secret
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
App: http://localhost:5173

### 4. Test Flow
- Register/Login (Parent/Doctor/School role)
- Create Child Profile
- Add Growth/Vaccine data → See dynamic charts
- Book Appointments

## Environment Variables
```
MONGO_URI=mongodb://localhost:27017/baby360  # or Atlas
JWT_SECRET=your-super-secret-key
PORT=5000  # Backend
```

## Production Deployment
- Backend: PM2 or Docker + MongoDB Atlas
- Frontend: Vite build → Vercel/Netlify
- CORS: Update for prod domains

## API Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET/POST /api/children (auth required)
/api/vaccines, /api/growth, /api/appointments, etc.
```

## Project Structure
```
backend/    # Express + Mongoose
frontend/   # React + Tailwind
```

Happy parenting! 👶✨

