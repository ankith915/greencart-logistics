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



GreenCart Logistics — Setup & Run Guide
📦 Requirements

Before starting, make sure you have:

Node.js v20+

npm v10+ (comes with Node)

PostgreSQL (local or remote)

pgAdmin (optional, for GUI access to DB)

Git (if cloning from a repo)

⚙️ 1. Clone the Project
git clone <your-repo-url>
cd greencart-logistics

📚 2. Install Dependencies
npm install

🗄️ 3. Setup Environment Variables

Create a .env file in the project root:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public
JWT_SECRET=your-secret-key


Replace USER, PASSWORD, HOST, PORT, and DB_NAME with your PostgreSQL credentials.
JWT_SECRET can be any random string — it’s used for signing login tokens.

🛠️ 4. Prepare the Database

Generate Prisma client:

npm run prisma:generate


Run migrations:

npm run prisma:migrate


Seed the database with initial data:

npm run db:seed

🚀 5. Run the Development Server
npm run dev


App will be available at:

http://localhost:3000

👤 6. Create Your First User

In another terminal:

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

🔑 7. Login

Visit: http://localhost:3000/login

Enter the username & password you just created.

📋 8. Features

Dashboard: See KPIs & charts

Drivers: Manage drivers (CRUD)

Routes: Manage delivery routes

Orders: Manage orders

Simulation: Run logistics simulations

History: View simulation history

🏗️ 9. Build for Production
npm run build
npm start

🧹 10. Common Issues

Module not found: Run npm install again.

Database connection error: Check DATABASE_URL in .env.

Seed fails: Ensure DB exists before running npm run db:seed.