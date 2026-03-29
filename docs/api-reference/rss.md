---
sidebar_position: 7
title: RSS
---

# RSS API

Access podcast RSS feeds for subscribing in podcast apps.

## GET /api/rss/:userId

Get the RSS feed for a user's podcast episodes. This is a **public endpoint** -- no authentication required. This allows podcast apps to fetch the feed directly.

**Response:** `200 OK` (Content-Type: application/xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>John's Podcast</title>
    <link>https://wackypod.com</link>
    <description>AI-generated podcasts by John Smith</description>
    <language>en</language>
    <itunes:author>John Smith</itunes:author>
    <atom:link href="https://api.wackypod.com/api/rss/USER_ID"
               rel="self" type="application/rss+xml" />
    <item>
      <title>The Future of AI</title>
      <description>An exploration of artificial intelligence...</description>
      <enclosure url="https://cdn.wackypod.com/episodes/ep_abc123.mp3"
                 type="audio/mpeg"
                 length="5242880" />
      <pubDate>Sat, 29 Mar 2026 10:00:00 GMT</pubDate>
      <itunes:duration>420</itunes:duration>
      <guid isPermaLink="false">ep_abc123</guid>
    </item>
  </channel>
</rss>
```

**Example:**

```bash
curl https://api.wackypod.com/api/rss/550e8400-e29b-41d4-a716-446655440000
```

**Usage:** Copy this URL into any podcast app (Apple Podcasts, Overcast, Pocket Casts, etc.) to subscribe to new episodes automatically.

**Feed contents:**
- Only episodes with status `ready` are included
- Episodes are ordered newest-first
- Includes iTunes-compatible metadata (duration, author)
- Audio enclosures point to the CDN-hosted MP3 files

See the [RSS Feeds guide](/docs/guides/rss-feeds) for instructions on subscribing in various podcast apps.
