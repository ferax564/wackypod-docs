import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guidesSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/authentication',
        'guides/episode-creation',
        'guides/webhooks',
        'guides/rss-feeds',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/chrome-extension',
        'integrations/zapier',
        'integrations/ios-app',
      ],
    },
  ],
  apiSidebar: [
    'api-reference/rest-api',
    {
      type: 'category',
      label: 'Endpoints',
      collapsed: false,
      items: [
        'api-reference/authentication',
        'api-reference/episodes',
        'api-reference/playlists',
        'api-reference/user-profile',
        'api-reference/webhooks',
        'api-reference/rss',
        'api-reference/briefings',
        'api-reference/billing',
      ],
    },
  ],
  sdkSidebar: [
    'sdk/python',
    'sdk/rest-api',
  ],
};

export default sidebars;
