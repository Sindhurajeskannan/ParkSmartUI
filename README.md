# ParkSmart Frontend (Angular 21)

## Setup

```bash
npm install
ng serve
```
App runs at: http://localhost:4200
Backend expected at: http://localhost:8081/api

## Project Structure

```
src/app/
├── components/
│   ├── navbar/           # Sticky nav — Login btn OR user icon+dropdown
│   ├── home/             # Landing page — clicking anything opens login modal
│   ├── login-modal/      # Login popup (POST /api/auth/login)
│   ├── signup-modal/     # Signup popup (POST /api/auth/signup)
│   ├── dashboard/        # Post-login dummy page
│   └── user-profile/     # Fetches & displays GET /api/user/profile
├── services/
│   ├── auth.service.ts   # Login, signup, logout, token storage
│   ├── user.service.ts   # getProfile() with Bearer token
│   └── auth.interceptor.ts  # Auto-attaches Bearer token to all requests
├── guards/
│   └── auth.guard.ts     # Protects /dashboard and /profile routes
└── app-routing.module.ts # Routes: / | /dashboard | /profile
```

## Auth Flow

1. User visits `/` → sees Home page
2. Clicks anything → Login modal opens
3. Login success → token saved to localStorage → redirect to `/dashboard`
4. Navbar shows user icon instead of "Log In"
5. Click icon → dropdown: "User Profile" or "Logout"
6. "User Profile" → navigates to `/profile` → fetches `GET /api/user/profile`
7. "Logout" → clears localStorage → back to `/`

## API Endpoints Used

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/login | Login — returns `{ token, userId, email, username }` |
| POST | /api/auth/signup | Signup — returns success |
| GET  | /api/user/profile | Get logged-in user profile (Bearer token required) |

## Expected Login Response Shape

```json
{
  "token": "eyJ...",
  "userId": 1,
  "email": "user@example.com",
  "username": "John Doe"
}
```

## Expected Profile Response Shape

```json
{
  "id": 1,
  "username": "John Doe",
  "email": "user@example.com",
  "phoneNumber": "9876543210",
  "role": "USER",
  "createdAt": "2026-04-01T10:00:00"
}
```

> If your backend returns different field names, update `UserProfile` interface in `user.service.ts`.
