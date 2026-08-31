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

---

## Local Development Setup

### 1. Backend

```bash
cd server
cp .env.example .env
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
