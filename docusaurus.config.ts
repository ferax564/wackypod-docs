import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WackyPod Docs',
  tagline: 'API reference and guides for WackyPod',
  favicon: 'img/favicon.ico',

  url: 'https://docs.wackypod.com',
  baseUrl: '/',

  organizationName: 'wackypod',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/aferrarelli/WackyPod/tree/main/docs-site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WackyPod',
      logo: {
        alt: 'WackyPod Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sdkSidebar',
          position: 'left',
          label: 'SDKs',
        },
        {
          href: 'https://wackypod.com',
          label: 'WackyPod',
          position: 'right',
        },
        {
          href: 'https://github.com/aferrarelli/WackyPod',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/rest-api',
            },
            {
              label: 'Python SDK',
              to: '/docs/sdk/python',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'WackyPod App',
              href: 'https://wackypod.com',
            },
            {
              label: 'Pricing',
              href: 'https://wackypod.com/pricing',
            },
            {
              label: 'Chrome Extension',
              href: 'https://chrome.google.com/webstore',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/aferrarelli/WackyPod',
            },
            {
              label: 'Issues',
              href: 'https://github.com/aferrarelli/WackyPod/issues',
            },
            {
              label: 'Contact',
              href: 'mailto:[email protected]',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} WackyPod. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
