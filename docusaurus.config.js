const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const remarkDeflist = require('remark-deflist');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Superface',
  tagline: 'Superface Docs',
  url: 'https://superface.ai',
  baseUrl: '/docs/',
  organizationName: 'superfaceai',
  projectName: 'docs',

  favicon: '/img/favicon.ico',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  themeConfig: {
    navbar: {
      title: undefined,
      logo: {
        alt: 'Superface Logo',
        src: '/img/superface_logo.svg',
        href: '/',
      },
      style: 'dark',
      items: [
        {
          type: 'doc',
          docId: 'guides/how-to-create',
          position: 'left',
          label: 'Guides',
        },
        {
          to: 'reference',
          position: 'left',
          label: 'Reference',
        },
        {
          to: 'comlink',
          position: 'left',
          label: 'Comlink',
        },
        {
          to: '/dashboard',
          label: 'Go to Dashboard',
          position: 'right',
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
              href: 'mailto:support@superface.ai',
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
        alt: 'Superface Logo',
        src: '/img/superface_logo.svg',
        href: 'https://superface.ai/',
      },
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['hcl'],
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // editUrl:
          //   'https://github.com/superfaceai/docs/edit/main/',
          remarkPlugins: [remarkDeflist],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
