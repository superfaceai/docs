/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 Create as many sidebars as you want.
 */

module.exports = {
  guidesSidebar: [
    {
      type: 'doc',
      id: 'guides-intro',
      label: 'Overview'
    },
    {
      type: 'category',
      label: 'Local Authoring',
      collapsed: false,
      items: [
        'guides/setup-the-environment',
        'guides/create-new-profile',
        'guides/add-new-provider',
        'guides/map-capability-to-provider',
      ]
    },
  ],
  providerAvailabilitySidebar: [
    'guides/find-provider-by-name',
    'guides/add-new-provider',
  ],
};
