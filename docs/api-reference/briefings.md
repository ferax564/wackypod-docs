---
sidebar_position: 8
title: Briefings
---

# Briefings API

Configure and manage automated daily briefings generated from RSS feeds, newsletters, and other content sources. Requires **Creator tier or higher**.

All endpoints require authentication: `Authorization: Bearer TOKEN`

## GET /api/briefings

List all briefing configurations.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Results per page |
| `offset` | number | 0 | Pagination offset |
| `active` | boolean | -- | Filter by active status |

**Response:** `200 OK`

```json
{
  "success": true,
  "count": 2,
  "briefings": [
    {
      "id": "br_abc123",
      "name": "Morning Tech Digest",
      "description": "Daily tech news roundup",
      "template_type": "tech_news",
      "preset": "standard",
      "host_mode": "multi",
      "schedule_frequency": "weekdays",
      "schedule_time": "08:00:00",
      "schedule_timezone": "America/New_York",
      "is_active": true,
      "last_run_at": "2026-03-29T08:00:00Z",
      "next_run_at": "2026-03-31T08:00:00Z",
      "source_count": 3,
      "completed_runs": 15,
      "failed_runs": 0
    }
  ]
}
```

---

## GET /api/briefings/:id

Get a specific briefing with its content sources.

**Response:** `200 OK`

```json
{
  "success": true,
  "briefing": {
    "id": "br_abc123",
    "name": "Morning Tech Digest",
    "description": "Daily tech news roundup",
    "template_type": "tech_news",
    "sources": [
      {
        "id": "src_001",
        "source_type": "rss",
        "source_name": "TechCrunch",
        "source_url": "https://techcrunch.com/feed/",
        "is_active": true,
        "last_fetched_at": "2026-03-29T07:45:00Z"
      },
      {
        "id": "src_002",
        "source_type": "rss",
        "source_name": "The Verge",
        "source_url": "https://www.theverge.com/rss/index.xml",
        "is_active": true,
        "last_fetched_at": "2026-03-29T07:45:00Z"
      }
    ],
    "schedule_frequency": "weekdays",
    "schedule_time": "08:00:00",
    "schedule_timezone": "America/New_York"
  }
}
```

---

## POST /api/briefings

Create a new automated briefing.

**Request:**

```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "template_type": "tech_news | market_update | research_digest | general",
  "preset": "quick | standard | deep | extended",
  "host_mode": "single | multi",
  "schedule_frequency": "daily | weekdays | weekly | custom",
  "schedule_time": "HH:MM:SS",
  "schedule_timezone": "string (IANA timezone)",
  "max_sources_per_briefing": "number (optional, default: 5)",
  "content_freshness_hours": "number (optional, default: 24)",
  "priority_keywords": ["string"]
}
```

**Template types:**

| Template | Description |
|----------|-------------|
| `tech_news` | Technology news briefing |
| `market_update` | Financial market analysis |
| `research_digest` | Academic research summaries |
| `general` | Flexible content curation |

**Schedule frequencies:**

| Frequency | Description |
|-----------|-------------|
| `daily` | Every day at the specified time |
| `weekdays` | Monday through Friday only |
| `weekly` | Specific days of the week |
| `custom` | Custom day pattern |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Briefing created successfully",
  "briefing": {
    "id": "br_def456",
    "name": "Daily Market Update",
    "schedule_frequency": "weekdays",
    "schedule_time": "06:00:00",
    "is_active": true
  }
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/briefings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Tech Digest",
    "template_type": "tech_news",
    "preset": "standard",
    "host_mode": "multi",
    "schedule_frequency": "weekdays",
    "schedule_time": "08:00:00",
    "schedule_timezone": "America/New_York",
    "priority_keywords": ["AI", "startups", "cloud"]
  }'
```

---

## PATCH /api/briefings/:id

Update a briefing configuration. Send any subset of fields.

**Request:**

```json
{
  "name": "Updated Name",
  "is_active": false,
  "schedule_time": "09:00:00"
}
```

**Response:** `200 OK` with updated briefing.

---

## DELETE /api/briefings/:id

Delete a briefing configuration and all its sources.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Briefing deleted successfully"
}
```

---

## POST /api/briefings/:id/run

Manually trigger a briefing run (ignores the schedule).

**Response:** `202 Accepted`

```json
{
  "success": true,
  "message": "Briefing run started",
  "jobId": "job_abc123"
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/briefings/br_abc123/run \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## GET /api/briefings/:id/runs

Get execution history for a briefing.

**Query Parameters:**
- `limit`: Max results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:** `200 OK`

```json
{
  "success": true,
  "count": 5,
  "runs": [
    {
      "id": "run_001",
      "briefing_config_id": "br_abc123",
      "episode_id": "ep_xyz789",
      "run_type": "scheduled",
      "status": "completed",
      "sources_fetched": 3,
      "items_included": 5,
      "total_words": 1050,
      "started_at": "2026-03-29T08:00:00Z",
      "completed_at": "2026-03-29T08:03:45Z",
      "episode_title": "Tech News - March 29, 2026"
    }
  ]
}
```

---

## POST /api/briefings/:id/sources

Add a content source to a briefing.

**Request:**

```json
{
  "source_type": "rss",
  "source_name": "The Verge",
  "source_url": "https://www.theverge.com/rss/index.xml",
  "fetch_limit": 10,
  "is_active": true
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "source": {
    "id": "src_003",
    "source_type": "rss",
    "source_name": "The Verge",
    "source_url": "https://www.theverge.com/rss/index.xml",
    "is_active": true
  }
}
```

---

## DELETE /api/briefings/:id/sources/:sourceId

Remove a content source from a briefing.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Source removed"
}
```

---

## POST /api/briefing-webhooks/email/:webhookId

Receive forwarded emails for briefing sources (for newsletter ingestion).

**No authentication required** -- authenticated by the unique webhook ID.

**Request:** Email payload from your email provider (SendGrid, Mailgun, AWS SES, etc.)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Email received and processed",
  "briefingSource": "Newsletter Name"
}
```

This endpoint allows you to forward newsletters to WackyPod for inclusion in your automated briefings.
