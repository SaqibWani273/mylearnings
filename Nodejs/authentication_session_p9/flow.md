# Flow of this Node.js application endpoint(s) — visual representation

## 1. High-level request lifecycle

```
                ┌─────────────────────────────────────────────────────────┐
   Client       │                    Express App (index.js)                 │
   Request  ──► │                                                           │
                │   express.json()        →  parse JSON body                │
                │        │                                                  │
                │        ▼                                                  │
                │   tokenMiddleware       →  GLOBAL: app.use(tokenMiddleware)
                │   (decode JWT if any,      attaches req.user when token   │
                │    else just next())       is valid; never blocks here)   │
                │        │                                                  │
                │        ▼                                                  │
                │   Router match  ──►  /auth/*   (auth.router.js)           │
                │                 ──►  /admin/*  (admin.router.js)          │
                │                 ──►  /         (welcome message)          │
                │        │                                                  │
                │        ▼                                                  │
                │   Per-route guard middleware (only on protected routes)  │
                │     • ensureAuthMiddleware       → 401 if no req.user     │
                │     • ensureRoleMiddleware(role) → 401/403 by role        │
                │        │                                                  │
                │        ▼                                                  │
                │   Controller  →  Drizzle (db)  →  PostgreSQL             │
                │        │                                                  │
                │        ▼                                                  │
                │   res.status(...).json(...)                              │
                └────────│──────────────────────────────────────────────────┘
                         ▼
                   Response ──► Client
```

> Note: `authMiddleware` (session-id based) exists in `middleware/authmiddleware.js`
> but is currently **commented out** in `index.js`. The active auth strategy is the
> JWT `tokenMiddleware` + per-route guards.

---

## 2. Middleware chain (who runs, in what order)

```
GLOBAL (every request)
  express.json()
        │
        ▼
  tokenMiddleware ─────────────┐
    no Authorization header ───┼──► next()  (req.user stays undefined)
    "Bearer <token>"        ───┼──► jwt.verify → req.user = decodedToken → next()
    bad format              ───┴──► 400 "Invalid authorization format"

PER-ROUTE (only where attached in the router)
  ensureAuthMiddleware
    !req.user ──► 401 "UnAuthenticated User"
    else      ──► next()

  ensureRoleMiddleware(role)        ── wraps ensureAuthMiddleware, then:
    req.user.role !== role ──► 403 "You are not authorized"
    else                   ──► next()

  ensureAdminMiddleware (defined, currently unused in routes)
    role !== "ADMIN" ──► 403 "Admin access only"
```

---

## 3. Endpoint map

### Auth routes — `/auth` (routes/auth.router.js)

| Method | Path             | Guards                | Controller      |
|--------|------------------|-----------------------|-----------------|
| POST   | `/auth/register` | — (public)            | `register`      |
| GET    | `/auth/login`    | — (public)            | `login`         |
| GET    | `/auth/profile`  | `ensureAuthMiddleware`| `profile`       |
| PATCH  | `/auth/update`   | `ensureAuthMiddleware`| `updateProfile` |
| DELETE | `/auth/delete`   | `ensureAuthMiddleware`| `deleteUser`    |

### Admin routes — `/admin` (routes/admin.router.js)

| Method | Path                  | Guards                          | Controller |
|--------|-----------------------|---------------------------------|------------|
| GET    | `/admin/users`        | `ensureRoleMiddleware("ADMIN")` | `getUsers` |
| GET    | `/admin/users/:userId`| `ensureRoleMiddleware("ADMIN")` | `getUsers` |

---

## 4. Per-endpoint flows

### POST /auth/register  (public)
```
Request {email, name, password, isAdmin?}
  ↓ tokenMiddleware (passes through, no user needed)
  ↓ register controller
      validate email/name/password ──► 400 if missing
      check email already exists   ──► 400 if taken
      salt = randomBytes(256)
      hashedPw = HMAC-SHA256(password, salt)
      role = isAdmin ? "ADMIN" : "USER"
      INSERT user (returning id)
  ↓
201 { message, id }
```

### GET /auth/login  (public)
```
Request {email, password}
  ↓ tokenMiddleware (passes through)
  ↓ login controller
      validate email/password     ──► 400 if missing
      SELECT user by email        ──► 400 if not found
      recompute HMAC with stored salt
      compare hashes              ──► 400 "Invalid password"
      token = jwt.sign(user, JWT_SECRET)
  ↓
200 { message, userId, token }
```

### GET /auth/profile  (protected)
```
Request  (Authorization: Bearer <token>)
  ↓ tokenMiddleware     → decodes token → req.user
  ↓ ensureAuthMiddleware → 401 if no req.user
  ↓ profile controller
  ↓
200 { data: req.user }
```

### PATCH /auth/update  (protected)
```
Request {name}  (Authorization: Bearer <token>)
  ↓ tokenMiddleware     → req.user
  ↓ ensureAuthMiddleware → 401 if no req.user
  ↓ updateProfile controller
      validate name            ──► 400 if missing
      UPDATE users SET name WHERE id = req.user.id (returning id,name,email)
  ↓
200 { message, data: updatedUser }
```

### DELETE /auth/delete  (protected)
```
Request {id?}  (Authorization: Bearer <token>)
  ↓ tokenMiddleware     → req.user
  ↓ ensureAuthMiddleware → 401 if no req.user
  ↓ deleteUser controller
      id provided ──► 201 (mock delete of that id)
      no id       ──► DELETE all users ──► 201
```

### GET /admin/users  and  /admin/users/:userId  (ADMIN only)
```
Request  (Authorization: Bearer <token>)
  ↓ tokenMiddleware            → req.user
  ↓ ensureRoleMiddleware("ADMIN")
        !req.user        ──► 401 "UnAuthenticated User"
        role !== "ADMIN" ──► 403 "You are not authorized"
  ↓ getUsers controller
        no userId         ──► SELECT all users ──► 200 [users]
        userId not UUID   ──► 400 "Invalid USerID"
        userId valid      ──► SELECT one ──► 404 if missing, else 200 user
```

---

## 5. Layers in this project

```
Routes (router.js)  →  Middleware (guards)  →  Controller  →  Drizzle ORM (db)  →  PostgreSQL
```

This project does not (yet) have a separate Service / Repository layer — the
controllers talk to the database directly via Drizzle.
