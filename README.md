# EventX Studio

EventX Studio is a full-stack event management system with role-based access (Admin/User), ticketing with QR codes, analytics, and basic reminders.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT
- Frontend: React (Vite), TailwindCSS, Recharts
- Database: MongoDB (local) at `mongodb://localhost:27017/eventx`

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Backend
```bash
cd backend
npm install
npm run seed   # seed sample users and events
npm start      # start server at http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start      # start app at http://localhost:5173
```

### Default Users
- Admin: admin@example.com / Admin@123
- User:  user@example.com / User@123

## Features
- Auth: Register/Login with JWT, roles: Admin/User
- Admin: CRUD events, manage tickets, view analytics
- User: Browse events, book tickets, view my tickets (with QR codes)
- Services: QR code generation, dummy payment simulation
- Analytics: revenue, attendees, tickets sold + charts (age/gender/location/interests)
- Notifications: simple reminders for upcoming events on user dashboard

## Environment
The app uses local MongoDB by default: `mongodb://localhost:27017/eventx`.

If you need to customize, set the following environment variables in `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventx
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

For frontend, API base can be set in `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

## API Base URL
- Backend: `http://localhost:5000`

## Scripts
### Backend
- `npm start` - start server (nodemon)
- `npm run seed` - seed sample data

### Frontend
- `npm start` - start Vite dev server

## Notes
- QR codes are generated server-side and stored on tickets as Data URLs.
- Payment is simulated; all bookings are marked as paid in demo mode.

## Configuration

Frontend:
```
cd frontend
cp .env.example .env
# set VITE_API_URL to your backend URL
VITE_API_URL=https://eventx-studio-production-b18c.up.railway.app
npm run dev
```

Backend (Railway):
- Ensure envs: `MONGO_URI`, `JWT_SECRET`, optionally `ALLOWED_ORIGINS`.
- Health: `GET /api/health` should return `{ status: "ok" }`.
