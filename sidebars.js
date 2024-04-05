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
  label: 'Advanced Development',
  collapsed: true,
  link: {
    type: 'generated-index',
    title: 'Advanced Development',
    description: 'Want to dig deep into Superface tool development and the concepts? This is where you need to start.',
    slug: '/docs/advanced-development',
    keywords: ['advanced']
  },
  items: [
    'guides/how-to-create',
    'guides/setup-the-environment',
    {
      type: 'category',
      label: 'CLI',
      collapsed: false,
      items: [
        'guides/editing-provider-files',
        'guides/setting-security-schemes',
        'guides/comlink-profile-multiple-providers',
        'guides/api-keys',
      ]
    },

    {
      type: 'category',
      label: 'OneSDK',
      collapsed: false,
      items: [
        'introduction/quick-start-sdk',
        'guides/integrate-onesdk',
        'guides/debugging-onesdk',
        'guides/test-use-case',
        'guides/using-multiple-providers',
      ]
    }
  ]
};

const classicGuides = {
  type: 'category',
  label: 'Guides',
  collapsed: false,
  items: [
    {
      type: 'category',
      label: 'How to integrate new API',
      link: { type: 'doc', id: 'classic/guides/how-to-create' },
      collapsed: true,
      items: [
        'classic/guides/setup-the-environment',
        'classic/guides/create-new-use-case',
        'classic/guides/add-new-provider',
        'classic/guides/map-use-case-to-provider',
        'classic/guides/run-use-case',
        'classic/guides/test-use-case',
        'classic/guides/publishing',
        'classic/guides/interactive-designer',
      ],
    },
    {
      type: 'category',
      label: 'Working with providers',
      collapsed: true,
      items: [
        'classic/guides/find-provider-by-name',
        'classic/guides/add-new-provider',
        'classic/guides/using-multiple-providers',
      ],
    },
    'classic/guides/api-keys',
    'classic/guides/integrations-monitoring',
  ],
};

module.exports = {
  mainSidebar: [
    {
      type: 'doc',
      label: 'Introduction',
      id: 'introduction'
    },
    {
      type: 'doc',
      label: 'Start here',
      id: 'gpts/first-time-users'
    },
    {
      type: 'category',
      label: 'Connect GPTs to APIs',
      link: {type: 'doc', id: 'gpts/index'},
      collapsed: false,
      items: [
        'gpts/setup',
        'gpts/user-authentication',
        'gpts/limits'
      ]
    },
    {
      type: 'category',
      label: 'Hub API',
      collapsed: false,
      items: [
        'api/index',
        'api/authentication',
        'api/endpoints',
        'api/sessions',
        {
          type: 'category',
          label: 'Examples',
          link: {type: 'doc', id: 'api/examples/index'},
          collapsed: false,
          items: [
            'api/examples/openai',
            'api/examples/mistral',
            'api/examples/langchain',
            'api/examples/anthropic',
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Managing Tools',
      link: {type: 'doc', id: 'tools/index'},
      collapsed: false,
      items: [
        'tools/adding-tools',
        'tools/create-tools',
        'tools/editing-tools',
        {
          type: 'category',
          label: 'Tools',
          link: {type: 'doc', id: 'tools/available-tools'},
          collapsed: true,
          items: [
            'tools/affinity',
            'tools/ares',
            'tools/github',
            'tools/google-calendar',
            'tools/google-drive',
            'tools/google-mail',
            'tools/google-search',
            'tools/google-sheets',
            'tools/greenhouse',
            'tools/hubspot',
            'tools/ibm-nlu',
            'tools/infobip',
            'tools/jira',
            'tools/marketstack',
            'tools/microsoft-calendar',
            'tools/microsoft-teams',
            'tools/mixpanel',
            'tools/notion',
            'tools/open-weather-map',
            'tools/pipedrive',
            'tools/posthog',
            'tools/resend',
            'tools/salesforce',
            'tools/slack',
            'tools/todoist',
            'tools/weather-api',
            'tools/world-time-api',
            'tools/wttr-in',
            'tools/x',
            'tools/zendesk'
          ]
        }
      ]
    },
    {
      type: 'doc',
      label: 'Superface GPT',
      id: 'superface-gpt'
    },
    {
      type: 'category',
      label: 'Superface Agent',
      link: {type: 'doc', id: 'agent/index'},
      collapsed: true,
      items: [
        'agent/interface',
        // 'agent/adding-tools',
        // 'agent/configure-providers',
        // 'agent/updating-tools',
        'agent/changing-models',
        'agent/custom-instructions',
        'agent/scheduling-tasks'
      ]
    },
    {
      type: 'doc',
      id: 'support',
      label: 'Support'
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
  classicReferenceSidebar: [
    'classic/reference/index',
    'classic/reference/one-sdk',
    'classic/reference/superjson',
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
    'classic/reference/glossary',
  ],
  classicSidebar: [
    'classic/index',
    'classic/how-superface-works',
    'classic/getting-started',
    'classic/advanced-usage',
    classicGuides,
    'classic/verification',
    {
      type: 'category',
      label: 'Upgrade guides',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'classic/upgrade/one-sdk-v2',
          label: 'OneSDK v2.0',
        },
      ],
    }
  ]
};
