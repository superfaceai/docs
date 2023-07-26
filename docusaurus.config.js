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

  scripts: [
    {
      src: '/docs/crisp.js',
      'crisp-website-id': process.env.CRISP_WEBSITE_ID || '',
      defer: true,
    }
  ],

  themeConfig: {
    navbar: {
      title: undefined,
      logo: {
        alt: 'Superface',
        src: 'img/superface_logo.svg',
        href: 'http://superface.ai',
      },
      style: 'dark',
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'doc',
          docId: 'classic/index',
          label: 'Classic Docs',
          position: 'right',
        },
        {
          type: 'doc',
          docId: 'classic/reference/index',
          position: 'right',
          label: 'Classic Reference',
        },
        {
          href: 'https://github.com/orgs/superfaceai/discussions',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub Discussions',
        },
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
        src: 'img/superface_logo.svg',
        href: 'https://superface.ai/',
      },
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['hcl'],
    },

    algolia: {
      appId: 'RQ4GPZIHBP',
      apiKey: '6efca96741656c108c8746f7f2aa3da1',
      indexName: 'production',
      contextualSearch: false,
    },
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
