const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Superface',
  tagline: 'Superface Docs',
  url: 'https://superface.ai',
  baseUrl: '/docs/',
  organizationName: 'superfaceai',
  projectName: 'docs',

  favicon: 'img/favicon.ico',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: undefined,
      logo: {
        alt: 'Superface',
        src: 'img/sf-logotype-black.svg',
        srcDark: 'img/sf-logotype-white.svg',
        href: 'https://superface.ai',
      },
      
      //style: 'dark',
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: '/blog',
          label: 'Blog',
          position: 'left'
        },
        {
          label: 'Try Superface in ChatGPT',
          href: 'https://chat.openai.com/g/g-XElhtlxOR-superface',
          position: 'right',
          className: 'demo-button-chatgpt', 'aria-label': 'Book a demo'
        },
        {
          label: 'Connect GPTs to APIs',
          href: '/gpt',
          position: 'right',
          className: 'demo-button', 'aria-label': 'Book a demo'
        },
        {
          href: 'https://github.com/orgs/superfaceai/discussions',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub Discussions',
        }
      ],
    },

    footer: {
      style: 'dark',
      links: [
        // Please don't add another link category in footer as it would break the layout
        {
          title: `© ${new Date().getFullYear()} Superface s.r.o.`,
          items: [
            {
              label: 'Support',
              href: '/support',
            },
            {
              label: 'Privacy Policy',
              href: '/privacy-policy',
            },
            {
              label: 'Terms & Conditions',
              href: '/terms-and-conditions',
            },
          ],
        },
      ],
      logo: {
        alt: 'Superface',
        src: 'img/sf-logotype-white.svg',
        href: 'https://superface.ai/',
      },
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['hcl'],
    },

    // algolia: {
    //   appId: 'RQ4GPZIHBP',
    //   apiKey: '6efca96741656c108c8746f7f2aa3da1',
    //   indexName: 'production',
    //   contextualSearch: false,
    // },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/superfaceai/docs/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
