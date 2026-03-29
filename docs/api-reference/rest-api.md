---
sidebar_position: 1
title: REST API Overview
---

# REST API Overview

The WackyPod REST API provides programmatic access to episode generation, user management, webhooks, RSS feeds, briefings, and billing.

## Base URL

```
https://api.wackypod.com
```

All endpoints are served over HTTPS. HTTP requests are rejected.

## Authentication

Include your token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

You can use either a JWT access token or an API key (prefixed `wp_`). See the [Authentication guide](/docs/guides/authentication) for details.

## Content type

All request and response bodies use JSON:

```
Content-Type: application/json
```

The exception is file upload endpoints, which use `multipart/form-data`.

## Response format

### Success responses

All successful responses include `success: true`:

```json
{
  "success": true,
  "data": { ... }
}
```

### Error responses

All error responses include `success: false`:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error description"
}
```

Some errors include additional context:

```json
{
  "success": false,
  "error": "Weak password",
  "message": "Password does not meet requirements",
  "errors": ["Must be 8+ chars", "Must contain uppercase", "Must contain number"]
}
```

## HTTP status codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created |
| `202` | Accepted | Async operation started |
| `400` | Bad Request | Invalid parameters |
| `401` | Unauthorized | Authentication required or failed |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists |
| `413` | Payload Too Large | File exceeds size limit |
| `429` | Too Many Requests | Rate limit or quota exceeded |
| `500` | Internal Server Error | Server error |

## Rate limits

### Hourly request limits

| Tier | Requests/Hour |
|------|---------------|
| Free | 10 |
| Creator | 50 |
| Professional | 200 |
| Enterprise | 1,000 |

### Monthly episode quotas

| Tier | Episodes/Month | Max Duration | Max File Size |
|------|----------------|--------------|---------------|
| Free | 3 | 3 min | 5 MB |
| Creator | 25 | 15 min | 20 MB |
| Professional | 100 | 30 min | 50 MB |
| Enterprise | Unlimited | Unlimited | 100 MB |

### Quota exceeded response

```json
{
  "success": false,
  "error": "Monthly quota exceeded",
  "quota": {
    "tier": "free",
    "limit": 3,
    "used": 3,
    "remaining": 0
  },
  "upgrade": {
    "message": "Upgrade to create more episodes",
    "url": "/pricing"
  }
}
```

## Pagination

List endpoints support pagination with `limit` and `offset` query parameters:

```bash
GET /api/episodes?limit=25&offset=50
```

Paginated responses include a `pagination` object:

```json
{
  "success": true,
  "episodes": [...],
  "pagination": {
    "total": 142,
    "limit": 25,
    "offset": 50
  }
}
```

## API endpoints

| Category | Endpoints |
|----------|-----------|
| [Authentication](/docs/api-reference/authentication) | Register, login, token refresh, password reset |
| [Episodes](/docs/api-reference/episodes) | Create, list, get, delete episodes |
| [Playlists](/docs/api-reference/playlists) | Create, manage, reorder playlists |
| [User Profile](/docs/api-reference/user-profile) | Profile, quota, usage, API keys |
| [Webhooks](/docs/api-reference/webhooks) | Register, manage, test webhooks |
| [RSS](/docs/api-reference/rss) | RSS feed endpoints |
| [Briefings](/docs/api-reference/briefings) | Automated briefing configuration |
| [Billing](/docs/api-reference/billing) | Subscriptions, checkout, invoices |

## SDKs

| Language | Package | Status |
|----------|---------|--------|
| [Python](/docs/sdk/python) | `pip install wackypod` | Production |
| JavaScript | `npm install wackypod` | Coming Q1 2026 |

## Best practices

1. **Use API keys for server-to-server** -- Safer than storing user credentials
2. **Handle async operations** -- Episode generation is asynchronous; use webhooks or polling
3. **Implement exponential backoff** -- For retries on 429 and 5xx errors
4. **Check quotas before creating** -- Call `GET /api/user/quota` to avoid quota errors
5. **Verify webhook signatures** -- Always validate the `X-WackyPod-Signature` header
6. **Use HTTPS** -- All endpoints require HTTPS
