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
    },
  ],

  themeConfig: {
    navbar: {
      title: undefined,
      logo: {
        alt: 'Superface',
        src: 'img/superface_logo.svg',
        href: '/',
      },
      style: 'dark',
      items: [
        {
          type: 'doc',
          docId: 'getting-started',
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
        {
          href: 'https://github.com/superfaceai/docs',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
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
