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

const guides = {
  type: 'category',
  label: 'Guides',
  collapsed: false,
  items: [
    {
      type: 'category',
      label: 'How to integrate new API',
      link: { type: 'doc', id: 'guides/how-to-create' },
      collapsed: true,
      items: [
        'guides/setup-the-environment',
        'guides/create-new-use-case',
        'guides/add-new-provider',
        'guides/map-use-case-to-provider',
        'guides/run-use-case',
        'guides/test-use-case',
        'guides/publishing',
        'guides/interactive-designer',
      ],
    },
    {
      type: 'category',
      label: 'Working with providers',
      collapsed: true,
      items: [
        'guides/find-provider-by-name',
        'guides/add-new-provider',
        'guides/using-multiple-providers',
      ],
    },
    'guides/api-keys',
    'guides/integrations-monitoring',
  ],
};

module.exports = {
  mainSidebar: [
    'introduction',
    'how-superface-works',
    'getting-started',
    'advanced-usage',
    guides,
    'verification',
    {
      type: 'category',
      label: 'Upgrade guides',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'upgrade/one-sdk-v2',
          label: 'OneSDK v2.0',
        },
      ],
    },
  ],
  referenceSidebar: [
    'reference/index',
    'reference/one-sdk',
    'reference/superjson',
    {
      type: 'category',
      label: 'Comlink',
      link: { type: 'doc', id: 'comlink/index' },
      collapsed: true,
      items: [
        { type: 'doc', id: 'comlink/reference/profile', label: 'Profile' },
        { type: 'doc', id: 'comlink/reference/map', label: 'Map' },
        { type: 'doc', id: 'comlink/reference/provider', label: 'Provider' },
        { type: 'doc', id: 'comlink/reference/binary_data', label: 'Binary Data' },
        { type: 'doc', id: 'comlink/specifications', label: 'Specifications' },
      ],
    },
    'reference/glossary',
  ],
};
