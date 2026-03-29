---
sidebar_position: 2
title: Episode Creation
---

# Episode Creation Guide

This guide covers all the ways to create podcast episodes with WackyPod, including content sources, presets, voice options, and real-time progress streaming.

## Content sources

WackyPod accepts three types of input:

### URL input

Provide a URL and WackyPod will fetch, parse, and convert the content:

```bash
curl -X POST https://api.wackypod.com/api/episodes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article",
    "preset": "standard"
  }'
```

Supported content: articles, blog posts, documentation pages, news stories, and most text-heavy web pages.

### Text input

Provide raw text content directly:

```bash
curl -X POST https://api.wackypod.com/api/episodes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your article or content text goes here. WackyPod will generate a podcast script from this text and synthesize professional audio.",
    "preset": "standard"
  }'
```

### File upload

Upload a document file (PDF, DOCX, TXT, or MD):

```bash
curl -X POST https://api.wackypod.com/api/episodes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf" \
  -F "preset=standard" \
  -F "hostMode=multi"
```

**File size limits by tier:**

| Tier | Max File Size |
|------|--------------|
| Free | 5 MB |
| Creator | 20 MB |
| Professional | 50 MB |
| Enterprise | 100 MB |

## Presets

Presets control episode duration and depth:

| Preset | Duration | Description | Availability |
|--------|----------|-------------|--------------|
| `quick` | ~3 min | Brief summary, key points | All tiers |
| `standard` | ~7 min | Balanced overview | Creator+ |
| `deep` | ~15 min | Thorough exploration | Creator+ |
| `extended` | ~30 min | Comprehensive deep-dive | Professional+ |

```json
{
  "content": "...",
  "preset": "deep"
}
```

## Host modes

Choose between a single narrator or a conversational format:

### Single host

One narrator presents the content in a structured monologue:

```json
{
  "content": "...",
  "hostMode": "single"
}
```

### Multi-host

Two speakers discuss the content in a natural conversational format:

```json
{
  "content": "...",
  "hostMode": "multi",
  "voicePair": "expert-curious"
}
```

**Voice pair options for multi-host:**

| Voice Pair | Description |
|------------|-------------|
| `expert-curious` | One knowledgeable host explains, the other asks questions |
| `debate` | Two hosts present different perspectives |
| `interview` | Interview-style with host and guest |

## Voice styles

Control the personality and tone of the narration:

| Style | Description |
|-------|-------------|
| `professional` | Clear, authoritative, news-anchor quality |
| `casual` | Relaxed, conversational, podcast-native |
| `educational` | Patient, explanatory, teacher-like |
| `enthusiastic` | Energetic, engaging, startup-pitch energy |

```json
{
  "content": "...",
  "voiceStyle": "casual"
}
```

:::info
Free tier users are limited to `professional` voice style and `single` host mode.
:::

## TTS engine selection

WackyPod offers multiple text-to-speech engines:

| Engine | Quality | Speed | Cost |
|--------|---------|-------|------|
| `kokoro` | High | Fast | $0.001/episode |
| `chatterbox` | Premium | Moderate | $0.005/episode |
| `auto` | Varies | Varies | Varies |

In `auto` mode, free tier users get Kokoro and paid tier users get Chatterbox.

```json
{
  "content": "...",
  "ttsEngine": "chatterbox"
}
```

## Script review

For greater control, you can pause the pipeline after script generation to review and edit the script before audio synthesis:

```json
{
  "content": "...",
  "reviewScript": true
}
```

The episode will enter `review_script` status. You can then:

1. **Get the script:** `GET /api/episodes/:id` -- the `scriptText` field contains the generated script
2. **Edit and approve:** `PUT /api/episodes/:id/script` with your changes
3. **Audio generation resumes** automatically after approval

## SSE progress streaming

Monitor episode generation in real-time using Server-Sent Events:

```javascript
const eventSource = new EventSource(
  `https://api.wackypod.com/api/episodes/${episodeId}/stream`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`Status: ${data.status}, Progress: ${data.progressPercent}%`);

  if (data.status === 'ready') {
    console.log(`Audio URL: ${data.audioUrl}`);
    eventSource.close();
  }

  if (data.status === 'error') {
    console.error(`Error: ${data.error}`);
    eventSource.close();
  }
};
```

## Generation flow

The full episode generation pipeline:

```
1. Content Ingestion
   URL fetch / text parse / file extract
   |
2. Script Generation (Gemini 2.5 Flash)
   Content --> structured podcast script
   |
3. [Optional] Script Review
   Pause for user edits
   |
4. Audio Synthesis (Modal GPU)
   Script --> Kokoro or Chatterbox TTS
   |
5. Storage (Cloudflare R2)
   Audio uploaded, CDN URL generated
   |
6. Ready
   Episode available for playback
```

## Python SDK example

```python
from wackypod import WackyPod

client = WackyPod(api_key="wp_your_key")

# Create from URL
episode = client.episodes.create(
    input_type="url",
    input_source="https://example.com/article",
    preset="standard",
    host_mode="multi",
    voice_style="casual"
)

# Wait for completion (polls automatically)
episode = client.episodes.wait_for_completion(
    episode.id,
    timeout=300,
    poll_interval=5
)

print(f"Title: {episode.title}")
print(f"Audio: {episode.audio_url}")
print(f"Duration: {episode.audio_duration_seconds}s")
```

## Error handling

Common creation errors:

| Error | Cause | Solution |
|-------|-------|----------|
| `Monthly quota exceeded` | Tier limit reached | Upgrade tier or wait for monthly reset |
| `Content too short` | Less than 100 words | Provide more content |
| `Invalid URL` | URL cannot be fetched | Check URL is accessible |
| `File too large` | Exceeds tier file size limit | Compress file or upgrade tier |
| `Unsupported file type` | Not PDF, DOCX, TXT, or MD | Convert to a supported format |
