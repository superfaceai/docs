# Setting provider API keys

Providers may require authentication details in order to use their APIs, typically API keys or tokens. By default Superface OneSDK reads API keys from environment variables. This behavior can be modified through the `super.json` file.

## Getting API keys from provider

Every provider has different way of obtaining keys, usually you need to sign up for an account. In case you have trouble obtaining credentials from your selected provider, [reach to us](../support.mdx).

## Configuring the provider

The Superface CLI configures the provider to read credentials from environment variable. For example, configure a new provider `sendgrid` for the [send-email](https://superface.ai/communication/send-email) capability:

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

Value starting with `$` refers to an environment variable, so OneSDK will read the API credentials for Sendgrid from `SENDGRID_TOKEN`. You can change this name to fit your needs.

<!-- :::caution Storing keys in `super.json`

It is possible to store API keys directly in the `super.json` file, but it is not recommended. Since this file needs to be committed to the version control system, there's a high risk of leaking the credentials.

::: -->

## Storing and reading API keys

A common practice is to store environment variables into `.env` file which is not checked into a version control system. Following the Sendgrid example above, you can store the `SENDGRID_TOKEN` variable in `.env` file:

```title=".env"
SENDGRID_TOKEN=some.token.value
```

Then in your Node.js application, load the variables from `.env` using the [dotenv](https://www.npmjs.com/package/dotenv) package. Alternatively if you use Docker Compose, the `.env` file is [read automatically](https://docs.docker.com/compose/environment-variables/).
