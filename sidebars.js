/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 Create as many sidebars as you want.
 */

module.exports = {
  guidesSidebar: [
    // {
    //   type: 'doc',
    //   id: 'guides-intro',
    //   label: 'Overview'
    // },
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
        // 'guides/create-new-profile', Uncomment this once the page si ready
        'guides/create-new-capability',
        'guides/add-new-provider',
        'guides/map-capability-to-provider',
        'guides/run-capability',
        'guides/test-capability',
        'guides/publishing',
      ],
    },
  ],
  providerAvailabilitySidebar: [
    'guides/find-provider-by-name',
    'guides/add-new-provider',
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
};
