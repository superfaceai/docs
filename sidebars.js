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
      ]
    },
  ],
  tutorialSidebar: [
    'tutorial-intro',
    {
      type: 'category',
      label: 'Tutorial — Basics',
      items: [
        'tutorial-basics/create-a-page',
        'tutorial-basics/create-a-document',
        'tutorial-basics/create-a-blog-post',
        'tutorial-basics/markdown-features',
        'tutorial-basics/deploy-your-site',
        'tutorial-basics/congratulations',
      ]
    },
    {
      type: 'category',
      label: 'Tutorial — Extras',
      items: [
        'tutorial-extras/manage-docs-versions',
        'tutorial-extras/translate-your-site',
      ]
    }
  ],
};
