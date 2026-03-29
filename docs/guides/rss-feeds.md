---
sidebar_position: 4
title: RSS Feeds
---

# RSS Feeds Guide

WackyPod automatically generates an RSS feed for your episodes, allowing listeners to subscribe using any podcast app (Apple Podcasts, Spotify, Overcast, Pocket Casts, etc.).

## Your RSS feed URL

Every WackyPod user has a personal podcast RSS feed at:

```
https://api.wackypod.com/api/rss/{userId}
```

Find your user ID in your profile settings or via the API:

```bash
curl https://api.wackypod.com/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Subscribing in podcast apps

### Apple Podcasts

1. Open Apple Podcasts
2. Go to Library > Shows
3. Tap the "+" button and select "Follow a Show by URL"
4. Paste your RSS feed URL

### Spotify

1. Open Spotify
2. Go to Your Library > Podcasts
3. Search for your podcast by name, or use Spotify for Podcasters to submit your RSS feed

### Overcast / Pocket Casts

1. Open the app
2. Tap "Add URL" or "Add by URL"
3. Paste your RSS feed URL

## RSS feed format

The feed follows the standard RSS 2.0 podcast specification:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Podcast Name</title>
    <link>https://wackypod.com</link>
    <description>Your podcast description</description>
    <language>en</language>
    <itunes:author>Your Name</itunes:author>
    <item>
      <title>Episode Title</title>
      <description>Episode description</description>
      <enclosure url="https://cdn.wackypod.com/episodes/ep_abc.mp3"
                 type="audio/mpeg"
                 length="5242880" />
      <pubDate>Sat, 29 Mar 2026 10:00:00 GMT</pubDate>
      <itunes:duration>420</itunes:duration>
    </item>
  </channel>
</rss>
```

## Feed contents

The RSS feed includes:
- All episodes with status `ready`
- Episode title, description, and audio enclosure
- Publication date and duration
- iTunes-compatible metadata for podcast app compatibility

Episodes appear in the feed in reverse chronological order (newest first).

## Accessing the feed

The RSS feed endpoint is public -- no authentication required. This allows podcast apps to fetch it directly.

```bash
# Get the RSS feed as XML
curl https://api.wackypod.com/api/rss/YOUR_USER_ID
```

## iOS app integration

The WackyPod iOS app shows your RSS feed URL in Settings. You can copy or share the URL directly from the app to add it to your preferred podcast player.

## Tips

- **New episodes appear automatically** -- When an episode finishes processing, it is added to your feed within minutes
- **Episode metadata matters** -- Title and description come from the AI-generated script, so longer presets tend to produce richer metadata
- **Share your feed** -- Your RSS URL is your personal podcast channel; share it with anyone to let them subscribe
