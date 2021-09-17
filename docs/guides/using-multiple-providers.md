import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using multiple providers

Consuming a single capability from multiple providers is at heart of Superface.
**You can add as many providers as you need for every profile.**
This guide will walk you through the process of configuring these providers the way you need them to work.

<!-- We recommend you to read through the [Getting Started documentation](../getting-started.mdx) first if you haven’t done so. -->

There are currently 2 different ways you might want to switch between the providers:
- [Choose the specific provider for each perform](#explicit): fulfill the use case by the chosen provider
- [Setup automatic failover](#failover): switch to another provider when the primary fails


## Explicit choice of provider {#explicit}

In integration scenarios where you need to fulfill the use case by
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

If there's only 1 provider configured for the profile, that provider is
automatically used and you don't have to explicitly choose the provider in the code.

:::


## Automatic failover {#failover}

When using provider failover, OneSDK will **automatically switch to another
provider when the previously used one fails**.

This will give you a maximum out-of-the-box resiliency useful for integration
scenarios where you don't care so much about which providers fulfills the use case
but you need it to happen reliably (e.g. in commodity use cases like sending emails, SMS, etc).


### Enabling failover

The failover is configured for each use case separately by enabling `providerFailover`
option in the use case defaults.

For example, if you want to send SMS messages reliably, you'll use the
`SendMessage` use case from [`communication/send-sms`](https://superface.ai/communication/send-sms)
and have two or 3 providers configured.

Then, the configuration of the failover for `SendMessage` use case would look like this:  

```json title="superface/super.json" {5-9}
{
  "profiles": {
    "communication/send-sms": {
      "version": "1.0.1",
      "defaults": {
        "SendMessage": {
          "providerFailover": true
        }
      },
      "priority": [
        // ...
      ],
      "providers": {
        // ...
      }
    }
  },
  "providers": {
    // ...
  }
}
```

For more information about the use case defaults, please see [super.json reference](/reference/superjson#usecasedefaults).

### Specifying failover order

OneSDK by default uses the first provider that was added to the application
as primary, with failover to other providers in order they were added to the app.
You can specify your preferred order in which OneSDK should use and fail over
between the providers.

For example, you're using [`communication/send-sms`](https://superface.ai/communication/send-sms)
to send SMS reliably and have 3 providers configured (e.g. `tyntec`, `plivo` and `twilio`).

Based on your previous knowledge, you want to primarily use `twilio`. If that fails,
you prefer `plivo` and if the secondary fails as well, you want to switch to `tyntec`.
The configuration of the provider priority for this case would look like this:  

```json title="superface/super.json" {10-14}
{
  "profiles": {
    "communication/send-sms": {
      "version": "1.0.1",
      "defaults": {
        "SendMessage": {
          "providerFailover": true
        }
      },
      "priority": [
        "twilio",
        "plivo",
        "tyntec"
      ],
      "providers": {
        // ...
      }
    }
  },
  "providers": {
    // ...
  }
}
```

### Configuring the provider retry

By default, OneSDK attempts to perform the use case with each provider **exactly once**.

For more information about the provider retries, please refer to
[super.json reference](/reference/superjson#retrypolicy).

```json title="superface/super.json" {13-18}
{
  "profiles": {
    "communication/send-sms": {
      "version": "1.0.1",
      "defaults": {
        // ...
      },
      "priority": [
        // ...
      ],
      "providers": {
        "twilio": {
          "defaults": {
            "SendMessage": {
              "retryPolicy": "circuit-breaker",
              // ...
            }
          }
        }
      }
    }
  },
  "providers": {
    // ...
  }
}
```


### Failover in code

:::caution

When using automatic failover, you mustn't specify the provider in the
code, as shown in the example above.

:::



<!-- ## Monitor the provider usage

Connect the project -->