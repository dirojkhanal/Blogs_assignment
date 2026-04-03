# BlogSphere — Blog Website with Authentication & Role-Based Access

> Software Engineering Internship Task  
> Full-stack blog platform built with **Node.js/Express** (backend) and **Next.js** (frontend)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication Implementation](#authentication-implementation)
- [Role-Based Access Control](#role-based-access-control)
- [Frontend Pages](#frontend-pages)
- [Bonus Features Implemented](#bonus-features-implemented)
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## Project Overview

BlogSphere is a full-stack blog application where users can register, log in, and manage their own posts. The platform has two roles — **User** and **Admin** — each with different permissions enforced on both the frontend and backend.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Web framework and REST API server |
| PostgreSQL | Relational database |
| `pg` (node-postgres) | PostgreSQL client for Node.js |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT access & refresh token generation |
| `zod` | Request body validation |
| `helmet` | HTTP security headers |
| `cors` | Cross-Origin Resource Sharing |
| `morgan` | HTTP request logging |
| `dotenv` | Environment variable management |
| `express-async-errors` | Async error handling without try/catch everywhere |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework with file-based routing |
| NextAuth v4 | Session management and credentials authentication |
| Axios | HTTP client with automatic token attachment |
| Tailwind CSS | Utility-first CSS reset + custom design system |
| Lucide React | SVG icon library |

---

## Features

### Authentication
- ✅ User registration with hashed passwords (bcrypt, 10 salt rounds)
- ✅ Login returns JWT access token + httpOnly refresh token cookie
- ✅ Refresh token rotation — old token deleted, new one issued
- ✅ Logout clears the refresh token from the database
- ✅ Access tokens are short-lived; refresh tokens expire in 7 days

### Role-Based Access
- ✅ Two roles: `user` and `admin` stored in the `users` table
- ✅ New registrations are always assigned `user` role (enforced by backend validator)
- ✅ Admin role must be assigned manually in the database
- ✅ All permission checks are enforced server-side, not just hidden on frontend

### Blog / Posts (CRUD)
- ✅ Create a post (authenticated users only)
- ✅ View all published posts (public — no login required)
- ✅ View a single post (public) — increments view count
- ✅ Edit own post (owner only)
- ✅ Delete own post (owner only)
- ✅ Admin can delete any post
- ✅ Admin can view all posts (including drafts) with pagination
- ✅ Posts support `draft` and `published` status

### Frontend UI
- ✅ Different dashboards for User and Admin
- ✅ Navbar shows role-aware links (Admin panel only visible to admins)
- ✅ All protected pages redirect unauthenticated users to `/login`
- ✅ Admin pages redirect non-admin users to `/dashboard`
- ✅ Post cards show Edit/Delete buttons only to authorised users

---

## Database Design

Four tables with proper foreign keys and indexes.

```sql
-- Users table
users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,           -- bcrypt hashed
  role        VARCHAR(10) DEFAULT 'user'       -- CHECK: 'user' | 'admin'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
)

-- Posts table
posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(500) NOT NULL,
  content      TEXT NOT NULL,
  status       VARCHAR(10) DEFAULT 'draft'     -- CHECK: 'draft' | 'published'
               CHECK (status IN ('draft', 'published')),
  views_count  INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
)

-- Comments table
comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Refresh tokens table
refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Indexes created:**
```sql
CREATE INDEX idx_posts_author  ON posts(author_id);
CREATE INDEX idx_posts_status  ON posts(status);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_refresh_user  ON refresh_tokens(user_id);
```

### Relationships
- One `user` → many `posts` (one-to-many)
- One `post` → many `comments` (one-to-many)
- One `user` → many `comments` (one-to-many)
- One `user` → many `refresh_tokens` (one-to-many, all invalidated on logout)

---

## Project Structure

```
root/
├── Backend/
│   ├── server.js                        # Entry point — starts the server
│   ├── package.json
│   ├── .env                             # Environment variables (not committed)
│   └── src/
│       ├── app.js                       # Express app setup, middleware, routes
│       ├── config/
│       │   └── env.js                   # Validates and exports env variables
│       ├── db/
│       │   ├── index.js                 # PostgreSQL connection pool
│       │   ├── migrate.js               # Runs SQL migrations
│       │   └── migrations/
│       │       └── sqlSchema.sql        # Full DB schema
│       ├── controllers/
│       │   ├── auth.controller.js       # register, login, refresh, logout
│       │   └── post.controller.js       # CRUD + admin endpoints
│       ├── services/
│       │   ├── auth.service.js          # Business logic for auth
│       │   └── post.service.js          # Business logic for posts
│       ├── repositories/
│       │   ├── auth.repository.js       # Raw SQL queries for users/tokens
│       │   └── post.repository.js       # Raw SQL queries for posts
│       ├── routes/
│       │   ├── auth.routes.js           # /api/v1/auth/*
│       │   └── post.routes.js           # /api/v1/posts/*
│       ├── middlewares/
│       │   ├── auth.middleware.js       # protect + restrictTo
│       │   ├── validate.middleware.js   # Zod validation middleware
│       │   ├── errorHandlers.js         # Global error handler
│       │   └── notFound.js             # 404 handler
│       ├── validators/
│       │   ├── auth.validator.js        # Zod schemas for register/login
│       │   └── post.validator.js        # Zod schemas for create/update post
│       └── utils/
│           ├── AppError.js              # Custom error class
│           └── jwt.utils.js             # sign/verify access & refresh tokens
│
├── frontend/
│   ├── app/
│   │   ├── layout.js                    # Root layout — wraps every page
│   │   ├── globals.css                  # Design system and CSS variables
│   │   ├── page.js                      # Home / landing page
│   │   ├── login/page.js                # Login form
│   │   ├── register/page.js             # Registration form
│   │   ├── dashboard/page.js            # User dashboard (protected)
│   │   ├── admin/page.js                # Admin panel (admin role only)
│   │   └── posts/
│   │       ├── page.js                  # Public blog listing
│   │       ├── create/page.js           # Create post (protected)
│   │       └── [id]/
│   │           ├── page.js              # Single post view
│   │           └── edit/page.js         # Edit post (protected)
│   ├── components/
│   │   ├── Providers.js                 # NextAuth SessionProvider wrapper
│   │   ├── auth/
│   │   │   └── ProtectedRoute.js        # Auth guard component
│   │   └── ui/
│   │       ├── Navbar.js                # Navigation bar
│   │       └── PostCard.js              # Reusable post card component
│   ├── lib/
│   │   └── axios.js                     # Axios instance with auth interceptor
│   └── app/api/auth/[...nextauth]/
│       ├── options.js                   # NextAuth configuration
│       └── route.js                     # NextAuth route handler
│
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 14 or higher
- npm or yarn

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory (see [Environment Variables](#environment-variables) below).

Run the database migration to create all tables:

```bash
npm run migrate
```

Start the backend server:

```bash
# Development (with nodemon auto-restart)
npm run dev

# Production
npm start
```

The backend will run on `http://localhost:PORT` (default 3000).

---

### 3. Create an Admin User

After running the migration, register a normal user through the API or frontend, then manually promote them to admin in PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory (see [Environment Variables](#environment-variables) below).

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:3001` (or Next.js default `3000` if backend is on a different port).

---

## Environment Variables

### Backend — `Backend/.env`

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/blogsphere
JWT_ACCESS_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:3001
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the Express server listens on |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret key for signing access tokens (use a long random string) |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens (different from access secret) |
| `JWT_ACCESS_EXPIRES` | Access token lifetime (e.g. `15m`, `1h`) |
| `JWT_REFRESH_EXPIRES` | Refresh token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full base URL of the backend API |
| `NEXTAUTH_URL` | The URL where the Next.js app runs |
| `NEXTAUTH_SECRET` | Secret used by NextAuth to sign session cookies |

---

## API Endpoints

### Base URL: `/api/v1`

#### Health Check
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Server health check |

#### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register a new user |
| POST | `/auth/login` | None | Login and receive tokens |
| POST | `/auth/refresh` | Cookie | Refresh access token |
| POST | `/auth/logout` | Cookie | Logout and invalidate refresh token |

**Register request body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password123"
}
```

**Login request body:**
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

**Login / Register response:**
```json
{
  "status": "success",
  "data": {
    "user": { "id": "uuid", "name": "Jane Smith", "email": "jane@example.com", "role": "user" },
    "accessToken": "eyJhbGci..."
  }
}
```

#### Posts
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/posts` | None | Any | Get all published posts (paginated) |
| GET | `/posts/:id` | None | Any | Get single post by ID |
| POST | `/posts` | Bearer token | User/Admin | Create a new post |
| PUT | `/posts/:id` | Bearer token | Owner | Update own post |
| DELETE | `/posts/:id` | Bearer token | Owner or Admin | Delete a post |
| GET | `/posts/user/my-posts` | Bearer token | User/Admin | Get own posts |
| GET | `/posts/admin/all` | Bearer token | Admin only | Get all posts (paginated) |

**Pagination query parameters:** `?page=1&limit=10`

**Create / Update post request body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my post.",
  "status": "published"
}
```

**Post response:**
```json
{
  "status": "success",
  "data": {
    "post": {
      "id": "uuid",
      "title": "My First Blog Post",
      "content": "This is the content...",
      "status": "published",
      "author_id": "uuid",
      "views_count": 0,
      "published_at": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z"
    }
  }
}
```

---

## Authentication Implementation

### How it works

1. **Registration** — Password is hashed using `bcrypt` with 10 salt rounds before being stored. The plain-text password is never saved.

2. **Login** — Password is compared against the hash using `bcrypt.compare()`. On success, two tokens are issued:
   - **Access Token** — Short-lived JWT (default: 15 minutes), sent in the response body. Contains `{ id, email, role }`.
   - **Refresh Token** — Longer-lived JWT (default: 7 days), stored in the database and sent as an `httpOnly` cookie (not accessible by JavaScript).

3. **Authenticated requests** — The frontend attaches the access token as a `Bearer` token in the `Authorization` header. The `protect` middleware on the backend verifies it on every protected route.

4. **Token refresh** — When the access token expires, the frontend can call `POST /auth/refresh`. The backend reads the refresh token from the cookie, verifies it exists in the database, deletes it (rotation), and issues a new access token and refresh token pair.

5. **Logout** — The refresh token is deleted from the database. Any subsequent refresh attempts with that token will fail.

### Token Rotation Security
Each refresh token can only be used once. After use, it is deleted and a new one is issued. This means if a refresh token is stolen and used by an attacker, the legitimate user's next refresh will fail (their token was already consumed), alerting to the compromise.

### Storing tokens securely
- Access tokens are kept in memory (React state / NextAuth session) — not in `localStorage`
- Refresh tokens are in `httpOnly` cookies — JavaScript cannot read these, protecting against XSS attacks

---

## Role-Based Access Control

### Roles

| Role | Permissions |
|---|---|
| `user` | Create posts · View/edit/delete own posts · View all published posts |
| `admin` | Everything a user can do · View ALL posts (including drafts) · Delete any post |

### How RBAC is enforced

**Backend (primary enforcement):**

```
protect middleware  →  verifies JWT is valid, attaches req.user
restrictTo('admin') →  checks req.user.role === 'admin', rejects if not
```

For example, the admin-only route:
```
GET /posts/admin/all
  → protect()          checks token is valid
  → restrictTo('admin') checks role is admin
  → adminGetAllPosts() runs only if both pass
```

For delete, the service layer handles mixed permissions:
```javascript
// In post.service.js
if (post.author_id !== userId && userRole !== 'admin') {
  throw new AppError('You do not have permission to delete this post', 403);
}
```

**Frontend (UX only — not a security boundary):**

- `ProtectedRoute` component redirects unauthenticated users to `/login`
- `ProtectedRoute requiredRole="admin"` redirects non-admins to `/dashboard`
- Navbar links (Admin Panel, Dashboard) only render for the correct role
- Edit/Delete buttons on PostCard only render for the post owner or admin

---

## Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/` | Home / Landing | Public |
| `/login` | Login form | Public (redirects to /dashboard if already logged in) |
| `/register` | Registration form | Public |
| `/dashboard` | User's own posts + stats | Authenticated users |
| `/admin` | All posts with delete control | Admin role only |
| `/posts` | Public blog listing with pagination | Public |
| `/posts/create` | Write a new post | Authenticated users |
| `/posts/:id` | Read a single post | Public |
| `/posts/:id/edit` | Edit an existing post | Post owner only |

---

## Bonus Features Implemented

- ✅ **Pagination** — both the public posts endpoint and admin endpoint support `?page=X&limit=Y`
- ✅ **Comments table** — database schema and migrations include a comments table (schema ready for extension)
- ✅ **Middleware for role checks** — `protect` and `restrictTo` are reusable Express middleware functions applied per-route
- ✅ **Security middleware** — `helmet` sets secure HTTP headers, CORS is locked to the frontend URL, request body size is limited to 10kb
- ✅ **View counter** — each GET to `/posts/:id` increments `views_count` asynchronously (fire-and-forget so it doesn't slow the response)
- ✅ **Input validation** — all request bodies validated with Zod schemas before reaching controllers
- ✅ **Layered architecture** — routes → controllers → services → repositories, keeping SQL queries isolated from business logic

---

## Design Decisions & Assumptions

**1. Layered backend architecture (Controller → Service → Repository)**
SQL queries are isolated in repository files. Services contain business logic. Controllers only handle HTTP request/response. This makes the codebase easier to test and maintain.

**2. Refresh token stored in the database**
Unlike a pure stateless JWT setup, refresh tokens are saved to the `refresh_tokens` table. This allows true logout (the token is deleted) and enables token rotation for better security. The trade-off is an extra DB query on refresh.

**3. Role assignment is admin-only**
New users can only register as `role: 'user'`. The Zod validator enforces `z.enum(['user'])` on the register endpoint, making it impossible to self-assign admin via the API. Admins must be promoted directly in the database.

**4. Frontend route protection uses a reusable ProtectedRoute component**
Rather than repeating redirect logic in every page, a single `ProtectedRoute` component wraps any page that needs authentication. Passing `requiredRole="admin"` adds role enforcement.

**5. Optimistic UI for deletes**
After successfully deleting a post, the frontend removes it from local state immediately instead of re-fetching from the server. This makes the UI feel faster while the operation is confirmed by the HTTP 200 response.

**6. NextAuth handles the token flow on the frontend**
NextAuth's `credentials` provider calls the backend login endpoint and stores the returned `accessToken` and `role` in the encrypted session cookie. The Axios interceptor reads this session and attaches the token to every API request automatically.

**7. Password validation**
Backend: Zod enforces minimum 8 characters, at least one uppercase, one lowercase, and one number.  
Frontend: Live password strength hints show the same rules as the user types, but the backend is the authoritative validator.

---

## Running with Postman

A Postman collection file `blogAPI.json` is included in the root of the repository. Import it into Postman to test all endpoints. Set the collection variable `base_url` to `http://localhost:PORT/api/v1` before running.

---


