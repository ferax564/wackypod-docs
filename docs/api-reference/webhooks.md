---
sidebar_position: 6
title: Webhooks
---

# Webhooks API

Register, manage, and test webhook endpoints for real-time event notifications.

All endpoints require authentication: `Authorization: Bearer TOKEN`

## POST /api/webhooks

Create a new webhook.

**Request:**

```json
{
  "url": "string (required, HTTPS URL)",
  "events": ["episode.completed", "episode.failed"],
  "description": "string (optional)"
}
```

**Available events:**

| Event | Description |
|-------|-------------|
| `episode.completed` | Episode finished processing, audio available |
| `episode.failed` | Episode processing failed |

**Response:** `201 Created`

```json
{
  "success": true,
  "webhook": {
    "id": "wh_abc123",
    "url": "https://your-server.com/webhooks",
    "events": ["episode.completed", "episode.failed"],
    "secret": "whsec_xyz789...",
    "is_active": true
  },
  "message": "Save the secret - it will not be shown again!"
}
```

:::warning
The `secret` is shown only once. Store it securely to verify webhook signatures.
:::

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhooks/wackypod",
    "events": ["episode.completed", "episode.failed"],
    "description": "Production webhook"
  }'
```

```python
webhook = client.webhooks.create(
    url="https://your-server.com/webhooks/wackypod",
    events=["episode.completed", "episode.failed"],
    description="Production webhook"
)
print(f"Secret: {webhook.secret}")
```

---

## GET /api/webhooks

List all webhooks with delivery statistics.

**Response:** `200 OK`

```json
{
  "success": true,
  "webhooks": [
    {
      "id": "wh_abc123",
      "url": "https://your-server.com/webhooks",
      "events": ["episode.completed", "episode.failed"],
      "is_active": true,
      "description": "Production webhook",
      "deliveryStats": {
        "total": 50,
        "successful": 48,
        "failed": 2
      },
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

---

## GET /api/webhooks/:id

Get a specific webhook by ID.

**Response:** `200 OK` with webhook details (same format as list item).

---

## PATCH /api/webhooks/:id

Update a webhook configuration.

**Request:**

```json
{
  "url": "string (optional)",
  "events": ["episode.completed"],
  "is_active": true,
  "description": "string (optional)"
}
```

**Response:** `200 OK` with updated webhook.

**Example:**

```bash
curl -X PATCH https://api.wackypod.com/api/webhooks/wh_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"events": ["episode.completed"], "is_active": false}'
```

```python
client.webhooks.update("wh_abc123", events=["episode.completed"])
```

---

## DELETE /api/webhooks/:id

Delete a webhook.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Webhook deleted successfully"
}
```

**Example:**

```bash
curl -X DELETE https://api.wackypod.com/api/webhooks/wh_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
client.webhooks.delete("wh_abc123")
```

---

## POST /api/webhooks/:id/test

Send a test event to the webhook endpoint.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Test event sent",
  "delivery": {
    "statusCode": 200,
    "duration": 145
  }
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/webhooks/wh_abc123/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
client.webhooks.test("wh_abc123")
```

---

## GET /api/webhooks/:id/deliveries

Get delivery history for a webhook.

**Query Parameters:**
- `limit`: Max results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:** `200 OK`

```json
{
  "success": true,
  "deliveries": [
    {
      "id": "del_001",
      "event": "episode.completed",
      "statusCode": 200,
      "duration": 145,
      "success": true,
      "attemptNumber": 1,
      "deliveredAt": "2026-03-29T10:00:00Z"
    },
    {
      "id": "del_002",
      "event": "episode.completed",
      "statusCode": 500,
      "duration": 5000,
      "success": false,
      "attemptNumber": 1,
      "deliveredAt": "2026-03-28T10:00:00Z"
    }
  ]
}
```

```python
deliveries = client.webhooks.get_deliveries("wh_abc123")
for d in deliveries:
    print(f"{d.event}: {d.status_code} ({d.duration}ms)")
```

## Webhook payload

All webhook requests include:
- **Body:** JSON event payload
- **Header `X-WackyPod-Signature`:** HMAC-SHA256 signature of the body
- **Header `Content-Type`:** `application/json`

See the [Webhooks guide](/docs/guides/webhooks) for payload format and signature verification examples.
