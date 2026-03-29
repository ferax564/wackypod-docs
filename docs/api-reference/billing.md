---
sidebar_position: 9
title: Billing
---

# Billing API

Manage subscriptions, checkout sessions, and invoices via Stripe integration.

All endpoints require authentication unless noted: `Authorization: Bearer TOKEN`

:::info
Billing endpoints require Stripe to be configured on the server. If Stripe is not configured, these endpoints return `503 Service Unavailable`.
:::

## GET /api/billing/pricing

Get pricing information for all tiers. **No authentication required.**

**Response:** `200 OK`

```json
{
  "success": true,
  "pricing": [
    {
      "tier": "creator",
      "name": "Creator",
      "price": 1200,
      "interval": "month",
      "features": [
        "25 episodes/month",
        "API access",
        "RSS feeds",
        "Up to 15-minute episodes",
        "Premium voices"
      ]
    },
    {
      "tier": "professional",
      "name": "Professional",
      "price": 4900,
      "interval": "month",
      "features": [
        "100 episodes/month",
        "API access",
        "Voice cloning",
        "Up to 30-minute episodes",
        "White-label options",
        "Priority support"
      ]
    }
  ]
}
```

Prices are in cents (USD). `1200` = $12.00/month.

---

## POST /api/billing/create-checkout

Create a Stripe checkout session for upgrading to a paid tier.

**Request:**

```json
{
  "tier": "creator | professional | enterprise",
  "successUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/cancel"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

Redirect the user to the `url` to complete payment.

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/billing/create-checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "creator",
    "successUrl": "https://wackypod.com/success",
    "cancelUrl": "https://wackypod.com/pricing"
  }'
```

---

## GET /api/billing/subscription

Get current subscription details.

**Response:** `200 OK`

```json
{
  "success": true,
  "subscription": {
    "id": "sub_1234567890",
    "tier": "creator",
    "status": "active",
    "currentPeriodStart": "2026-03-01T00:00:00Z",
    "currentPeriodEnd": "2026-04-01T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

**Subscription statuses:** `active`, `canceled`, `past_due`, `unpaid`

---

## POST /api/billing/cancel-subscription

Cancel the current subscription. The subscription remains active until the end of the current billing period.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Subscription will be canceled at the end of the billing period",
  "subscription": {
    "status": "active",
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2026-04-01T00:00:00Z"
  }
}
```

---

## POST /api/billing/reactivate-subscription

Reactivate a canceled subscription before the current period ends.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Subscription reactivated",
  "subscription": {
    "status": "active",
    "cancelAtPeriodEnd": false
  }
}
```

---

## POST /api/billing/update-payment-method

Create a Stripe session to update the payment method on file.

**Request:**

```json
{
  "successUrl": "https://yourapp.com/settings",
  "cancelUrl": "https://yourapp.com/settings"
}
```

**Response:** `200 OK` with Stripe session URL (same format as create-checkout).

---

## GET /api/billing/invoices

Get billing history and invoice PDFs.

**Query Parameters:**
- `limit`: Max results (default: 10)

**Response:** `200 OK`

```json
{
  "success": true,
  "invoices": [
    {
      "id": "in_1234567890",
      "amount": 1200,
      "currency": "usd",
      "status": "paid",
      "invoicePdf": "https://pay.stripe.com/invoice/...",
      "created": "2026-03-01T00:00:00Z"
    }
  ]
}
```

---

## POST /api/billing/webhook

Stripe webhook endpoint for processing payment events. **Not called directly** -- Stripe sends events to this endpoint automatically.

Verified events processed:
- `checkout.session.completed` -- Upgrade tier after successful payment
- `customer.subscription.updated` -- Sync tier changes
- `customer.subscription.deleted` -- Downgrade to free tier
- `invoice.payment_failed` -- Send failed payment notification
