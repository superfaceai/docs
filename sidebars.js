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
    {
      type: 'category',
      label: 'How to create a capability',
      collapsed: false,
      items: [
        { type: 'doc', id: 'guides/how-to-create', label: 'Overview' },
        'guides/setup-the-environment',
        // 'guides/create-new-profile', Uncomment this once the page si ready
        'guides/create-new-capability',
        'guides/add-new-provider',
        'guides/map-capability-to-provider',
        'guides/test-capability',
        'guides/use-in-app',
      ],
    },
  ],
  providerAvailabilitySidebar: [
    'guides/find-provider-by-name',
    'guides/add-new-provider',
  ],
};
