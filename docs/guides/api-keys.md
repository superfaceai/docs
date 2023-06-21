# Setting provider API keys

Providers may require authentication details in order to use their APIs, typically API keys or tokens.

API keys are passed into your application code as part of the `security` option the OneSDK `perform` function.

## Getting API keys from provider

Every provider has different way of obtaining keys, usually you need to sign up for an account. In case you have trouble obtaining credentials from your selected provider, [contact us](../support.mdx).

## Storing and reading API keys

A common practice is to store environment variables into `.env` file which is not checked into a version control system. For example, if using [Resend](https://www.resend.com) to send emails, you can store the `RESEND_TOKEN` variable in `.env` file:

```title=".env"
RESEND_TOKEN=some.token.value
```

Then in your Node.js application, load the variables from `.env` using the [dotenv](https://www.npmjs.com/package/dotenv) package. Alternatively if you use Docker Compose, the `.env` file is [read automatically](https://docs.docker.com/compose/environment-variables/).

## Example of using .env in a Node.js application

```javascript {14-17}
import { OneClient } from '@superfaceai/one-sdk';
import 'dotenv/config';

async function main() {
  // Set up the object that Resend expects
  const inputs = {
    ...
  };

  // Select the provider to use and provide any params
  // Resend Token comes from the .env file
  const provider = {
    provider: 'resend',
    parameters: {},
    security: {
      bearer_token: {
        token: process.env.RESEND_TOKEN,
      },
    },
  };

  // Set up the Superface OneSDK client and tell
  // it where to find the maps and profiles
  const client = new OneClient({
    assetsPath: './superface',
  });

  // Assign our CLI generated profile so it matches
  // the 'name' in the .profile file
  const profile = await client.getProfile('email-communication/email-sending');

  // Run it, catch errors
  try {
    const result = await profile
      .getUseCase('SendEmail')
      .perform(inputs, provider);
    console.log(`Success: Email sent with ID ${result.value.id}`);
  } catch (e) {
    console.log(e);
  }
}

//run
main();
```
