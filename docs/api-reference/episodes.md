---
sidebar_position: 3
title: Episodes
---

# Episodes API

Create, retrieve, and manage podcast episodes.

## POST /api/episodes

Create a new episode from text or URL.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**

```json
{
  "content": "string (text content)",
  "url": "string (URL to fetch content from)",
  "preset": "quick | standard | deep | extended",
  "hostMode": "single | multi",
  "voiceStyle": "professional | casual | educational | enthusiastic",
  "voicePair": "expert-curious | debate | interview",
  "ttsEngine": "kokoro | chatterbox | auto",
  "reviewScript": false
}
```

Either `content` or `url` is required (not both).

**Parameters:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `content` | string | conditional | -- | Plain text content to convert |
| `url` | string | conditional | -- | URL to fetch content from |
| `preset` | string | no | `standard` | Duration preset |
| `hostMode` | string | no | `single` | Single or multi-speaker |
| `voiceStyle` | string | no | `professional` | Voice personality |
| `voicePair` | string | no | `expert-curious` | Multi-speaker dynamic |
| `ttsEngine` | string | no | `auto` | TTS engine selection |
| `reviewScript` | boolean | no | `false` | Pause for script review |

**Preset availability by tier:**

| Preset | Duration | Free | Creator | Professional | Enterprise |
|--------|----------|------|---------|--------------|------------|
| `quick` | ~3 min | Yes | Yes | Yes | Yes |
| `standard` | ~7 min | No | Yes | Yes | Yes |
| `deep` | ~15 min | No | Yes | Yes | Yes |
| `extended` | ~30 min | No | No | Yes | Yes |

**Response:** `202 Accepted`

```json
{
  "success": true,
  "episode": {
    "id": "ep_abc123",
    "status": "queued",
    "preset": "standard",
    "hostMode": "multi",
    "createdAt": "2026-03-29T10:00:00Z"
  },
  "quota": {
    "used": 5,
    "limit": 25,
    "remaining": 20
  }
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/episodes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article",
    "preset": "standard",
    "hostMode": "multi",
    "voiceStyle": "casual"
  }'
```

```python
from wackypod import WackyPod

client = WackyPod(api_key="wp_your_key")
episode = client.episodes.create(
    input_type="url",
    input_source="https://example.com/article",
    preset="standard"
)
```

---

## POST /api/episodes/upload

Create an episode from a file upload (PDF, DOCX, TXT, MD).

**Headers:** `Authorization: Bearer TOKEN`, `Content-Type: multipart/form-data`

**Form Data:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | yes | PDF, DOCX, DOC, TXT, or MD file |
| `preset` | string | no | Duration preset (default: `standard`) |
| `hostMode` | string | no | `single` or `multi` (default: `single`) |
| `voiceStyle` | string | no | Voice style |
| `voicePair` | string | no | Multi-speaker dynamic |

**File size limits:**

| Tier | Max Size |
|------|----------|
| Free | 5 MB |
| Creator | 20 MB |
| Professional | 50 MB |
| Enterprise | 100 MB |

**Response:** `202 Accepted` (same format as POST /api/episodes)

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/episodes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf" \
  -F "preset=standard" \
  -F "hostMode=multi"
```

---

## GET /api/episodes

List all episodes for the authenticated user.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | -- | Filter by status |
| `limit` | number | 50 | Results per page (max 100) |
| `offset` | number | 0 | Pagination offset |

**Status values:** `queued`, `ingesting`, `generating_script`, `review_script`, `generating_audio`, `ready`, `error`

**Response:** `200 OK`

```json
{
  "success": true,
  "episodes": [
    {
      "id": "ep_abc123",
      "title": "The Future of AI",
      "status": "ready",
      "preset": "standard",
      "hostMode": "multi",
      "sourceType": "url",
      "audioUrl": "/episodes/ep_abc123.mp3",
      "audioDuration": 420,
      "createdAt": "2026-03-29T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0
  }
}
```

**Example:**

```bash
curl "https://api.wackypod.com/api/episodes?status=ready&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
episodes = client.episodes.list(status="ready", limit=10)
for ep in episodes:
    print(f"{ep.title} ({ep.audio_duration_seconds}s)")
```

---

## GET /api/episodes/:id

Get a specific episode by ID.

**Headers:** `Authorization: Bearer TOKEN` (optional for public episodes)

**Response:** `200 OK`

```json
{
  "success": true,
  "episode": {
    "id": "ep_abc123",
    "title": "The Future of AI",
    "description": "An exploration of artificial intelligence and its impact on society.",
    "status": "ready",
    "progressPercent": 100,
    "preset": "standard",
    "hostMode": "multi",
    "scriptText": "[Host 1]: Welcome to today's episode...",
    "audioUrl": "/episodes/ep_abc123.mp3",
    "audioDuration": 420,
    "createdAt": "2026-03-29T10:00:00Z"
  }
}
```

**Example:**

```bash
curl https://api.wackypod.com/api/episodes/ep_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
episode = client.episodes.get("ep_abc123")
print(f"Status: {episode.status}")
print(f"Audio: {episode.audio_url}")
```

---

## GET /api/episodes/:id/stream

Subscribe to real-time progress updates via Server-Sent Events (SSE).

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK` (text/event-stream)

Events are sent as the episode progresses through each stage:

```
data: {"status":"ingesting","progressPercent":10}

data: {"status":"generating_script","progressPercent":30}

data: {"status":"generating_audio","progressPercent":70}

data: {"status":"ready","progressPercent":100,"audioUrl":"/episodes/ep_abc123.mp3"}
```

**Example (JavaScript):**

```javascript
const eventSource = new EventSource(
  'https://api.wackypod.com/api/episodes/ep_abc123/stream'
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`${data.status}: ${data.progressPercent}%`);

  if (data.status === 'ready' || data.status === 'error') {
    eventSource.close();
  }
};
```

---

## DELETE /api/episodes/:id

Delete an episode. Must be the episode owner.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Episode deleted successfully"
}
```

**Errors:**

| Status | Error | Description |
|--------|-------|-------------|
| 403 | Forbidden | Not the episode owner |
| 404 | Not found | Episode does not exist |

**Example:**

```bash
curl -X DELETE https://api.wackypod.com/api/episodes/ep_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```python
client.episodes.delete("ep_abc123")
```

---

## GET /api/episodes/:id/transcript

Get the full transcript with timed segments.

**Headers:** `Authorization: Bearer TOKEN` (optional for public episodes)

**Response:** `200 OK`

```json
{
  "episodeId": "ep_abc123",
  "segments": [
    {
      "id": "seg_001",
      "speaker": "Host 1",
      "text": "Welcome to today's episode...",
      "startTimeMs": 0,
      "endTimeMs": 3500,
      "confidence": 0.95
    }
  ],
  "stats": {
    "totalSegments": 45,
    "totalWords": 1250,
    "totalDurationMs": 420000,
    "speakers": ["Host 1", "Host 2"]
  }
}
```

---

## GET /api/episodes/:id/show-notes

Get AI-generated show notes including summary, key points, chapters, and topics.

**Headers:** `Authorization: Bearer TOKEN` (optional)

**Response:** `200 OK`

```json
{
  "episodeId": "ep_abc123",
  "summary": "A deep dive into how AI is transforming content creation...",
  "keyPoints": [
    "AI-powered tools can generate studio-quality podcasts",
    "Text-to-speech technology has reached human parity",
    "Content accessibility is improving through audio formats"
  ],
  "chapters": [
    { "title": "Introduction", "timestamp": "00:00", "timestampMs": 0 },
    { "title": "Main Discussion", "timestamp": "02:30", "timestampMs": 150000 },
    { "title": "Conclusion", "timestamp": "06:00", "timestampMs": 360000 }
  ],
  "topics": ["AI", "Technology", "Podcasting"]
}
```

---

## GET /api/episodes/:id/transcript/search

Search within an episode transcript.

**Headers:** `Authorization: Bearer TOKEN` (optional)

**Query Parameters:**
- `q` (required): Search query (1-200 characters)

**Response:** `200 OK`

```json
{
  "episodeId": "ep_abc123",
  "query": "artificial intelligence",
  "matches": [
    {
      "segmentId": "seg_005",
      "speaker": "Host 1",
      "text": "...discussing artificial intelligence and its implications...",
      "timestampMs": 45000,
      "timestamp": "00:45",
      "matchPositions": [[12, 35]]
    }
  ],
  "totalMatches": 3
}
```
