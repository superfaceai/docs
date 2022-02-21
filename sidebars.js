/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 Create as many sidebars as you want.

 Note:
 When a doc page is mentioned in multiple sidebars, the latter will take precedence
 and will render in the docs.
 */

module.exports = {
  defaultSidebar: [
    {
      type: 'category',
      label: 'Getting started',
      items: [
        { type: 'doc', id: 'index', label: 'Welcome' },
        { type: 'doc', id: 'quickstart', label: 'Quickstart' },
        {
          type: 'category',
          label: 'A tour of Superface',
          collapsed: false,
          link: { type: 'doc', id: 'introduction' },
          items: [
            'how_it_works',
            { type: 'doc', id: 'tour/setup-the-environment' },
            {
              type: 'doc',
              id: 'tour/create-new-capability',
              label: 'Write new use-case',
            },
            {
              type: 'doc',
              id: 'tour/map-capability-to-provider',
              label: 'Write new integration',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: ['guides/using-multiple-providers', 'guides/offline-use'],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Language',
          link: { type: 'doc', id: 'comlink/index' },
          items: [
            'comlink/reference/profile',
            'comlink/reference/map',
            'comlink/reference/provider',
          ],
        },
        {
          type: 'doc',
          label: 'OneSDK for Node.js',
          id: 'reference/one-sdk',
        },
        {
          type: 'doc',
          label: 'super.json',
          id: 'reference/superjson',
        },
      ],
    },
  ],

  /*
  providerAvailabilitySidebar: [
    'guides/find-provider-by-name',
    'guides/add-new-provider',
  ],
  guidesSidebar: [
    'getting-started',
    'integrations-monitoring',
    'guides/api-keys',
    'guides/using-multiple-providers',
    {
      type: 'category',
      label: 'How to create a capability',
      collapsed: true,
      items: [
        { type: 'doc', id: 'guides/how-to-create', label: 'Overview' },
        'guides/setup-the-environment',
        'guides/create-new-capability',
        'guides/add-new-provider',
        'guides/map-capability-to-provider',
        'guides/run-capability',
        'guides/test-capability',
        'guides/publishing',
      ],
    },
  ],
  comlinkReferenceSidebar: [
    {
      type: 'category',
      label: 'Comlink References',
      collapsed: false,
      items: [
        { type: 'doc', id: 'comlink/reference/profile', label: 'Profile' },
        { type: 'doc', id: 'comlink/reference/map', label: 'Map' },
        { type: 'doc', id: 'comlink/reference/provider', label: 'Provider' },
      ],
    },
  ],
  */
};
