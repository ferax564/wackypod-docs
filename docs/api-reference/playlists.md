---
sidebar_position: 4
title: Playlists
---

# Playlists API

Create and manage playlists to organize your podcast episodes.

## POST /api/playlists

Create a new playlist.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**

```json
{
  "name": "string (required, max 100 chars)",
  "description": "string (optional, max 500 chars)"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "playlist": {
    "id": "pl_abc123",
    "name": "Daily Tech News",
    "description": "My curated tech podcast episodes",
    "episodeCount": 0,
    "createdAt": "2026-03-29T10:00:00Z"
  }
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/playlists \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Daily Tech News", "description": "My curated tech episodes"}'
```

---

## GET /api/playlists

List all playlists for the authenticated user.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Results per page |
| `offset` | number | 0 | Pagination offset |

**Response:** `200 OK`

```json
{
  "success": true,
  "playlists": [
    {
      "id": "pl_abc123",
      "name": "Daily Tech News",
      "description": "My curated tech episodes",
      "episodeCount": 12,
      "totalDuration": 5040,
      "createdAt": "2026-03-29T10:00:00Z",
      "updatedAt": "2026-03-29T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "offset": 0
  }
}
```

**Example:**

```bash
curl https://api.wackypod.com/api/playlists \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## GET /api/playlists/:id

Get a specific playlist with its episodes.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`

```json
{
  "success": true,
  "playlist": {
    "id": "pl_abc123",
    "name": "Daily Tech News",
    "description": "My curated tech episodes",
    "episodes": [
      {
        "id": "ep_abc123",
        "title": "The Future of AI",
        "audioUrl": "/episodes/ep_abc123.mp3",
        "audioDuration": 420,
        "position": 1
      },
      {
        "id": "ep_def456",
        "title": "Cloud Computing Trends",
        "audioUrl": "/episodes/ep_def456.mp3",
        "audioDuration": 380,
        "position": 2
      }
    ],
    "episodeCount": 2,
    "totalDuration": 800
  }
}
```

---

## PUT /api/playlists/:id

Update a playlist name or description.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "playlist": {
    "id": "pl_abc123",
    "name": "Updated Name",
    "description": "Updated description"
  }
}
```

---

## DELETE /api/playlists/:id

Delete a playlist. Episodes in the playlist are not deleted.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Playlist deleted successfully"
}
```

---

## POST /api/playlists/:id/episodes

Add an episode to a playlist.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**

```json
{
  "episodeId": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Episode added to playlist"
}
```

**Example:**

```bash
curl -X POST https://api.wackypod.com/api/playlists/pl_abc123/episodes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"episodeId": "ep_abc123"}'
```

---

## DELETE /api/playlists/:id/episodes/:episodeId

Remove an episode from a playlist.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Episode removed from playlist"
}
```

---

## PUT /api/playlists/:id/reorder

Reorder episodes within a playlist.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**

```json
{
  "episodeIds": ["ep_def456", "ep_abc123", "ep_ghi789"]
}
```

The array specifies the new order of episodes by their IDs.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Playlist reordered successfully"
}
```
