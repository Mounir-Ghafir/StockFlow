# StockFlow

[![CI](https://github.com/Mounir-Ghafir/StockFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/Mounir-Ghafir/StockFlow/actions/workflows/ci.yml)

StockFlow is an individual MERN capstone application for modern inventory and sales management. It provides role-based access control (Admin and Employee), real-time stock level monitoring, sales tracking with atomic inventory decrementing, and dashboard analytics.

---

## Tech Stack

- **Backend**: Node.js, Express 5, MongoDB / Mongoose, JWT authentication, bcrypt, Joi validation
- **Frontend**: React 19, Vite, Redux Toolkit, React Router 7, Axios
- **DevOps & CI/CD**: Docker (multi-stage builds), Docker Compose, GitHub Actions
- **Testing**: Jest, Supertest, Vitest, ESLint

---

## Quick Start with Docker Compose

To boot the entire full-stack application (MongoDB, API server, and React web client) with a single command from a clean clone:

```bash
# Clone the repository
git clone https://github.com/Mounir-Ghafir/StockFlow.git
cd StockFlow

# Start the stack (detached mode)
docker compose up --build -d
```

Once running:
- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000) (Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health))
- **MongoDB**: `localhost:27017`

To stop the containers:
```bash
docker compose down
```

To stop and remove data volumes:
```bash
docker compose down -v
```

## Environment Variables

To run this project locally or in production, you will need to configure the following environment variables. Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stockflow
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
```
*(A template is provided in `server/.env.example`)*

---

## Local Development Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env with your local settings
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

---

## API Documentation

The complete REST API endpoint map (including methods, routes, access levels, and purpose) is documented in our planning phase. 
👉 **[View the API Endpoint Map](docs/phase-1-planning.md#6-rest-api-endpoint-map)**

---

## Deployment Guide

To deploy StockFlow to a production environment from a clean clone, follow these steps:

1. **Database:** Provision a MongoDB cluster (e.g., MongoDB Atlas) and get the connection string.
2. **Backend (Render / Railway):**
   - Connect your GitHub repository to the hosting service.
   - Set the Root Directory to `server`.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`.
3. **Frontend (Vercel / Netlify):**
   - Connect your GitHub repository.
   - Set the Root Directory to `client`.
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Set Environment Variables: `VITE_API_URL` pointing to your deployed backend URL.

---

## Running Tests & Quality Checks

### Backend Tests & Linting
```bash
# From server directory or monorepo root
npm --prefix server run lint
npm --prefix server test
```

### Frontend Tests, Linting & Build
```bash
# From client directory or monorepo root
npm --prefix client run lint
npm --prefix client test
npm --prefix client run build
```

---

## CI/CD Pipeline

The project includes an automated GitHub Actions workflow (`.github/workflows/ci.yml`) that executes on every push and pull request to `main`:
1. **Server Job**: Spins up a MongoDB 7 service container, installs dependencies, runs ESLint, and executes all Jest/Supertest integration suites.
2. **Client Job**: Installs dependencies, runs ESLint, executes Vitest unit tests, and verifies the production build.

---

## Project Documentation

- [Project brief](project_brief.md)
- [Development roadmap](project_plan.md)
- [Detailed specifications](erp-project-specifications.docx)
- [Phase 1 planning](docs/phase-1-planning.md)
- [Task board](docs/task-board.md)

## Repository Layout

- `server/` - Express API, Mongoose models, routes, services, middleware, and tests
- `client/` - React application, Redux slices, components, pages, and tests
- `docker-compose.yml` - Root orchestration for MongoDB, API, and Client
- `.github/workflows/` - CI/CD pipeline definitions
