# GreenCart Logistics

## Project Overview
Internal tool for simulating delivery operations and calculating KPIs based on company rules. Helps managers optimize staffing and routes.

## Tech Stack
- Frontend: Next.js (React Hooks), Tailwind CSS, Recharts
- Backend: Next.js API Routes, Mongoose, JWT, bcrypt
- Database: MongoDB Atlas
- Testing: Jest

## Setup Instructions
1. Clone repo.
2. `npm install`
3. Add .env with MONGODB_URI and JWT_SECRET.
4. `npm run dev`
5. Seed: /api/seed
6. Login: /login (admin/password)

## Environment Variables
- MONGODB_URI
- JWT_SECRET

## Deployment Instructions
- Push to GitHub.
- Vercel: Import, add env vars, deploy.

## API Documentation
- /api/auth/login (POST): {username, password}
- /api/simulation (POST): {numDrivers, startTime, maxHours} → KPIs
- /api/simulation (GET): History
- /api/drivers (GET/POST), /api/drivers/[id] (PUT/DELETE)
- Similar for /api/routes, /api/orders

Example Request (Simulation):
POST /api/simulation
Body: {"numDrivers":5,"startTime":"09:00","maxHours":8}

Response: {"totalProfit":1234.56,"efficiencyScore":85.5,...}