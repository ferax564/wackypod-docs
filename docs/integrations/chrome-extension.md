---
sidebar_position: 1
title: Chrome Extension
---

# Chrome Extension

Turn any webpage into a professional podcast in one click. The WackyPod Chrome Extension converts articles, blog posts, and web content into AI-generated podcasts directly from your browser.

## Features

- **One-click conversion** -- Transform any article into a podcast with a single click
- **Smart content extraction** -- Automatically extracts clean content from web pages using Mozilla Readability
- **Multiple durations** -- Quick (3 min), Standard (7 min), Deep (15 min), Extended (30 min)
- **Voice options** -- Single narrator or conversational multi-speaker dialogue
- **In-browser playback** -- Listen without leaving the extension popup
- **Download support** -- Save episodes as MP3 files for offline listening
- **Account sync** -- All episodes sync to your WackyPod account
- **Quota tracking** -- Monitor your monthly usage in the extension footer

## Installation

### From source (development)

```bash
# Clone the repository
git clone https://github.com/aferrarelli/WackyPod.git
cd WackyPod/chrome-extension

# Install dependencies
npm install

# Build the extension
npm run build
```

Then load in Chrome:
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension/dist` folder

### From Chrome Web Store

Coming soon.

## Usage

### Getting started

1. **Sign in** -- Click the WackyPod extension icon and enter your WackyPod credentials
2. **Navigate to content** -- Go to any article, blog post, or content page
3. **Configure** -- Choose duration preset, voice style, and host mode
4. **Generate** -- Click "Generate Podcast" and wait 2-3 minutes
5. **Listen** -- Play the podcast in the extension popup or download the MP3

### Supported websites

The extension works on most content-rich websites:

- News sites (TechCrunch, The Verge, BBC, etc.)
- Blog platforms (Medium, WordPress, Ghost, Substack)
- Documentation sites
- Academic papers
- Long-form articles

The page must have at least 100 words of content for extraction to work.

## Architecture

The extension uses Manifest V3 and consists of four components:

```
Content Script (extracts page content)
       |
Background Service Worker (API calls, auth, polling)
       |
Popup UI (React, main user interface)
       |
Chrome Storage (tokens, settings)
```

- **Content Script** -- Runs on every page, uses Readability.js to extract article content
- **Background Worker** -- Handles WackyPod API communication, token management, and episode status polling
- **Popup UI** -- React-based interface for episode creation and playback
- **Options Page** -- Settings configuration (default preset, voice style, etc.)

## Configuration

Default settings can be changed in the extension options page:

| Setting | Default | Options |
|---------|---------|---------|
| Default preset | `standard` | quick, standard, deep, extended |
| Default voice | `professional` | professional, casual, educational, enthusiastic |
| Default host mode | `single` | single, multi |
| Auto-play | `true` | true, false |
| Notifications | `true` | true, false |

## Technology stack

- React 18 with TypeScript
- Tailwind CSS
- Webpack bundler
- Chrome Extension Manifest V3
- Mozilla Readability for content extraction

## Troubleshooting

### "Could not extract content from this page"
- Ensure the page has at least 100 words of content
- Try refreshing the page first
- Some dynamically-loaded content (heavy SPA pages) may not be extractable

### "Login failed" or "Not authenticated"
- Verify your credentials at [wackypod.com](https://wackypod.com)
- Clear extension data: Right-click icon > Options > Clear All Data
- Reinstall the extension

### Episode stuck on "Generating..."
- Check your internet connection
- Close and reopen the extension popup
- Check episode status on the web app
- Episodes typically complete in 2-3 minutes

### "Monthly quota exceeded"
- Wait until next month (quotas reset on the 1st)
- Upgrade your tier at [wackypod.com/pricing](https://wackypod.com/pricing)

## Permissions

The extension requests minimal permissions:

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access current page content when you click the extension |
| `storage` | Store authentication tokens and settings locally |
| `notifications` | Show desktop notifications when podcasts are ready |

The extension does not track browsing activity.
