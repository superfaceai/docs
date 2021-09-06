# Run Capability

This guide describes how a capability can be used in any production Node.js application, without the use of Superface [remote registry](https://superface.ai/catalog).

## Prerequisites

- Existing Node.js [project set up](./setup-the-environment.md)
- Existing [profile](./create-new-capability)
- Existing [provider definition](./add-new-provider.md)
- Existing [map between profile & the provider](./map-capability-to-provider.md)

## Import capability to the project

The capability needs to be first imported to your application. This guide describes using capability from local files instead of using the remote registry. You'll be simply copying the created artifacts to your production app.

> It is recommended (although not necessary) to place the files onto the same relative paths.

### Comlink files

1. Place Profile document (`*.supr`) and its compiled version (`*.ast.json`) to your project
2. Place Map document (`*.suma`) and its compiled version (`*.ast.json`) to your project
3. Place Provider document (`*.provider.json`) to your project

### Superface configuration

1. If `.env` file is present, place it in the root of your project (or merge contents if you have one already existing)
2. Place the entire `superface` directory to your project

#### Ensure `super.json` has valid paths

1. Open `/superface/super.json`
2. Search for all references to `.supr`, `.suma` & `.json` files
3. Make sure the relative path references are correct


## Configure provider authentication {#configure-security}

:::info Optional

If the Provider JSON doesn't define any _security schemes_, or the map doesn't use `security`, you can skip this step.

:::

If you've created a completely new Provider JSON definition in your project, it will not have its security schemes configured in the local `superface/super.json` configuration file.

Provider's security schemes must be configured in `super.json` since OneSDK will search for it when authenticating the requests during use case perform.

The specific provider section will look like the following example:

```json title="superface/super.json" {6-8}
{
  "profiles": {
    // ...
  },
  "providers": {
    "<provider-name>": {
      "security": []
    }
  }
}
```

_Search in top-level `providers` object for the actual provider you want to configure._

### Configure using CLI {#cli-configuration}

The easiest way to bootstrap the provider's security configuration is using [Superface CLI](/reference/cli).

```shell
superface configure <path-to.provider.json> -p <profile-name> -l -f
```

_Replace the `<path-to.provider.json>` in the command with the actual provider you're trying to configure for some `<profile-name>`._

Running the above command automatically creates security schemes configuration in `super.json` based on Provider definition. It also prepares expected environment variables (if any are required) inside a `.env` file.

_Advanced users can [configure the security manually](#manual-configuration) instead._

### Configure security in `super.json` manually {#manual-configuration}

_If you configured security [using CLI](#cli-configuration), you can skip this._

<details>
  <summary>Configuring security manually</summary>

You'll need to provide a configuration based on the security scheme type. Currently the following schemes can be used:

- [Configure Basic Auth](#basic-auth)
- [Configure Bearer Token](#bearer-token)
- [Configure API key in header or query](#api-key)

#### Reading environment variables in `super.json` {#envs}

You can be prepend any value assigned in `super.json` with a dollar sign (`$`) to reference an environment variable.

```json
{
  // ...
  "token": "$PROVIDER_API_TOKEN"
  // ...
}
```

_When evaluating the above configuration, OneSDK will look for `PROVIDER_API_TOKEN` value in environment variables._

#### Configure Basic Auth scheme {#basic-auth}

Use the following config and reference an existing security scheme from the Provider's JSON definition by an identifier.

```json title="superface/super.json" {8-12}
{
  "profiles": {
    // ...
  },
  "providers": {
    "<provider-name>": {
      "security": [
        {
          "id": "<scheme-id>",
          "username": "$PROVIDER_USERNAME", // will read `PROVIDER_USERNAME` from environment
          "password": "$PROVIDER_PASSWORD" // will read `PROVIDER_PASSWORD` from environment
        }
      ]
    }
  }
}
```

_Replace `<scheme-id>` with the actual security scheme ID defined in the Provider JSON document. You can use your own values for `username` & `password`. However it's a common practice to supply these values via [environment variables](#envs)._

#### Configure Bearer Token scheme {#bearer-token}

Use the following config and reference an existing security scheme from the Provider's JSON definition by an identifier.

```json title="superface/super.json" {8-11}
{
  "profiles": {
    // ...
  },
  "providers": {
    "<provider-name>": {
      "security": [
        {
          "id": "<scheme-id>",
          "token": "$PROVIDER_API_TOKEN" // will read `PROVIDER_API_TOKEN` from environment
        }
      ]
    }
  }
}
```

_Replace `<scheme-id>` with the actual security scheme ID defined in the provider JSON document. You can use your own value for `token`. However it's a common practice to supply these via [environment variables](#envs)._

#### Configure API key in headers or query {#api-key}

Use the following config and reference an existing security scheme from the Provider's JSON definition by an identifier.

```json title="superface/super.json" {8-11}
{
  "profiles": {
    // ...
  },
  "providers": {
    "<provider-name>": {
      "security": [
        {
          "id": "<scheme-id>",
          "apikey": "$PROVIDER_API_KEY" // will read `PROVIDER_API_KEY` from environment
        }
      ]
    }
  }
}
```

_Replace `<scheme-id>` with the actual security scheme ID defined in the provider JSON document. You can use your own value for `apikey`. However it's a common practice to supply these via [environment variables](#envs)._

</details>

## Set necessary environment variables

For apps running the capabilities that require authentication, you'll typically want to supply the providers' API keys via environment variables (see [configuration above](#configure-security)).

If `.env` is available, it should have the expected variables predefined. You can them simply fill in the values. Then install [`dotenv`](https://www.npmjs.com/package/dotenv) package that will load the `.env` file for you.

If `.env` is not available, you can find the expected environment variables in `/superface/super.json`. Any value that starts with a dollar sign (`$`) is a reference to an env variable.

## Write & run the app

Use Superface OneSDK to load & perform the use case:

```javascript title="app.js" {8,11,12}
// If you're using .env file, you should also install and init `dotenv` package
require('dotenv').config();
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function main() {
  const profile = await sdk.getProfile('scope/profile-name');

  const result = await profile
    .getUseCase('UseCaseName')
    .perform(/* Input object as defined in the profile */);

  console.info('Hooray!', result.unwrap());
}

main();
```

_Replace `scope/profile-name`, `UseCaseName` and inputs for `.perform` method with the use case details you actually want to use.<br />For details on SuperfaceClient API, please consult [OneSDK reference](/reference/one-sdk-js)._

You can then run your app that performs the use case.

```shell
node app.js
```

> Note: Later you'll be able to publish your capability to the Superface registry. This will give you many advantages over usage from the local files, like: injecting latest map, provider failover, observability dashboard, any more. Stay tuned.
