# 🔑 Authentication Flow

This document details the security and authentication flows implemented in **OpenPrep AI**.

---

## 🔒 JWT Security Strategy

OpenPrep AI uses JSON Web Tokens (JWT) for authentication. 
* **Hashing Algorithm**: `HMAC-SHA256` via the `jsonwebtoken` package.
* **Token Lifetime**: 30 days (configured in controllers on login/registration).
* **Storage Location**: Client `localStorage` under the key `token`.
* **Payload Structure**:
```json
{
  "id": "60d0fe4f5311236168a109a1",
  "iat": 1782059349,
  "exp": 1784651349
}
```

---

## 🔄 User Registration Flow

The registration flow establishes new user accounts, hashes credentials, and starts an active session:

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant React as React Frontend
    participant Express as Express Backend
    participant DB as MongoDB
    
    Student->>React: Enters Name, Email, Password
    React->>Express: POST /api/auth/register (payload)
    Note over Express: Validate email format & password length
    Express->>DB: Query User where email = input
    alt Email already registered
        DB-->>Express: Returns existing User object
        Express-->>React: 400 Bad Request { error: "Email already exists" }
        React->>Student: Renders inline validation error
    else Email is free
        Express->>Express: Generate Salt and Hash Password (bcrypt)
        Express->>DB: Insert new User document
        DB-->>Express: Returns saved User record
        Express->>Express: Sign JWT (payload = user.id)
        Express-->>React: 201 Created { success: true, token, user }
        React->>React: Write token to localStorage
        React->>React: Update Redux state (isAuthenticated = true)
        React->>Student: Redirect to Dashboard (/dashboard)
    end
```

---

## 🔄 User Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant React as React Frontend
    participant Express as Express Backend
    participant DB as MongoDB
    
    Student->>React: Enters Email & Password
    React->>Express: POST /api/auth/login (payload)
    Express->>DB: Query User where email = input (select: +password)
    alt User not found
        DB-->>Express: Returns null
        Express-->>React: 401 Unauthorized { error: "Invalid credentials" }
        React->>Student: Renders warning notification
    else User exists
        Express->>Express: Compare password input with hash via bcrypt
        alt Password matches
            Express->>Express: Sign JWT
            Express-->>React: 200 OK { success: true, token, user }
            React->>React: Save token, update Redux store
            React->>Student: Redirect to Dashboard (/dashboard)
        else Password incorrect
            Express-->>React: 401 Unauthorized { error: "Invalid credentials" }
            React->>Student: Renders warning notification
        end
    end
```

---

## 🛡️ Route Protection Flow (API & UI)

### 1. API Route Guards (Backend)
Private Express routes are chained through the `protect` middleware:

```javascript
// backend/routes/quizRoutes.js
router.post('/generate-ai', protect, generateAIQuiz);
```

```mermaid
graph TD
    API[Incoming API Request] --> HeaderCheck{Auth Header Present?}
    HeaderCheck --> |No| Err401[401: Unauthorized - No Token]
    HeaderCheck --> |Yes: Bearer <token>| Decrypt{Verify JWT}
    Decrypt --> |Invalid / Expired| Err401_2[401: Unauthorized - Invalid Token]
    Decrypt --> |Valid| FetchDB[Query User record from MongoDB]
    FetchDB --> |Not Found| Err401_3[401: Unauthorized - User Deleted]
    FetchDB --> |Found| AttachReq[Attach user object to req.user]
    AttachReq --> Next[Call next middleware / controller handler]
```

### 2. UI Route Guards (Frontend)
Private pages are shielded from guest access using [ProtectedRoute.jsx](file:///c:/Users/Nishit/OneDrive/Desktop/ALL%20Projects/OPENPREP%20AI/OpenPrep-AI/frontend/src/components/ProtectedRoute.jsx).
1. Upon browser load/refresh, the client dispatches the `loadUser` async thunk.
2. If `localStorage.getItem('token')` is set:
   * It sends a `GET /api/auth/me` request with the token.
   * If the request is successful, the Redux store is populated with `user` data and `isAuthenticated` becomes `true`.
   * If the request fails (e.g., token expired), it deletes the token from local storage, resets state, and redirects to `/login`.
3. If no token is found, accessing protected paths redirects immediately to `/login`.
