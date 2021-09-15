import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using multiple providers

Consuming a single capability from multiple providers is at heart of Superface.
**You can add as many providers as you need for every profile.**
This guide will walk you through the process of configuring these providers the way you need them to work.

<!-- We recommend you to read through the [Getting Started documentation](../getting-started.mdx) first if you haven’t done so. -->

There are currently 2 different ways you might want to switch between the providers:
- [Choose the specific provider](#explicit): fulfill the use case by the chosen provider
- [Setup resilient failover](#failover): switch to another provider when the primary fails


## Explicit choice of provider {#explicit}

In integration scenarios where you need to fulfill the use case with
the specific provider (e.g. because the user content is saved on their servers),
you can explicitly choose which provider you want to use.

The provider choice is bound to a single perform. This means you can choose
different providers for different `perform` calls.

It works by passing the chosen provider configuration to `perform` method
on the use case. You can fetch the provider configuration in runtime using
`getProvider` method exposed from OneSDK.


### Example

Let's say your app lists user repositories and you want to support multiple
version control systems. You'd use [`vcs/user-repos`](https://superface.ai/vcs/user-repos)
and will configure all supported VCS providers.

```shell title="cd your-app/"
npx @superfaceai/cli configure github --profile=vcs/user-repos
npx @superfaceai/cli configure gitlab --profile=vcs/user-repos
npx @superfaceai/cli configure bitbucket --profile=vcs/user-repos
```

Then, switching between the 3 configured providers would look like this:

<Tabs
  defaultValue="github"
  values={[
    { label: 'GitHub', value: 'github', },
    { label: 'GitLab', value: 'gitlab', },
    { label: 'Bitbucket', value: 'bitbucket', },
  ]
}>
  <TabItem value="github">

  ```js title="app.js" {8-9,15}
  const { SuperfaceClient } = require('@superfaceai/one-sdk');

  const sdk = new SuperfaceClient();

  async function run() {
    const profile = await sdk.getProfile('vcs/user-repos');

    // Load the specific provider for this perform
    const provider = await sdk.getProvider('github');

    const result = await profile
      .getUseCase('UserRepos')
      .perform(
        { user: 'superfaceai' },
        { provider }
      );

    return result.unwrap();
  }

  run();
  ```
  </TabItem>

  <TabItem value="gitlab">

  ```js title="app.js" {8-9,15}
  const { SuperfaceClient } = require('@superfaceai/one-sdk');

  const sdk = new SuperfaceClient();

  async function run() {
    const profile = await sdk.getProfile('vcs/user-repos');

    // Load the specific provider for this perform
    const provider = await sdk.getProvider('gitlab');

    const result = await profile
      .getUseCase('UserRepos')
      .perform(
        { user: 'superfaceai' },
        { provider }
      );

    return result.unwrap();
  }

  run();
  ```
  </TabItem>

  <TabItem value="bitbucket">

  ```js title="app.js" {8-9,15}
  const { SuperfaceClient } = require('@superfaceai/one-sdk');

  const sdk = new SuperfaceClient();

  async function run() {
    const profile = await sdk.getProfile('vcs/user-repos');

    // Load the specific provider for this perform
    const provider = await sdk.getProvider('bitbucket');

    const result = await profile
      .getUseCase('UserRepos')
      .perform(
        { user: 'superfaceai' },
        { provider }
      );

    return result.unwrap();
  }

  run();
  ```
  </TabItem>
</Tabs>

:::note

If there's only 1 provider configured for the profile, that provider is automatically used and you don't have to explicitly choose the provider in the code.

:::

<!-- 
## Automatic Failover {#failover}

When using provider failover, the SDK will automatically switch to another
provider when the primary provider fails.

### Enable & configure the failover strategy

The failover is configured for each


    - Choosing failover strategy
        - Circuit Breaker


### Failover provider order

    - Priority for failover

### When should I use automatic failover?

You should use the automatic failover if:

- You need a maximum resiliency for the use case

:::caution

When using automatic failover, you mustn't specify the provider in the
code, as shown in the example above.

:::



## Monitor the provider usage

Connect the project -->