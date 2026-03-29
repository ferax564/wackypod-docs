---
sidebar_position: 2
title: Authentication
---

# Authentication API

Endpoints for user registration, login, token management, and password reset.

## POST /api/auth/register

Register a new user account.

**Request:**

```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars, uppercase + lowercase + number)",
  "name": "string (optional)"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "[email protected]",
    "name": "John Smith",
    "tier": "free",
    "emailVerified": false
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Errors:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Weak password | Password does not meet requirements |
| 409 | Email already registered | Account with this email exists |
| 429 | Rate limit exceeded | Too many registration attempts |

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "[email protected]",
    "password": "SecurePass123!",
    "name": "John Smith"
  }'
```

---

## POST /api/auth/login

Authenticate with email and password.

**Request:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "[email protected]",
    "name": "John Smith",
    "tier": "creator"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Errors:**

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Invalid credentials | Email or password is incorrect |
| 429 | Rate limit exceeded | Too many login attempts |

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "[email protected]", "password": "SecurePass123!"}'
```

---

## POST /api/auth/refresh

Refresh an expired access token using a refresh token.

**Request:**

```json
{
  "refreshToken": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

**Errors:**

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Invalid refresh token | Token is expired or revoked |

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiIs..."}'
```

---

## POST /api/auth/logout

Logout and revoke the refresh token.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**

```json
{
  "refreshToken": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiIs..."}'
```

---

## POST /api/auth/request-password-reset

Request a password reset email. Always returns 200 (does not reveal if email exists).

**Request:**

```json
{
  "email": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "If an account exists with this email, a reset link has been sent"
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "[email protected]"}'
```

---

## POST /api/auth/reset-password

Reset password using a token from the reset email.

**Request:**

```json
{
  "token": "string (required, from reset email)",
  "password": "string (required, min 8 chars)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Invalid or expired token | Reset token is no longer valid |
| 400 | Weak password | New password does not meet requirements |

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "reset-token-from-email", "password": "NewSecurePass456!"}'
```
