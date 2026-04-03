# BlogSphere — Blog Website with Authentication & Role-Based Access

<div align="center">

![BlogSphere](https://img.shields.io/badge/BlogSphere-Full%20Stack%20Blog-6366F1?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> **Software Engineering Internship Task**
> A full-stack blog platform with JWT authentication, role-based access control, and a clean modern UI.
> Built with **Node.js/Express** (backend) and **Next.js** (frontend).

</div>

---

## 📸 Project Demo

### 1. Home / Landing Page
> Public landing page — shows different call-to-action buttons based on login state.

<img width="1920" height="870" alt="Home Page" src="https://github.com/user-attachments/assets/c8d964fc-03cf-445f-ac1a-ebf9fb7fdeb8" />

---

### 2. Register & Login
> Clean authentication forms with live password strength hints and show/hide password toggle.

<div align="center">

| Register | Login |
|:---:|:---:|
| <img width="648" height="687" alt="Register Page" src="https://github.com/user-attachments/assets/61df6591-2a82-4e3e-85e2-18cb9af367a5" /> | <img width="594" height="573" alt="Login Page" src="https://github.com/user-attachments/assets/a4c59466-611b-4b1e-a771-975edfa7c52a" /> |

</div>

---

### 3. User Dashboard
> Protected page — shows the logged-in user's own posts with stat counters (total, published, drafts, views).

<img width="1902" height="869" alt="User Dashboard" src="https://github.com/user-attachments/assets/878a7bdb-1fd8-41ca-be16-4e3d062b3df7" />

---

### 4. Create Post
> Protected form with title, content editor, word count, and draft/publish toggle.

<img width="1920" height="862" alt="Create Post" src="https://github.com/user-attachments/assets/55795f0e-e5b9-4cae-92c0-fe2cd22f7dfe" />

---

### 5. Single Post View
> Public post reader showing author, date, view count, and owner-only Edit/Delete actions.

<img width="1920" height="865" alt="Single Post View" src="https://github.com/user-attachments/assets/12c08a1b-ef5a-4a92-a35e-224960ef2912" />

---

### 6. Public Blog Listing
> Paginated grid of all published posts — accessible without login.

<img width="1900" height="843" alt="Public Blog Listing" src="https://github.com/user-attachments/assets/2d251784-3b85-41db-ac4d-ade69f4a1efe" />

---

### 7. Admin Dashboard
> Admin role sees the same user dashboard plus access to the Admin Panel link in the navbar.

<img width="1920" height="880" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/07810c52-5a65-4579-97ed-24acf88f4ba2" />

---

### 8. Admin Panel — All Posts
> Admin-only view of every post on the platform (including other users' drafts) with pagination.

<img width="1898" height="868" alt="Admin Panel All Posts" src="https://github.com/user-attachments/assets/82af0ba3-c250-4f7a-9389-546c0a578fa2" />

---

### 9. Admin — Delete Any User's Post
> Admin can delete any post regardless of who wrote it. Enforced on the backend, not just the UI.

<img width="1920" height="874" alt="Admin Delete Post" src="https://github.com/user-attachments/assets/f38618a8-eb5a-4763-be6e-2c34e327c95e" />

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Database Design](#-database-design)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authentication Implementation](#-authentication-implementation)
- [Role-Based Access Control](#-role-based-access-control)
- [Frontend Pages](#-frontend-pages)
- [Bonus Features Implemented](#-bonus-features-implemented)
- [Design Decisions & Assumptions](#-design-decisions--assumptions)

---

## 🔍 Project Overview

BlogSphere is a full-stack blog application where users can register, log in, and manage their own posts. The platform enforces two roles — **User** and **Admin** — with all permission checks applied on both the frontend (UX) and backend (security).

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Web framework and REST API server |
| PostgreSQL | Relational database |
| `pg` (node-postgres) | PostgreSQL client for Node.js |
| `bcrypt` | Secure password hashing |
| `jsonwebtoken` | JWT access & refresh token generation |
| `zod` | Request body validation schemas |
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

## ✅ Features

### Authentication
- ✅ User registration with hashed passwords (bcrypt, 10 salt rounds)
- ✅ Login returns JWT access token + httpOnly refresh token cookie
- ✅ Refresh token rotation — old token deleted, new one issued on every refresh
- ✅ Logout clears the refresh token from the database
- ✅ Access tokens are short-lived; refresh tokens expire in 7 days

### Role-Based Access
- ✅ Two roles: `user` and `admin` stored in the `users` table
- ✅ New registrations are always assigned the `user` role (enforced by backend Zod validator)
- ✅ Admin role must be assigned manually in the database
- ✅ All permission checks are enforced server-side — not just hidden on the frontend

### Blog / Posts (CRUD)
- ✅ Create a post (authenticated users only)
- ✅ View all published posts (public — no login required)
- ✅ View a single post (public) — increments view count on each visit
- ✅ Edit own post (post owner only)
- ✅ Delete own post (post owner only)
- ✅ Admin can delete **any** post on the platform
- ✅ Admin can view **all** posts including drafts with pagination
- ✅ Posts support `draft` and `published` status

### Frontend UI
- ✅ Separate dashboards for User and Admin roles
- ✅ Navbar shows role-aware links (Admin panel link only visible to admins)
- ✅ All protected pages redirect unauthenticated users to `/login`
- ✅ Admin pages redirect non-admin users to `/dashboard`
- ✅ Post cards show Edit/Delete buttons only to authorised users

---

## 🗄 Database Design

Four tables with proper foreign keys, constraints, and indexes.

```sql
-- Users table
users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,           -- bcrypt hashed
  role        VARCHAR(10)  NOT NULL DEFAULT 'user'
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
  status       VARCHAR(10)  NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'published')),
  views_count  INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
)

-- Comments table (bonus feature — schema ready)
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

**Indexes for performance:**
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
- One `user` → many `refresh_tokens` (all invalidated on logout)

---

## 📁 Project Structure

```
root/
├── README.md
├── blogAPI.json                         # Postman collection
│
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
│       │   ├── validate.middleware.js   # Zod request validation
│       │   ├── errorHandlers.js         # Global error handler
│       │   └── notFound.js              # 404 handler
│       ├── validators/
│       │   ├── auth.validator.js        # Zod schemas for register/login
│       │   └── post.validator.js        # Zod schemas for create/update post
│       └── utils/
│           ├── AppError.js              # Custom operational error class
│           └── jwt.utils.js             # sign/verify access & refresh tokens
│
└── frontend/
    ├── app/
    │   ├── layout.js                    # Root layout — wraps every page
    │   ├── globals.css                  # Design system and CSS variables
    │   ├── page.js                      # Home / landing page
    │   ├── login/page.js                # Login form
    │   ├── register/page.js             # Registration form
    │   ├── dashboard/page.js            # User dashboard (protected)
    │   ├── admin/page.js                # Admin panel (admin role only)
    │   └── posts/
    │       ├── page.js                  # Public blog listing
    │       ├── create/page.js           # Create post (protected)
    │       └── [id]/
    │           ├── page.js              # Single post view
    │           └── edit/page.js         # Edit post (protected, owner only)
    ├── components/
    │   ├── Providers.js                 # NextAuth SessionProvider wrapper
    │   ├── auth/
    │   │   └── ProtectedRoute.js        # Reusable auth guard component
    │   └── ui/
    │       ├── Navbar.js                # Role-aware navigation bar
    │       └── PostCard.js              # Reusable post card component
    ├── lib/
    │   └── axios.js                     # Axios instance with auth interceptor
    └── app/api/auth/[...nextauth]/
        ├── options.js                   # NextAuth configuration
        └── route.js                     # NextAuth route handler
```

---

## ⚙️ Setup Instructions

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

Create a `.env` file in the `Backend/` folder — see [Environment Variables](#-environment-variables) below.

Run the database migration to create all tables and indexes:

```bash
npm run migrate
```

Start the server:

```bash
# Development — auto-restarts on file change (nodemon)
npm run dev

# Production
npm start
```

> The backend runs on `http://localhost:3000` by default.

---

### 3. Create an Admin User

Register a user normally through the frontend or Postman, then promote them to admin directly in PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder — see [Environment Variables](#-environment-variables) below.

Start the frontend:

```bash
npm run dev
```

> The frontend runs on `http://localhost:3001` by default.

---

## 🔐 Environment Variables

### Backend — `Backend/.env`

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/blogsphere
JWT_ACCESS_SECRET=your_long_random_access_secret_here
JWT_REFRESH_SECRET=your_long_random_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:3001
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port for the Express server |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens (use a long random string) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens (must differ from access secret) |
| `JWT_ACCESS_EXPIRES` | Access token lifetime — e.g. `15m`, `1h` |
| `JWT_REFRESH_EXPIRES` | Refresh token lifetime — e.g. `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS |

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full base URL of the backend API |
| `NEXTAUTH_URL` | URL where the Next.js frontend is running |
| `NEXTAUTH_SECRET` | Secret for signing NextAuth session cookies |

---

## 📡 API Endpoints

### Base URL: `/api/v1`

#### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Returns server status and timestamp |

#### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register a new user |
| POST | `/auth/login` | None | Login and receive access + refresh tokens |
| POST | `/auth/refresh` | Cookie | Rotate refresh token and get new access token |
| POST | `/auth/logout` | Cookie | Invalidate refresh token and clear cookie |

<details>
<summary><b>Register — request body</b></summary>

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password123"
}
```
</details>

<details>
<summary><b>Login — request & response</b></summary>

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGci..."
  }
}
```
</details>

#### Posts

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/posts` | None | Public | Get all published posts (paginated) |
| GET | `/posts/:id` | None | Public | Get single post + increment view count |
| POST | `/posts` | Bearer | User / Admin | Create a new post |
| PUT | `/posts/:id` | Bearer | Owner only | Update own post |
| DELETE | `/posts/:id` | Bearer | Owner or Admin | Delete a post |
| GET | `/posts/user/my-posts` | Bearer | User / Admin | Get current user's own posts |
| GET | `/posts/admin/all` | Bearer | Admin only | Get all posts with pagination |

> **Pagination:** append `?page=1&limit=10` to paginated endpoints.

<details>
<summary><b>Create / Update post — request body</b></summary>

```json
{
  "title": "My First Blog Post",
  "content": "This is the full content of my post.",
  "status": "published"
}
```
</details>

<details>
<summary><b>Post object — response shape</b></summary>

```json
{
  "status": "success",
  "data": {
    "post": {
      "id": "uuid",
      "title": "My First Blog Post",
      "content": "This is the full content...",
      "status": "published",
      "author_id": "uuid",
      "author_name": "Jane Smith",
      "views_count": 12,
      "published_at": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  }
}
```
</details>

---

## 🔑 Authentication Implementation

### How it works — step by step

**1. Registration**
The password is hashed with `bcrypt` (10 salt rounds) before saving. The plain-text password is never stored.

**2. Login**
`bcrypt.compare()` checks the submitted password against the stored hash. On success, two tokens are issued:

- **Access Token** — Short-lived JWT (default 15 min), sent in the response body. Payload: `{ id, email, role }`.
- **Refresh Token** — Long-lived JWT (default 7 days), saved to the `refresh_tokens` table and sent as an `httpOnly` cookie that JavaScript cannot read.

**3. Authenticated Requests**
The Axios interceptor on the frontend reads the access token from the NextAuth session and attaches it as `Authorization: Bearer <token>` on every request. The `protect` middleware on the backend verifies this token on every protected route.

**4. Token Refresh**
When the access token expires, `POST /auth/refresh` is called. The backend reads the cookie, verifies the token exists in the database, **deletes it** (rotation), and issues a fresh pair.

**5. Logout**
The refresh token is deleted from the database. Any future refresh attempts with that token return a 401.

### Token rotation security

Each refresh token is single-use. If an attacker steals a token and uses it, the real user's next refresh will fail because their token was already consumed — indicating a breach.

### Where tokens are stored

| Token | Storage | Why |
|---|---|---|
| Access token | NextAuth session (in-memory) | Not in `localStorage` — protects against XSS |
| Refresh token | `httpOnly` cookie | JavaScript cannot access it — protects against XSS |
| Refresh token (server side) | PostgreSQL `refresh_tokens` table | Enables true logout and rotation |

---

## 🛡 Role-Based Access Control

### Roles & Permissions

| Role | Create Post | Edit Own | Delete Own | Delete Any | View All Posts |
|---|:---:|:---:|:---:|:---:|:---:|
| `user` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ✅ | ✅ |

### Backend enforcement (primary security layer)

Two reusable middleware functions are chained on routes that need protection:

```
protect middleware    →  verifies JWT is valid, attaches req.user
restrictTo('admin')  →  checks req.user.role === 'admin', rejects with 403 if not
```

**Admin-only route example:**
```
GET /posts/admin/all
  → protect()            verifies token
  → restrictTo('admin')  verifies role
  → adminGetAllPosts()   runs only if both checks pass
```

**Mixed-permission delete (owner or admin) in the service layer:**
```javascript
// post.service.js
if (post.author_id !== userId && userRole !== 'admin') {
  throw new AppError('You do not have permission to delete this post', 403);
}
```

### Frontend enforcement (UX layer only)

> ⚠️ Frontend checks improve the user experience but are NOT the security boundary. The backend always re-validates.

- `<ProtectedRoute>` — redirects unauthenticated users to `/login`
- `<ProtectedRoute requiredRole="admin">` — redirects non-admins to `/dashboard`
- Navbar links are conditionally rendered based on `session.user.role`
- Edit / Delete buttons on PostCard only render for the post owner or an admin

---

## 🖥 Frontend Pages

| Route | Page | Access Level |
|---|---|---|
| `/` | Home / Landing | Public |
| `/login` | Login form | Public |
| `/register` | Registration form | Public |
| `/posts` | Public blog listing with pagination | Public |
| `/posts/:id` | Read a single post | Public |
| `/dashboard` | User's own posts + stat counters | Authenticated users |
| `/posts/create` | Write a new post | Authenticated users |
| `/posts/:id/edit` | Edit an existing post | Post owner only |
| `/admin` | All posts with full delete control | Admin role only |

---

## 🎁 Bonus Features Implemented

- ✅ **Pagination** — public posts and admin endpoint both support `?page=X&limit=Y` with `totalPages`, `hasNext`, `hasPrev` in the response
- ✅ **Comments table** — database schema includes a fully relational `comments` table, ready for feature extension
- ✅ **Reusable RBAC middleware** — `protect` and `restrictTo(...roles)` can be applied to any route in one line
- ✅ **Security headers** — `helmet` sets `X-Content-Type-Options`, `X-Frame-Options`, CSP, and other headers automatically
- ✅ **Request size limit** — Express body parser capped at `10kb` to prevent large payload attacks
- ✅ **Async view counter** — `views_count` increments using fire-and-forget so it never slows the response
- ✅ **Input validation** — all request bodies validated with Zod schemas before reaching any controller
- ✅ **Layered architecture** — routes → controllers → services → repositories keeps SQL isolated from business logic

---

## 💡 Design Decisions & Assumptions

**1. Layered backend architecture (Controller → Service → Repository)**
SQL queries are isolated in repository files. Services contain business logic. Controllers only handle HTTP input/output. Each layer is independently testable and maintainable.

**2. Refresh tokens stored in the database**
Unlike a pure stateless JWT approach, refresh tokens are persisted. This enables true logout (delete the token = no future refresh possible) and token rotation. The trade-off is one extra DB query per refresh cycle.

**3. Role assignment is admin-only**
The Zod register schema enforces `z.enum(['user']).default('user')` — it is impossible to self-assign the admin role via the API. Promotion must happen directly via SQL.

**4. Reusable `ProtectedRoute` component**
Instead of duplicating redirect logic across every protected page, a single wrapper component handles all auth and role checks. Pages simply declare their requirement: `<ProtectedRoute>` for any logged-in user, `<ProtectedRoute requiredRole="admin">` for admin-only access.

**5. Optimistic UI for deletes**
After a successful delete API response, the item is removed from local React state immediately rather than re-fetching from the server. This gives instant feedback and reduces unnecessary network requests.

**6. NextAuth manages the token lifecycle on the frontend**
NextAuth's `credentials` provider calls the backend login endpoint. The `jwt` callback stores `accessToken` and `role` in the encrypted session. The Axios interceptor then reads this session and attaches the token to every API call automatically.

**7. Password validation on both layers**
Backend (authoritative): Zod enforces min 8 characters, one uppercase, one lowercase, one number.
Frontend (UX): Live password strength hints give the user immediate feedback as they type without waiting for a server response.

---

## 📬 Testing with Postman

A Postman collection file `blogAPI.json` is included at the root of the repository.

1. Open Postman → **Import** → select `blogAPI.json`
2. Set the collection variable `base_url` to `http://localhost:3000/api/v1`
3. Run **Register** first, then **Login (User)** to get an access token
4. Copy the `accessToken` value into the `token` collection variable
5. Run **Login (Admin)** and copy its token into the `admin_token` variable
6. All other requests will use these tokens automatically via the Authorization header

---


