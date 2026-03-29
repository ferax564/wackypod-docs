---
sidebar_position: 2
title: Zapier
---

# Zapier Integration

Connect WackyPod to 5,000+ apps using Zapier. Automate podcast creation, receive notifications, and build content pipelines without writing code.

## Available actions

### Triggers (when this happens...)

| Trigger | Description |
|---------|-------------|
| **Episode Completed** | Fires when an episode finishes processing successfully |
| **Episode Failed** | Fires when an episode fails to process |
| **New Episode** | Fires when a new episode is created |

### Actions (do this...)

| Action | Description |
|--------|-------------|
| **Create Episode** | Create a new podcast episode from a URL or text |

### Searches

| Search | Description |
|--------|-------------|
| **Find Episode** | Find an episode by ID |

## Setup

### Prerequisites

- A WackyPod account (Creator tier or higher for API access)
- A Zapier account

### Authentication

The Zapier integration authenticates using your WackyPod API key:

1. Go to [wackypod.com/settings/api](https://wackypod.com/settings/api) and generate an API key
2. In Zapier, search for "WackyPod" and add it to your Zap
3. When prompted, paste your API key

## Example workflows

### Convert RSS feed articles to podcasts

Automatically create a podcast from every new article in an RSS feed.

**Trigger:** RSS by Zapier -- New Item in Feed
**Action:** WackyPod -- Create Episode

| Field | Value |
|-------|-------|
| Content Type | `url` |
| Content Source | `{{Item URL}}` |
| Preset | `standard` |

### Notify Slack when an episode is ready

Get a Slack message every time a podcast finishes generating.

**Trigger:** WackyPod -- Episode Completed
**Action:** Slack -- Send Channel Message

**Message template:**
```
New episode ready: {{title}}
Duration: {{audio_duration_seconds}} seconds
Listen: {{audio_url}}
```

### Auto-publish to WordPress

Automatically create a blog post with the podcast embedded when an episode completes.

**Trigger:** WackyPod -- Episode Completed
**Action:** WordPress -- Create Post

| Field | Value |
|-------|-------|
| Title | `{{title}}` |
| Content | `{{description}}<br><audio src="{{audio_url}}" controls></audio>` |

### Email notification on failure

Get notified when an episode fails so you can investigate.

**Trigger:** WackyPod -- Episode Failed
**Action:** Gmail -- Send Email

| Field | Value |
|-------|-------|
| To | `[email protected]` |
| Subject | `WackyPod: Episode failed - {{episode_id}}` |
| Body | `Episode {{episode_id}} failed. Error: {{error}}` |

### Daily news podcast pipeline

Combine with a scheduling trigger to create daily podcast summaries.

**Trigger:** Schedule by Zapier -- Every Day at 8 AM
**Action:** WackyPod -- Create Episode

| Field | Value |
|-------|-------|
| Content Type | `url` |
| Content Source | URL of a news aggregator or daily digest |
| Preset | `standard` |
| Host Mode | `multi` |

:::tip
For automated daily briefings with multiple RSS sources, consider using WackyPod's built-in [Briefings feature](/docs/api-reference/briefings) instead of Zapier -- it supports multiple RSS sources, scheduling, and newsletter ingestion natively.
:::

## Testing your Zap

1. In Zapier, create your Zap with the desired trigger and action
2. Use "Test & Review" to send a test event
3. Verify the episode was created in your WackyPod dashboard
4. Turn on your Zap to start automating

## Limitations

- Zapier polls for new triggers periodically (not real-time). For real-time notifications, use [webhooks](/docs/guides/webhooks) directly
- File uploads are not supported through Zapier -- use URL or text input
- API key required (Creator tier or higher)
