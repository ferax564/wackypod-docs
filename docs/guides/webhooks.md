---
sidebar_position: 3
title: Webhooks
---

# Webhooks Guide

Webhooks allow you to receive real-time notifications when events occur in your WackyPod account, such as when an episode finishes processing or fails.

## Overview

Instead of polling the API to check episode status, register a webhook URL and WackyPod will send an HTTP POST request to your server when events happen.

## Setting up a webhook

### 1. Create a webhook endpoint

Register a URL to receive webhook events:

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

Response:

```json
{
  "success": true,
  "webhook": {
    "id": "wh_abc123",
    "url": "https://your-server.com/webhooks/wackypod",
    "events": ["episode.completed", "episode.failed"],
    "secret": "whsec_xyz789...",
    "is_active": true
  },
  "message": "Save the secret - it will not be shown again!"
}
```

:::warning
Save the `secret` value immediately. It is shown only once and is needed to verify webhook signatures.
:::

### 2. Handle incoming webhooks

Your endpoint should:
- Accept POST requests with JSON body
- Return a 200 status code promptly
- Verify the webhook signature

Example server (Node.js/Express):

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

app.post('/webhooks/wackypod', express.json(), (req, res) => {
  // Verify signature
  const signature = req.headers['x-wackypod-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Handle the event
  const { event, data } = req.body;

  switch (event) {
    case 'episode.completed':
      console.log(`Episode ready: ${data.episode.title}`);
      console.log(`Audio URL: ${data.episode.audioUrl}`);
      break;
    case 'episode.failed':
      console.error(`Episode failed: ${data.episode.id}`);
      console.error(`Error: ${data.error}`);
      break;
  }

  res.status(200).json({ received: true });
});
```

Example server (Python/Flask):

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = "whsec_xyz789..."

@app.route('/webhooks/wackypod', methods=['POST'])
def handle_webhook():
    # Verify signature
    signature = request.headers.get('X-WackyPod-Signature')
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        request.get_data(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected):
        return jsonify({"error": "Invalid signature"}), 401

    event = request.json
    if event['event'] == 'episode.completed':
        episode = event['data']['episode']
        print(f"Episode ready: {episode['title']}")

    return jsonify({"received": True}), 200
```

## Available events

| Event | Description |
|-------|-------------|
| `episode.completed` | Episode finished processing and audio is available |
| `episode.failed` | Episode processing failed |

## Webhook payload format

```json
{
  "event": "episode.completed",
  "timestamp": "2026-03-29T10:00:00Z",
  "data": {
    "episode": {
      "id": "ep_abc123",
      "title": "The Future of AI",
      "status": "ready",
      "audioUrl": "https://cdn.wackypod.com/episodes/ep_abc123.mp3",
      "audioDuration": 420,
      "preset": "standard",
      "hostMode": "multi",
      "createdAt": "2026-03-29T09:55:00Z"
    }
  }
}
```

## Testing webhooks

### Send a test event

```bash
curl -X POST https://api.wackypod.com/api/webhooks/wh_abc123/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using a tunnel for local development

For testing locally, use a tunneling service like ngrok:

```bash
ngrok http 3000
```

Then register the ngrok URL as your webhook endpoint:

```bash
curl -X POST https://api.wackypod.com/api/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://abc123.ngrok.io/webhooks/wackypod",
    "events": ["episode.completed", "episode.failed"]
  }'
```

## Managing webhooks

### List webhooks

```bash
curl https://api.wackypod.com/api/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a webhook

```bash
curl -X PATCH https://api.wackypod.com/api/webhooks/wh_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"events": ["episode.completed"], "is_active": true}'
```

### Delete a webhook

```bash
curl -X DELETE https://api.wackypod.com/api/webhooks/wh_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Delivery and retries

- Webhooks must respond within **10 seconds** with a 2xx status code
- Failed deliveries are retried up to **3 times** with exponential backoff
- If all retries fail, the webhook is marked as failing
- Check delivery history to debug issues

### View delivery history

```bash
curl https://api.wackypod.com/api/webhooks/wh_abc123/deliveries \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Signature verification

Every webhook request includes an `X-WackyPod-Signature` header containing an HMAC-SHA256 signature of the request body, signed with your webhook secret.

Always verify the signature before processing the event to ensure the request is genuinely from WackyPod.
