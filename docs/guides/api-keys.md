# Setting provider API keys

Providers may require authentication details in order to use their APIs, typically API keys or tokens. Superface OneSDK supports two different ways of passing API keys and tokens.

The first way is to pass them in your application code as `security` option of `getProvider` or `perform` function. The second way is to use Superface CLI for provider configuration, which configures Superface OneSDK to read API keys from environment variables.

:::note Priority of setting provider API keys

Be aware that highest priority of setting API keys has `perform` function, second `getProvider` function and lowest configuration priority has Superface CLI with environment variables.

:::

## Getting API keys from provider

Every provider has different way of obtaining keys, usually you need to sign up for an account. In case you have trouble obtaining credentials from your selected provider, [reach to us](../support.mdx).

## Configuring the provider in your application code

Pass provider credentials in you application code as `security` option in `getProvider` or `perform` function. In following examples, we will configure API token of `sendgrid` provider for the [send-email](https://superface.ai/communication/send-email) profile.

:::note

You can get `security` option boilerplate code from the profile page. See profile page of [send-email](https://superface.ai/communication/send-email) capability.

:::

### Example of API key configuration in `getProvider` function

```javascript
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function run() {
  // Load the profile
  const profile = await sdk.getProfile('communication/send-email@2.1.0');

  // Get provider and configure SendGrid token
  const provider = client.getProvider(
    'sendgrid', {
    security: {
      ['bearer_token']: { token: '<your-token-from-sendgrid>' }
    }
  });

  // Use the profile and perform the use-case.
  // Note that we pass provider as perform option.
  const result = await profile
    .getUseCase('SendEmail')
    .perform({
      from: 'no-reply@example.com',
      to: 'jane.doe@example.com',
      subject: 'Your order has been shipped!',
      text: 'Hello Jane, your recent order on Our Shop has been shipped.',
    }, {
      provider
    });

  return result.unwrap();
}

run();
```

### Example of API key configuration in `perform` function

```javascript
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function run() {
  // Load the profile
  const profile = await sdk.getProfile('communication/send-email@2.1.0');

  // Use the profile.
  // Note that we pass provider name and provider API key as perform options.
  const result = await profile
    .getUseCase('SendEmail')
    .perform({
      from: 'no-reply@example.com',
      to: 'jane.doe@example.com',
      subject: 'Your order has been shipped!',
      text: 'Hello Jane, your recent order on Our Shop has been shipped.',
    }, {
      provider: 'sendgrid',
      security: {
        ['bearer_token']: { token: '<your-token-from-sendgrid>' }
      }
    });

  return result.unwrap();
}

run();
```

## Configuring the provider using Superface CLI

The Superface CLI configures the provider to read credentials from environment variable. For example, configure a new provider `sendgrid` for the [send-email](https://superface.ai/communication/send-email) profile:

```shell
npx @superfaceai/cli configure sendgrid --profile=communication/send-email
```

This will create a new entry in the `super.json` file:

```json title="superface/super.json" {9-10}
{
  "profiles": {
    // ...
  },
  "providers": {
    "sendgrid": {
      "security": [
        {
          "id": "bearer_token",
          "token": "$SENDGRID_TOKEN"
        }
      ]
    }
  }
}
```

Value starting with `$` refers to an environment variable, so OneSDK will read the API credentials for SendGrid from `SENDGRID_TOKEN`. You can change this name to fit your needs.

### Example of application code with API key configured in environment variable

```javascript
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function run() {
  // Load the installed profile.
  const profile = await sdk.getProfile('communication/send-email');

  // Use the profile.
  // Note that we do not pass provider name and provider security params.
  const result = await profile
    .getUseCase('SendEmail')
    .perform({
      from: 'no-reply@example.com',
      to: 'jane.doe@example.com',
      subject: 'Your order has been shipped!',
      text: 'Hello Jane, your recent order on Our Shop has been shipped.',
    });

  return result.unwrap();
}

run();
```

## Storing and reading API keys

A common practice is to store environment variables into `.env` file which is not checked into a version control system. Following the SendGrid example above, you can store the `SENDGRID_TOKEN` variable in `.env` file:

```title=".env"
SENDGRID_TOKEN=some.token.value
```

Then in your Node.js application, load the variables from `.env` using the [dotenv](https://www.npmjs.com/package/dotenv) package. Alternatively if you use Docker Compose, the `.env` file is [read automatically](https://docs.docker.com/compose/environment-variables/).
