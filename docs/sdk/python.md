---
sidebar_position: 1
title: Python SDK
---

# Python SDK

The official Python SDK for WackyPod. Transform any content into professional-quality podcasts with a few lines of code.

```bash
pip install wackypod
```

**Requirements:** Python 3.8+ and [requests](https://pypi.org/project/requests/) >= 2.28.0

## Quick start

```python
from wackypod import WackyPod

# Initialize with your API key
client = WackyPod(api_key="wp_your_api_key")

# Create a podcast from a URL
episode = client.episodes.create(
    input_type="url",
    input_source="https://example.com/article",
    preset="standard"
)
print(f"Episode created: {episode.id}")

# Wait for completion (polls automatically)
episode = client.episodes.wait_for_completion(episode.id)
print(f"Title: {episode.title}")
print(f"Audio: {episode.audio_url}")
print(f"Duration: {episode.audio_duration_seconds}s")
```

## Client initialization

```python
client = WackyPod(
    api_key="wp_your_api_key",             # Required
    base_url="https://api.wackypod.com",   # Optional, default shown
    timeout=30                              # Optional, request timeout in seconds
)
```

Get your API key from [wackypod.com/settings/api](https://wackypod.com/settings/api). Requires Creator tier or higher.

## Episodes

### Create an episode

```python
# From a URL
episode = client.episodes.create(
    input_type="url",
    input_source="https://example.com/article",
    preset="standard",       # quick, standard, deep, extended
    host_mode="multi",       # single, multi
    voice_style="casual"     # professional, casual, educational, enthusiastic
)

# From text
episode = client.episodes.create(
    input_type="text",
    input_source="Your article content goes here...",
    preset="quick"
)
```

### Get an episode

```python
episode = client.episodes.get("ep_abc123")
print(f"Status: {episode.status}")
print(f"Title: {episode.title}")
```

### List episodes

```python
episodes = client.episodes.list(
    status="ready",    # Optional filter
    limit=10,          # Default: 50
    offset=0           # Default: 0
)
for ep in episodes:
    print(f"{ep.title} - {ep.audio_duration_seconds}s")
```

### Wait for completion

```python
# Polls until episode is ready (or timeout)
episode = client.episodes.wait_for_completion(
    "ep_abc123",
    timeout=300,         # Max wait time in seconds (default: 300)
    poll_interval=5      # Seconds between polls (default: 5)
)
```

### Delete an episode

```python
client.episodes.delete("ep_abc123")
```

## Webhooks

### Create a webhook

```python
webhook = client.webhooks.create(
    url="https://your-server.com/webhooks/wackypod",
    events=["episode.completed", "episode.failed"],
    description="Production webhook"
)
print(f"Webhook ID: {webhook.id}")
print(f"Secret: {webhook.secret}")  # Save this!
```

### List webhooks

```python
webhooks = client.webhooks.list()
for wh in webhooks:
    print(f"{wh.id}: {wh.url} ({', '.join(wh.events)})")
```

### Update a webhook

```python
client.webhooks.update(
    "wh_abc123",
    events=["episode.completed"],
    is_active=True
)
```

### Test a webhook

```python
result = client.webhooks.test("wh_abc123")
print(f"Status code: {result.status_code}")
```

### View delivery history

```python
deliveries = client.webhooks.get_deliveries("wh_abc123")
for d in deliveries:
    status = "OK" if d.success else "FAILED"
    print(f"{d.event}: {status} ({d.duration}ms)")
```

### Delete a webhook

```python
client.webhooks.delete("wh_abc123")
```

## Users

### Get profile

```python
profile = client.users.get_profile()
print(f"Name: {profile.name}")
print(f"Tier: {profile.tier}")
print(f"Email: {profile.email}")
```

### Get quota

```python
quota = client.users.get_quota()
print(f"Used: {quota.episodes_used}/{quota.episodes_limit}")
print(f"Remaining: {quota.episodes_remaining}")
print(f"Usage: {quota.quota_percentage}%")
```

## Error handling

The SDK raises typed exceptions for different error categories:

```python
from wackypod import (
    WackyPodError,         # Base exception
    AuthenticationError,   # Invalid API key (401)
    ValidationError,       # Bad request data (400)
    NotFoundError,         # Resource not found (404)
    RateLimitError,        # Rate limit exceeded (429)
    ServerError,           # Server error (5xx)
)

try:
    episode = client.episodes.create(
        input_type="url",
        input_source="https://example.com/article"
    )
except AuthenticationError:
    print("Invalid API key. Check your credentials.")
except RateLimitError as e:
    print(f"Rate limited. Try again later.")
except ValidationError as e:
    print(f"Invalid request: {e.message}")
except ServerError:
    print("Server error. Try again later.")
except WackyPodError as e:
    print(f"Unexpected error: {e}")
```

## Response models

The SDK returns typed dataclass objects for IDE autocompletion:

### Episode

```python
episode.id                    # str
episode.title                 # str
episode.description           # str
episode.status                # str: queued, ingesting, generating_script, etc.
episode.preset                # str: quick, standard, deep, extended
episode.host_mode             # str: single, multi
episode.audio_url             # str (when ready)
episode.audio_duration_seconds # int (when ready)
episode.created_at            # str (ISO 8601)
```

### Webhook

```python
webhook.id          # str
webhook.url         # str
webhook.events      # list[str]
webhook.secret      # str (only on creation)
webhook.is_active   # bool
webhook.created_at  # str
```

### User

```python
user.id             # str
user.email          # str
user.name           # str
user.tier           # str: free, creator, professional, enterprise
user.email_verified # bool
```

## Complete example

```python
from wackypod import WackyPod, RateLimitError
import time

client = WackyPod(api_key="wp_your_key")

# Check quota first
quota = client.users.get_quota()
if quota.episodes_remaining <= 0:
    print("No episodes remaining this month")
    exit()

# Create episode
try:
    episode = client.episodes.create(
        input_type="url",
        input_source="https://example.com/interesting-article",
        preset="standard",
        host_mode="multi",
        voice_style="casual"
    )
    print(f"Created: {episode.id}")

    # Wait for it to finish
    episode = client.episodes.wait_for_completion(episode.id, timeout=600)
    print(f"Title: {episode.title}")
    print(f"Audio: {episode.audio_url}")
    print(f"Duration: {episode.audio_duration_seconds}s")

except RateLimitError:
    print("Rate limited -- waiting and retrying...")
    time.sleep(60)

# List all ready episodes
episodes = client.episodes.list(status="ready")
print(f"\nYou have {len(episodes)} ready episodes:")
for ep in episodes:
    print(f"  - {ep.title} ({ep.audio_duration_seconds}s)")
```

## PyPI

- **Package:** [wackypod on PyPI](https://pypi.org/project/wackypod/)
- **Source:** [GitHub](https://github.com/aferrarelli/WackyPod/tree/main/sdks/python)
- **License:** MIT
