---
sidebar_position: 1
slug: /intro
title: Getting Started
---

# Getting Started with WackyPod

WackyPod is an AI-powered text-to-podcast platform that transforms any content into professional-quality podcasts. Feed it a URL, paste text, or upload a document, and WackyPod generates a natural-sounding podcast episode complete with script generation, multi-speaker dialogue, and studio-quality audio.

## What you can do with WackyPod

- **Convert articles to podcasts** -- Paste a URL and get a polished podcast episode in minutes
- **Generate from text or files** -- Supports plain text, PDF, DOCX, TXT, and Markdown
- **Choose your format** -- Single narrator or multi-speaker conversational dialogue
- **Pick a duration** -- Quick (3 min), Standard (7 min), Deep (15 min), or Extended (30 min)
- **Automate with the API** -- Build podcast pipelines with the REST API or Python SDK
- **Set up daily briefings** -- Automated podcast generation from RSS feeds and newsletters

## Quick start

### 1. Create an account

```bash
curl -X POST https://api.wackypod.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "[email protected]",
    "password": "SecurePass123!",
    "name": "Your Name"
  }'
```

Save the `accessToken` from the response -- you will need it for all subsequent API calls.

### 2. Create your first episode

```bash
curl -X POST https://api.wackypod.com/api/episodes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "url": "https://example.com/article",
    "preset": "standard",
    "hostMode": "multi",
    "voiceStyle": "professional"
  }'
```

### 3. Check the status

```bash
curl https://api.wackypod.com/api/episodes/EPISODE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

The episode progresses through these statuses:
1. `queued` -- Episode created, waiting to process
2. `ingesting` -- Fetching and parsing content
3. `generating_script` -- AI writing the podcast script
4. `generating_audio` -- Text-to-speech synthesis
5. `ready` -- Episode complete, audio available

Processing typically takes 2-3 minutes for a standard episode.

## Ways to use WackyPod

| Method | Best for |
|--------|----------|
| [REST API](/docs/api-reference/rest-api) | Server-to-server integrations, custom workflows |
| [Python SDK](/docs/sdk/python) | Python applications, scripts, data pipelines |
| [Chrome Extension](/docs/integrations/chrome-extension) | Converting web articles while browsing |
| [iOS App](/docs/integrations/ios-app) | Mobile podcast creation with on-device AI |
| [Zapier](/docs/integrations/zapier) | No-code automation with 5,000+ apps |
| Web App | Browser-based creation at [wackypod.com](https://wackypod.com) |

## Pricing tiers

| Tier | Price | Episodes/month | Max Duration |
|------|-------|----------------|--------------|
| **Free** | $0 | 3 | 3 min |
| **Creator** | $12/mo | 25 | 15 min |
| **Professional** | $49/mo | 100 | 30 min |
| **Enterprise** | $399/mo | Unlimited | Unlimited |

API key access requires Creator tier or higher.

## Next steps

- [Authentication guide](/docs/guides/authentication) -- Set up API keys and manage tokens
- [Episode creation guide](/docs/guides/episode-creation) -- Explore all episode options
- [API reference](/docs/api-reference/rest-api) -- Full endpoint documentation
- [Python SDK](/docs/sdk/python) -- Get started with the SDK
