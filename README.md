# WackyPod Documentation

The official documentation site for [WackyPod](https://wacky-pod.vercel.app) -- the AI-powered text-to-podcast platform.

**Live site:** [https://docs.wackypod.com](https://docs.wackypod.com)

## About

This documentation site is built with [Docusaurus 3](https://docusaurus.io/), a modern static site generator. It covers everything developers need to integrate with WackyPod, from quickstart guides to full API reference.

## Content Structure

- **Guides** -- Step-by-step tutorials for authentication, episode creation, RSS feeds, and webhooks
- **API Reference** -- Complete REST API documentation covering episodes, billing, playlists, briefings, user profiles, RSS, and webhooks
- **SDKs** -- Python SDK reference and REST API client documentation
- **Integrations** -- Chrome Extension, iOS app, and Zapier integration guides

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

This starts a local development server at `http://localhost:3000` with live reload. Most changes are reflected instantly without needing to restart.

### Build

```bash
npm run build
```

This generates static content in the `build/` directory that can be served by any static hosting provider.

## Deployment

This site is deployed on [Vercel](https://vercel.com). Every push to the `main` branch triggers an automatic production deployment.

Preview deployments are created for pull requests, making it easy to review documentation changes before they go live.

## Contributing

Contributions to the documentation are welcome! Here is how you can help:

1. **Fork** this repository
2. **Create a branch** for your changes (`git checkout -b docs/improve-auth-guide`)
3. **Make your edits** -- documentation lives in the `docs/` directory as Markdown files
4. **Preview locally** with `npm start` to verify your changes look correct
5. **Submit a pull request** with a clear description of what you changed and why

### Writing Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Keep API reference pages consistent with existing format
- Test all code snippets before submitting

## Project Structure

```
docs/                   # Markdown documentation content
  api-reference/        # REST API endpoint documentation
  guides/               # Step-by-step tutorials
  integrations/         # Third-party integration guides
  sdk/                  # SDK reference documentation
src/
  components/           # React components (homepage features)
  css/                  # Custom CSS styles
  pages/                # Custom pages (landing page)
static/                 # Static assets (images, favicon)
docusaurus.config.ts    # Docusaurus configuration
sidebars.ts             # Sidebar navigation structure
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
