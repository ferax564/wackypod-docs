---
sidebar_position: 5
title: User Profile
---

# User Profile API

Manage user profile, quota, usage statistics, API keys, and account settings.

All endpoints require authentication: `Authorization: Bearer TOKEN`

## GET /api/user/profile

Get the current user's profile.

**Response:** `200 OK`

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "[email protected]",
    "name": "John Smith",
    "bio": "Tech enthusiast and podcast creator",
    "tier": "creator",
    "emailVerified": true,
    "subscription": {
      "status": "active",
      "periodEnd": "2026-04-01T00:00:00Z"
    },
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

**Example:**

```bash
curl https://api.wackypod.com/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
from wackypod import WackyPod
client = WackyPod(api_key="wp_your_key")
profile = client.users.get_profile()
print(f"Tier: {profile.tier}")
```

---

## PUT /api/user/profile

Update the user profile.

**Request:**

```json
{
  "name": "string (optional, max 100)",
  "bio": "string (optional, max 500)",
  "avatarUrl": "string (optional, must be HTTPS URL)"
}
```

**Response:** `200 OK` with updated user object.

**Example:**

```bash
curl -X PUT https://api.wackypod.com/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John S.", "bio": "Podcast enthusiast"}'
```

---

## GET /api/user/quota

Get current monthly quota status.

**Response:** `200 OK`

```json
{
  "success": true,
  "quota": {
    "tier": "creator",
    "episodesLimit": 25,
    "episodesUsed": 12,
    "episodesRemaining": 13,
    "quotaPercentage": 48.0
  }
}
```

**Example:**

```bash
curl https://api.wackypod.com/api/user/quota \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
quota = client.users.get_quota()
print(f"Used: {quota.episodes_used}/{quota.episodes_limit}")
```

---

## GET /api/user/usage

Get usage history for the past 12 months.

**Query Parameters:**
- `months`: Number of months to retrieve (default: 12, max: 24)

**Response:** `200 OK`

```json
{
  "success": true,
  "usage": [
    {
      "month": "2026-03-01",
      "episodesCreated": 15,
      "totalAudioDuration": 6300,
      "totalCharacters": 52500,
      "costTotal": 4.50
    },
    {
      "month": "2026-02-01",
      "episodesCreated": 22,
      "totalAudioDuration": 9800,
      "totalCharacters": 78000,
      "costTotal": 6.20
    }
  ],
  "thisMonth": {
    "episodes_created": 15,
    "total_audio_duration": 6300
  }
}
```

---

## GET /api/user/stats

Get aggregate user statistics.

**Response:** `200 OK`

```json
{
  "success": true,
  "stats": {
    "totalEpisodes": 42,
    "completedEpisodes": 40,
    "totalCost": 12.50,
    "currentMonth": {
      "episodesUsed": 12,
      "episodesLimit": 25,
      "quotaPercentage": 48.0
    }
  }
}
```

---

## GET /api/user/export

Export all user data (GDPR compliance). Returns a JSON file download.

**Response:** `200 OK` (application/json download)

```json
{
  "exportDate": "2026-03-29T10:00:00Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "[email protected]",
    "name": "John Smith",
    "tier": "creator",
    "createdAt": "2026-01-15T10:00:00Z"
  },
  "episodes": [...],
  "usage": [...],
  "summary": {
    "totalEpisodes": 42,
    "accountAge": "2026-01-15T10:00:00Z"
  }
}
```

**Example:**

```bash
curl https://api.wackypod.com/api/user/export \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o my-data.json
```

---

## POST /api/user/api-key

Generate a new API key. Requires Creator tier or higher. Previous keys are revoked when a new one is generated.

**Response:** `200 OK`

```json
{
  "success": true,
  "apiKey": "wp_abc123def456ghi789...",
  "warning": "Save this securely. It will not be shown again."
}
```

:::warning
The API key is displayed only once. Store it in a secure location like an environment variable or secret manager.
:::

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/user/api-key \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## DELETE /api/user/api-key

Revoke the current API key.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "API key revoked"
}
```

---

## POST /api/user/change-password

Change account password.

**Request:**

```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Invalid credentials | Current password is incorrect |
| 400 | Weak password | New password does not meet requirements |

---

## DELETE /api/user/account

Permanently delete the user account and all associated data.

**Request:**

```json
{
  "password": "string (required)",
  "confirm": "DELETE"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account deleted permanently"
}
```

:::danger
This action is irreversible. All episodes, playlists, webhooks, and account data will be permanently deleted.
:::
