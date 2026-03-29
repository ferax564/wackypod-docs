---
sidebar_position: 1
title: Authentication
---

# Authentication

WackyPod supports two authentication methods: **JWT Bearer Tokens** for interactive sessions and **API Keys** for server-to-server integrations.

## Authentication methods

### Bearer tokens (JWT)

Best for web and mobile apps. Access tokens expire after 15 minutes and can be refreshed using a refresh token (valid for 7 days).

```bash
# Login to get tokens
curl -X POST https://api.wackypod.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "[email protected]", "password": "SecurePass123!"}'
```

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

Use the access token in the `Authorization` header:

```bash
curl https://api.wackypod.com/api/episodes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### API keys

Best for server-to-server integrations. API keys do not expire but can be revoked. Requires **Creator tier or higher**.

Generate an API key:

```bash
curl -X POST https://api.wackypod.com/api/user/api-key \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

```json
{
  "success": true,
  "apiKey": "wp_abc123def456...",
  "warning": "Save this securely. It will not be shown again."
}
```

Use the API key as a Bearer token:

```bash
curl https://api.wackypod.com/api/episodes \
  -H "Authorization: Bearer wp_abc123def456..."
```

:::warning
API keys are shown only once when generated. Store them securely. If you lose your key, revoke it and generate a new one.
:::

## Token lifecycle

```
Register/Login --> Access Token (15 min) + Refresh Token (7 days)
                        |
                   Token expires
                        |
                   Refresh Token --> New Access Token + New Refresh Token
                        |
                   Refresh expires --> Re-login required
```

### Refreshing tokens

When your access token expires (401 response), use the refresh token to get a new pair:

```bash
curl -X POST https://api.wackypod.com/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiIs..."}'
```

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

### Token refresh in code (JavaScript)

```javascript
async function apiCall(url, options = {}) {
  let token = localStorage.getItem('accessToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired, try refresh
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshResponse = await fetch('https://api.wackypod.com/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await refreshResponse.json();
    if (data.success) {
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);

      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${data.tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }

    // Refresh failed, redirect to login
    throw new Error('Session expired');
  }

  return response;
}
```

### Token refresh in code (Python)

```python
from wackypod import WackyPod

# With API key -- no refresh needed
client = WackyPod(api_key="wp_abc123...")

# The SDK handles token management automatically
episodes = client.episodes.list()
```

## Password requirements

- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Passwords are hashed with bcrypt (10 rounds)

## Password reset

Request a password reset email:

```bash
curl -X POST https://api.wackypod.com/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "[email protected]"}'
```

Reset with the token from the email:

```bash
curl -X POST https://api.wackypod.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "reset-token-from-email", "password": "NewSecurePass456!"}'
```

## Rate limiting

Authentication endpoints have their own rate limits to prevent brute-force attacks:

| Endpoint | Limit |
|----------|-------|
| `/api/auth/login` | 5 attempts per 15 minutes |
| `/api/auth/register` | 3 attempts per hour |
| `/api/auth/refresh` | 30 attempts per hour |
| `/api/user/api-key` | 3 generations per day |

## Security best practices

1. **Use API keys for automation** -- They are more suitable for server-to-server calls than storing user credentials
2. **Never expose tokens in client-side code** -- API keys should only be used in server environments
3. **Implement token refresh** -- Handle 401 responses gracefully with automatic retry
4. **Rotate API keys periodically** -- Revoke old keys and generate new ones
5. **Use HTTPS exclusively** -- All API calls must use HTTPS
