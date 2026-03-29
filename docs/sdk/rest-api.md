---
sidebar_position: 2
title: REST API Quick Reference
---

# REST API Quick Reference

A compact reference for the WackyPod REST API. For full details on each endpoint, see the [API Reference](/docs/api-reference/rest-api).

## Base URL

```
https://api.wackypod.com
```

## Authentication

```
Authorization: Bearer <access-token-or-api-key>
```

API keys are prefixed with `wp_` and do not expire. JWT access tokens expire after 15 minutes.

## Endpoints at a glance

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/request-password-reset` | Request reset email |
| POST | `/api/auth/reset-password` | Reset password |

### Episodes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/episodes` | Create from text or URL |
| POST | `/api/episodes/upload` | Create from file upload |
| GET | `/api/episodes` | List episodes |
| GET | `/api/episodes/:id` | Get episode |
| GET | `/api/episodes/:id/stream` | SSE progress stream |
| DELETE | `/api/episodes/:id` | Delete episode |
| GET | `/api/episodes/:id/transcript` | Get transcript |
| GET | `/api/episodes/:id/show-notes` | Get show notes |
| GET | `/api/episodes/:id/transcript/search` | Search transcript |

### Playlists

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/playlists` | Create playlist |
| GET | `/api/playlists` | List playlists |
| GET | `/api/playlists/:id` | Get playlist |
| PUT | `/api/playlists/:id` | Update playlist |
| DELETE | `/api/playlists/:id` | Delete playlist |
| POST | `/api/playlists/:id/episodes` | Add episode |
| DELETE | `/api/playlists/:id/episodes/:episodeId` | Remove episode |
| PUT | `/api/playlists/:id/reorder` | Reorder episodes |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/quota` | Get quota status |
| GET | `/api/user/usage` | Usage history |
| GET | `/api/user/stats` | Aggregate stats |
| GET | `/api/user/export` | GDPR data export |
| POST | `/api/user/api-key` | Generate API key |
| DELETE | `/api/user/api-key` | Revoke API key |
| POST | `/api/user/change-password` | Change password |
| DELETE | `/api/user/account` | Delete account |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks` | Create webhook |
| GET | `/api/webhooks` | List webhooks |
| GET | `/api/webhooks/:id` | Get webhook |
| PATCH | `/api/webhooks/:id` | Update webhook |
| DELETE | `/api/webhooks/:id` | Delete webhook |
| POST | `/api/webhooks/:id/test` | Send test event |
| GET | `/api/webhooks/:id/deliveries` | Delivery history |

### RSS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rss/:userId` | Get RSS feed (public) |

### Briefings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/briefings` | List briefings |
| GET | `/api/briefings/:id` | Get briefing |
| POST | `/api/briefings` | Create briefing |
| PATCH | `/api/briefings/:id` | Update briefing |
| DELETE | `/api/briefings/:id` | Delete briefing |
| POST | `/api/briefings/:id/run` | Trigger run |
| GET | `/api/briefings/:id/runs` | Run history |
| POST | `/api/briefings/:id/sources` | Add source |
| DELETE | `/api/briefings/:id/sources/:sourceId` | Remove source |

### Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing/pricing` | Get pricing (public) |
| POST | `/api/billing/create-checkout` | Start checkout |
| GET | `/api/billing/subscription` | Get subscription |
| POST | `/api/billing/cancel-subscription` | Cancel subscription |
| POST | `/api/billing/reactivate-subscription` | Reactivate |
| POST | `/api/billing/update-payment-method` | Update payment |
| GET | `/api/billing/invoices` | Invoice history |

## Error format

All errors follow this structure:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable description"
}
```

## Rate limits

| Tier | Requests/Hour | Episodes/Month |
|------|---------------|----------------|
| Free | 10 | 3 |
| Creator | 50 | 25 |
| Professional | 200 | 100 |
| Enterprise | 1,000 | Unlimited |
