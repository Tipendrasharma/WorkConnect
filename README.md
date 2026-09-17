# WorkerConnect

A full-stack marketplace connecting local skilled workers (painters, electricians, plumbers, mechanics, etc.) with nearby customers, using GPS-based search.

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Axios + React Hook Form + Framer Motion + Leaflet
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT + Multer + ImageKit  + bcrypt
- **Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

## What's implemented
- Worker registration (with GPS capture, photo upload to ImageKit) & login
- Customer registration & login (no login required to browse/search)
- Geospatial "nearest workers" search using MongoDB `$geoNear` (2dsphere index) — filters by category, keyword, radius (5/10/20/50 km), sort by nearest/rating/wage/availability
- Worker profile page with map, skills, reviews, call/WhatsApp/share
- Review system: rate, comment, like, report
- Worker dashboard: edit profile, change availability, upload photo, view stats/notifications, delete account
- Admin panel: dashboard stats, approve/suspend/reinstate/delete workers, most-searched category tracking
- Dark mode, skeleton loading states, toast notifications, pagination, responsive glassmorphism UI
- Rate limiting, helmet, input validation, centralized error handling

## What needs a third-party key before it works
- **ImageKit** — set `ImageKit*` vars in backend `.env`, or photo upload will fail
- **MongoDB Atlas** — set `MONGO_URI`
- **OTP login / forgot password** — stubbed with `501 Not Implemented`; wire up Twilio/MSG91 (SMS) or SendGrid (email) and fill in `authController.js`
- **"Enter City" search** (without GPS) — currently falls back to an unfiltered list; add a geocoding call (e.g. OpenStreetMap Nominatim) to convert city name → lat/lng before hitting `/api/workers`

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ImageKit* keys
npm install
npm run seed            # seeds the 15 worker categories
npm run dev              # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

### Creating an admin account
There's no public admin signup (by design). After registering a customer account, manually set `role: "admin"` on that user's document in MongoDB Atlas (or via `mongosh`):
```js
db.users.updateOne({ mobile: "9999999999" }, { $set: { role: "admin" } })
```

## Deployment
1. **MongoDB Atlas** — create a free cluster, whitelist `0.0.0.0/0` (or Render's IPs), copy the connection string into `MONGO_URI`.
2. **Backend → Render** — new Web Service, root directory `backend`, build `npm install`, start `npm start`. Add the env vars from `.env.example` in the Render dashboard (a starter `render.yaml` is included).
3. **Frontend → Vercel** — import the `frontend` folder, framework preset "Vite", set `VITE_API_URL` to your Render backend URL + `/api`.
4. Update `CLIENT_URL` in the backend env to your Vercel domain (for CORS).

## Project Structure
```
backend/
  config/       # db.js, ImageKit.js
  controllers/  # auth, worker, review, admin
  models/       # Worker, User, Review, Category, ContactRequest
  routes/       # authRoutes, workerRoutes, reviewRoutes, adminRoutes, categoryRoutes
  middleware/   # authMiddleware, uploadMiddleware, errorMiddleware, validateMiddleware
  utils/        # geo.js (Haversine), generateToken.js, seed.js
  server.js

frontend/src/
  components/   # Navbar, Footer, WorkerCard, SearchBar, MapView, FilterPanel, StarRating, ProtectedRoute...
  pages/        # Home, SearchResults, WorkerProfile, WorkerRegister, CustomerRegister, Login, WorkerDashboard, AdminDashboard
  context/      # AuthContext, ThemeContext
  hooks/        # useGeolocation, useDebounce
  services/     # api.js, authService, workerService, reviewService
  utils/        # constants.js, format.js
```

## API Endpoints
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register/worker | Public |
| POST | /api/auth/register/customer | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| GET | /api/workers?lat=&lng=&radius=&category=&keyword=&sortBy= | Public |
| GET | /api/workers/featured | Public |
| GET | /api/workers/:id | Public |
| PUT | /api/workers/update | Private (worker) |
| PUT | /api/workers/availability | Private (worker) |
| DELETE | /api/workers | Private (worker) |
| GET | /api/workers/dashboard/me | Private (worker) |
| POST | /api/workers/:id/contact | Public |
| POST | /api/reviews | Private (customer) |
| GET | /api/reviews/:workerId | Public |
| PUT | /api/reviews/:id/like | Private (customer) |
| PUT | /api/reviews/:id/report | Private (customer) |
| GET | /api/admin/dashboard | Private (admin) |
| GET | /api/admin/workers | Private (admin) |
| PUT | /api/admin/workers/:id/approve\|suspend\|reinstate | Private (admin) |
| DELETE | /api/admin/workers/:id | Private (admin) |
| GET | /api/categories | Public |
