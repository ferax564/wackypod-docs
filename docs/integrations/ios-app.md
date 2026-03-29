---
sidebar_position: 3
title: iOS App
---

# iOS App

WackyPod includes a native iOS app built with SwiftUI, supporting both cloud-based and fully on-device podcast generation.

## Key features

- **Server-side generation** -- Create episodes using the full WackyPod cloud pipeline (Gemini + Modal TTS)
- **On-device LLM** -- Generate podcast scripts offline using Qwen3 1.7B via llama.cpp
- **On-device TTS** -- Synthesize speech locally using Kokoro-82M CoreML on the Apple Neural Engine
- **Fully offline mode** -- Text to script to audio with zero network required
- **Background audio** -- Lock screen controls and media session integration
- **Share Extension** -- Share URLs from Safari directly to WackyPod
- **Playlists** -- Organize episodes into playlists
- **RSS feed** -- Copy your RSS feed URL from Settings to subscribe in any podcast app

## Requirements

- iOS 18.0 or later
- iPhone 13 or later recommended (for on-device AI performance)

## Generation modes

### Server mode (default)

Uses the WackyPod cloud infrastructure:

1. Text or URL is sent to the Vercel backend
2. Gemini 2.5 Flash generates the podcast script
3. Modal (Kokoro or Chatterbox) synthesizes the audio
4. Audio streams back to the device

Best for: High-quality results, longer episodes, multi-speaker conversations.

### On-device mode (fully offline)

Runs entirely on your device:

1. Text is processed by the on-device LLM (Qwen3 1.7B Q4_K_M, ~1.2 GB download)
2. The generated script is synthesized by Kokoro-82M CoreML (~330 MB download)
3. Audio is saved locally and played immediately

Best for: Privacy-sensitive content, offline use, quick generation.

**On-device model requirements:**

| Component | Model | Download Size | Peak RAM |
|-----------|-------|--------------|----------|
| LLM | Qwen3 1.7B Q4_K_M | ~1.2 GB | ~2 GB |
| TTS | Kokoro-82M CoreML | ~330 MB | ~1.5 GB |

Models are downloaded on first use from HuggingFace and cached locally. The app uses the `increased-memory-limit` entitlement for LLM inference.

## Architecture

```
SwiftUI Views (Login, Episodes, Create, Settings, Player)
       |
ViewModels (MVVM pattern)
       |
Services
  |-- APIClient (Vercel backend, JWT auth, token refresh)
  |-- OnDeviceLLM (llama.cpp, GGUF models)
  |-- TTSService (server routing + on-device Kokoro CoreML)
  |-- AudioPlayerService (playback, lock screen controls)
```

## Authentication

- JWT tokens stored securely in iOS Keychain (via KeychainAccess)
- Automatic token refresh on 401 responses
- Backend: `https://wacky-pod.vercel.app/api/`

## Features

### Episode creation
- Text input, URL input, or file upload (PDF, DOCX, TXT, MD)
- Preset selection (Quick, Standard, Deep, Extended)
- Host mode selection (Single, Multi)
- TTS engine selection (Kokoro, Chatterbox)
- On-device generation toggle

### Episode playback
- Built-in audio player with progress bar
- Lock screen controls
- Background audio support
- Duration display in MM:SS format

### Playlists
- Create, rename, and delete playlists
- Add/remove episodes from playlists
- Reorder episodes within playlists

### Settings
- Account information and tier display
- RSS feed URL (copy/share)
- On-device model management (download/delete)
- Logout

### Share Extension
- Share URLs from Safari or any app
- Configures preset and host mode in the share sheet
- Creates episode automatically

## Building from source

```bash
# Prerequisites
brew install xcodegen

# Generate Xcode project
cd ios/
xcodegen generate

# Build for simulator
xcodebuild -project WackyPod.xcodeproj \
  -scheme WackyPod \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  build -skipMacroValidation
```

**Build requirements:**
- Xcode 26.2+ with iOS 26 SDK
- C++ interop: `CLANG_CXX_LANGUAGE_STANDARD: c++17`
- Build flag: `-skipMacroValidation` (for LocalLLMClient macros)

## Memory management

The app monitors memory pressure and manages models accordingly:
- Pre-load memory check (refuses model load if RSS > 1 GB)
- Auto-unloads models under memory pressure
- 15,000 character input limit for on-device TTS
- `increased-memory-limit` entitlement for LLM inference (~3 GB peak)

## TestFlight

The app is available on TestFlight. Contact [email protected] for access.
