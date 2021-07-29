const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Superface',
  tagline: 'Superface Docs',
  url: 'https://superface.ai',
  baseUrl: '/',
  organizationName: 'superfaceai',
  projectName: 'docs',

  favicon: 'img/favicon.ico',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  themeConfig: {
    navbar: {
      title: undefined,
      logo: {
        alt: 'Superface Logo',
        src: 'img/superface_logo.svg',
        href: '/docs'
      },
      style: "dark",
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'right',
          label: 'Docs',
        },
        {to: '/dashboard', label: 'Go to Dashboard', position: 'right'},
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
        src: 'img/superface_logo.svg',
        href: 'https://superface.ai/',
      },
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/superfaceai/docs/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
