# StockFlow — Full-Stack Development Roadmap
### Inventory & Sales Management System (MERN Stack Capstone)

## How to Use This Roadmap
- Check off each item as you complete it — treat this file as your single source of truth for progress.
- Phases are mostly sequential, but **Phase 6 (Frontend Setup)** can start as soon as your API Endpoint Map is finalized in Phase 1 — mock the responses until the real endpoints exist.
- Don't defer **Phase 9 (Testing)** to "later." Write tests as you finish each resource in Phases 4–5, not all at once at the end.
- Commit to Git after every completed checklist item, not just at the end of a phase.

---

## Phase 0: Environment & Tooling Setup
- [x] Install Node.js LTS (v20+) — verify with `node -v` and `npm -v`
- [x] Install Git and create a GitHub repository (monorepo, not two separate repos)
- [x] Add a root `.gitignore` (`node_modules/`, `.env`, `dist/`, `build/`, `*.log`)
- [x] Create a free MongoDB Atlas cluster (or install MongoDB Community locally for dev)
- [x] Install Docker Desktop (needed later in Phase 10)
- [x] Set up your editor (VS Code recommended) with ESLint, Prettier, and an API client extension (Thunder Client, REST Client, or Postman)
- [x] Create the root folder layout: `server/`, `client/`, and a root `README.md`

**Best practice:** Use one repo with `server/` and `client/` as top-level folders. A single `docker-compose.yml` at the root can then boot the whole stack — much simpler to manage solo than two repos.

---

## Phase 1: Planning & Architecture
- [x] Finalize the Specifications Document (problem statement, objectives, primary/secondary features)
- [x] Write out primary user stories for both roles (Admin, Employee)
- [x] Confirm the high-level architecture (3-tier: React ↔ Express ↔ MongoDB, JWT-secured)
- [x] Draw the Use Case Diagram
- [x] Draw the Class Diagram / data model
- [x] Write the full REST API Endpoint Map (method, route, access level, purpose) **before** writing backend code
- [x] Set up a simple task board (GitHub Projects, Trello, or Notion) mirroring this checklist

**Best practice:** Don't skip straight to coding to "save time." A data-model mistake caught in week 2 costs far more than getting it right on paper in week 0.

---

## Phase 2: Database Design & Backend Project Setup
- [x] Initialize the backend: `npm init -y` inside `server/`
- [x] Install core deps: `npm i express mongoose dotenv cors helmet morgan jsonwebtoken bcrypt joi`
- [x] Install dev deps: `npm i -D nodemon jest supertest`
- [x] Create the folder structure below
- [x] Set up `.env` and a committed `.env.example` (`PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`)
- [x] Connect to MongoDB via Mongoose in `src/config/db.js`
- [x] Create a minimal `app.js` with a `GET /api/health` route
- [x] Confirm the server boots and connects to the DB before writing any business logic
- [x] Define Mongoose schemas: `User`, `Category`, `Supplier`, `Product`, `Sale`, `PurchaseOrder`
- [x] Add schema-level validation (`required`, `min`, `enum` for `role`/`status` fields)
- [x] Add indexes where useful (unique index on `Product.sku`, `User.email`)

```
server/
├── src/
│   ├── config/         # db connection, env loading
│   ├── models/         # Mongoose schemas
│   ├── routes/         # one router per resource
│   ├── controllers/    # request handlers
│   ├── services/       # business logic (e.g. stock adjustment)
│   ├── middleware/     # auth.js, roleCheck.js, validate.js, errorHandler.js
│   ├── validators/     # Joi schemas
│   └── app.js
├── tests/
├── Dockerfile
├── .env.example
└── package.json
```

**Best practice:** Write your Mongoose schemas to match your Class Diagram exactly. If they drift apart, the diagram stops being useful documentation.

**Essential libraries:** `helmet` (secure HTTP headers), `cors` (control cross-origin access), `morgan` (request logging in dev), `dotenv` (env config) — small additions that meaningfully harden a first backend.

---

## Phase 3: Backend — Authentication & Authorization
- [x] Build `POST /api/auth/register` (hash password with bcrypt before saving)
- [x] Build `POST /api/auth/login` (compare password, issue JWT)
- [x] Build `GET /api/auth/me` (return current user from the token)
- [x] Write `auth.js` middleware to verify the JWT and attach `req.user`
- [x] Write `roleCheck.js` middleware for admin-only routes
- [x] Write a centralized `errorHandler.js` middleware so every error returns a consistent JSON shape
- [x] Write Joi validation schemas for register/login payloads
- [x] Test the full auth flow manually with your API client before moving on

**Best practice:** Never hardcode passwords or JWT secrets — always via `.env`, and never commit `.env` to Git. Rotate `JWT_SECRET` between dev and production.

---

## Phase 4: Backend — Core CRUD Resources
- [x] Build full CRUD for Categories (`GET/POST/PUT/DELETE /api/categories`)
- [x] Build full CRUD for Suppliers
- [x] Build full CRUD for Products, populating `category` and `supplier` references
- [x] Add Joi validation schemas for each resource
- [x] Add pagination and basic search/filter to `GET /api/products`
- [x] Write a Jest unit test for at least one pure service function
- [x] Write Supertest integration tests for each resource's CRUD endpoints
**
---

## Phase 5: Backend — Sales & Purchase Order Logic
- [x] Build `POST /api/sales` — validate stock availability, then decrement `Product.quantityInStock`
- [x] Build `GET /api/sales` and `GET /api/sales/:id`, scoped by role (Employee sees own, Admin sees all)
- [x] Build `GET /api/dashboard/summary` — stock value, low-stock count, recent sales total
- [x] *(Secondary)* Build Purchase Order endpoints, including a "receive" action that increments stock
- [x] Write an integration test confirming stock decrements correctly on sale creation
- [x] Write a test confirming a sale is rejected when requested quantity exceeds stock

**Best practice:** Use an atomic `$inc` update (or a MongoDB transaction) when adjusting stock, so two concurrent sales can't oversell the same item.

---

## Phase 6: Frontend — Project Setup & Foundation
- [x] Initialize the frontend: `npm create vite@latest client -- --template react`
- [x] Install deps: `npm i react-router-dom axios @reduxjs/toolkit react-redux`
- [x] Create the folder structure below
- [x] Configure the Redux store and an `authSlice`
- [x] Create one Axios instance with a request interceptor (attach JWT) and response interceptor (handle 401 → logout)
- [x] Build the routing skeleton, including a `ProtectedRoute` component
- [x] Build Login and Register pages wired to the real auth API

```
client/
├── src/
│   ├── api/           # axios instance + endpoint functions
│   ├── app/            # Redux store setup
│   ├── features/       # auth/, products/, sales/, dashboard/ (slice + components)
│   ├── components/     # shared, reusable UI components
│   ├── pages/          # route-level pages
│   ├── routes/         # AppRouter.jsx, ProtectedRoute.jsx
│   └── main.jsx
├── Dockerfile
└── package.json
```

**Best practice:** Keep one Redux slice per feature (`authSlice`, `productsSlice`, `salesSlice`) instead of one giant global slice — it keeps state changes traceable and debuggable.

---

## Phase 7: Frontend — Feature Screens
- [x] Build the Product list page (table, search, low-stock indicator)
- [x] Build Product create/edit forms (Admin only) with client-side validation
- [x] Build Category & Supplier management screens (Admin only)
- [x] Build the "New Sale" screen (product picker, quantity, running total, submit)
- [x] Build the Sales History screen (role-aware view)
- [x] Build the Dashboard screen (stock value, low-stock list, recent sales)
- [x] *(Secondary)* Build Purchase Order screens
- [x] Add loading, empty, and error states to every data-fetching screen

---

## Phase 8: Full-Stack Integration
- [x] Connect every frontend screen to its real API endpoint (remove any mock data)
- [x] Verify role-based UI: Employee shouldn't see Admin-only nav links at all, not just get blocked server-side
- [x] Test the full JWT lifecycle: login → token stored → attached to requests → expired/invalid token → redirect to login
- [x] Cross-check every user story from your specs doc against the running app, one by one
- [x] Fix CORS configuration between the frontend and backend origins

---

## Phase 9: Testing & Quality Pass
- [ ] Run the full Jest/Supertest suite and confirm everything passes
- [ ] Manually walk through every primary user story end-to-end in the browser
- [ ] Test edge cases: empty product list, zero stock, invalid login, expired token, non-admin hitting an admin route
- [ ] Run ESLint across both `client/` and `server/` and resolve warnings
- [ ] Do a consistency pass on error messages and loading states across all screens

---

## Phase 10: Containerization & CI/CD
- [ ] Write a `Dockerfile` for the backend (multi-stage: install deps → copy source → run)
- [ ] Write a root `docker-compose.yml` wiring the API and MongoDB together
- [ ] Confirm `docker compose up` boots the whole stack from a clean clone
- [ ] Write a GitHub Actions workflow: install deps → lint → run Jest/Supertest on every push/PR
- [ ] Add a build-status badge to your README

---

## Phase 11: Deployment
- [ ] Provision a production MongoDB Atlas cluster, separate from your local dev database
- [ ] Deploy the backend (Render or Railway), setting all required environment variables
- [ ] Deploy the frontend (Vercel), pointing its API base URL at the deployed backend
- [ ] Smoke-test the live deployment: register, login, create a product, record a sale
- [ ] Confirm HTTPS is enforced and CORS only allows your deployed frontend origin in production

---

## Phase 12: Documentation & Defense Prep
- [ ] Write the README: overview, tech stack, setup steps, environment variables, how to run tests, how to run via Docker
- [ ] Document every API endpoint (or link to your API Endpoint Map)
- [ ] Write a short deployment guide (steps to redeploy from a clean clone)
- [ ] Prepare a 10-minute demo script covering your primary user stories
- [ ] Be ready to justify every architectural decision out loud (why Redux Toolkit, why this folder structure, why JWT over sessions)
- [ ] Practice the live practical scenario: rehearse adding a small feature or fixing a bug under time pressure
