
# Test Capability

## Setup

This guide assumes you have a project set up with Superface installed. If you need to set up a new project, please reference the [Setup Guide](./setup-the-environment.md).

### Prerequisites

- Existing profile
- Existing [provider definition](./add-new-provider.md)
- Existing [map between profile & the provider](./map-capability-to-provider.md)
- [Superface CLI](/reference/cli) installed
- [Superface OneSDK](/reference/one-sdk-js) installed

## Configure existing profile and map {#configure-profile-map}

To run and test your capabilities, you have to have configured profile and map in `super.json`.

### Configuring profile {#configure-profile}

To configure local profile, within your `super.json`, you have to add object representation of profile inside `profiles`, it's key have to be profile id matching id inside referenced file and value is object containing file path and providers.

```json title="superface/super.json" {3-7}
{
  "profiles": {
    "<profile-id>": {
      "file": "./profiles/my-profile.supr",
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

### Configuring map {#configure-profile}

To configure local map, you have to add object representation of map with file path similar to profile specification.

```json title="superface/super.json" {6-8}
{
  "profiles": {
    "<profile-id>": {
      "file": "./profiles/my-profile.supr",
      "providers": {
        "<provider-id>": {
          "file": "./maps/my-map.suma"
        }
      }
    }
  },
  "providers": {
    // ...
  }
}
```

:::info

To know more about profiles, maps and their configurations in `super.json`, check out our documentation about **[Comlink](/comlink)**

:::

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

If you used CLI for configuring the security schemes, the chances are it created `.env` file for you. In that case, simply fill in the environment variables. Then install [`dotenv`](https://www.npmjs.com/package/dotenv) package that will load the `.env` file for you.

## Test the provider map

Since profile & provider are simple descriptions of entities and actions, we don't usually test them. However the maps typically contain non-trivial logic that benefits from being properly tested. In addition, you might want to run integration tests against the provider's sandbox or live servers.

Testing is easy since you simply perform the use case via OneSDK. Then, you test it as any other function. The only difference is that you want to make OneSDK use a specific provider when running in test. You can do that by specifying `provider` parameter inside options for `.perform` method.

<!-- For unit testing all of the Map's logic, you might need to mock the specific responses. We recommend using [`nock`](https://www.npmjs.com/package/nock) for this. -->

### Setting up testing enviroment

In this guide, we use `jest`, but it's up to you what testing framework will you choose.

Install necessary packages into your project

```shell
yarn add -D jest
```

<details>
<summary>if you are using typescript</summary>

```shell
yarn add -D jest @types/jest ts-jest
```

to run jest with typescript, create jest configuration file

```javascript title="jest.config.js"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src/',
};
```

</details>

and add test script to your package.json

```json title="package.json"
{
  // ...
  "scripts": {
    "test": "jest"
  }
  // ...
}
```

### Write a test for the provider map

If you [configured security](#configure-security) you have to load environment variables, in this guide we use `dotenv` to load enviroment variables and we import `@superfaceai/one-sdk` to perform our usecases.

:::info
In example below we declare variables for `sdk`, `profile` and `provider` at top level test, you can structure your tests by profile with multiple providers, or even having one test with multiple profiles, but **you have to cover all usecases within map if you want to publish it** in [station](https://github.com/superfaceai/station).
:::

```javascript title="profile.provider.test.js" {1,4,8-10,17-20}
const { SuperfaceClient } = require('@superfaceai/one-sdk');

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    require('dotenv').config();
    sdk = new SuperfaceClient();
    profile = await sdk.getProfile('scope/profile-name');
    provider = await sdk.getProvider('provider-name');
  });

  it('should return a result when called with ...', async () => {
    const input = {
      /* Input object as defined in the profile */
    };
    const result = await profile
      .getUseCase('UseCaseName')
      .perform(input, { provider });

    expect(result.isOk()).toBe(true);
  });
});
```

<details>

<summary>typescript example with typed client</summary>

```typescript title="profile.provider.test.ts"
import dotenv from 'dotenv';
import { SuperfaceClient } from 'superface/sdk';

describe('scope/profile-name/provider', () => {
  let sdk: SuperfaceClient, profile: Profile, provider: Provider;

  beforeAll(async () => {
    dotenv.config();

    sdk = new SuperfaceClient();
    profile = await sdk.getProfile('scope/profile-name');
    provider = await sdk.getProvider('provider-name');
  });

  it('should return a result when called with ...', async () => {
    const input = {
      /* Input object as defined in the profile */
    };
    const result = await profile
      .useCases
      .UseCaseName
      .perform(input, { provider });

    expect(result.isOk()).toBe(true);
  });
});
```

</details>

### Asserting result

Usually we want to assert result comming from our map. To do that we can define results manually in each test or use jest snapshots. If you prefer to not use jest snaphots and don't want to manually write testing cases, you can use Superface CLI to generate tests for you, based on test configuration file `sf-test-config.json`.

:::tip CLI HELP
[Setting up test configuration file](#set-test-configuration-file) will be described in more detail later.

```shell
npx superface test --generate
```

:::

:::info
To use jest snapshots, you have to omit error timestamps before storing snapshot of it. This is resolved in Superface [testing library](#writing-tests-lib) described later.
:::

```javascript title="profile.provider.test.js" {20-23}
const { SuperfaceClient } = require('@superfaceai/one-sdk');

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    ...
  })

  it('should return a result when called with ...', async () => {
    const input = {
      // ...
    }
    const result = await profile.getUseCase('UseCaseName').perform(
      input,
      { provider }
    );

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({
      result: "test"
    });
  });
});
```

### Recording traffic

If you don't want to hit providers API all the time, you can set up recording with `nock` and use mocked responses in development.

There are four modes of `nock` recording support and playback, you can read more about them [here](https://github.com/nock/nock#modes). You can also use `nock.rec()` and `nock.play()` and handle recordings yourself (more about `rec` and `play` [here](https://github.com/nock/nock#recording)).

```javascript title="profile.provider.test.js" {1,9-10,18,24}
const nockBack = require('nock').back;

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    // ...

    nockBack.fixtures = '/path/to/fixtures/';
    nockBack.setMode('record');
  });

  it('should return a result when called with ...', async () => {
    const input = {
      // ...
    };

    const { nockDone } = await back('your-recording.json');

    const result = await profile
      .getUseCase('UseCaseName')
      .perform(input, { provider });

    nockDone();

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({
      result: 'test',
    });
  });
});
```

## Test the provider map with Superface testing library {#writing-tests-lib}

To make it easier you can write your tests with class `TestConfig` from testing library `@superfaceai/testing-lib`.

```javascript title="profile.provider.test.js" {1,4,7-13,15-22,26,34-35}
const { TestConfig } = require('@superfaceai/testing-lib');

describe('scope/profile-name/provider', () => {
  let testConfig;

  beforeAll(() => {
    testConfig = new TestConfig(
      {
        profile: 'scope/profile-name',
        provider: 'provider-name',
        useCase: 'first-usecase',
      }
    );

    testConfig.record(
      { 
        path: "src", 
        dir: "usecase/1",
        update: true,
        hideHeaders: true,
      }
    );
  });

  afterAll(async () => {
    await testConfig.endRecording();
  });
    
  it('should return a result when called with ...', async () => {
    const input = {
      // ...
    };

    await expect(testConfig.test()).resolves.not.toThrow();
    await expect(testConfig.run(input)).resolves.toMatchSnapshot();
  });
});
```

:::info
Some implementations of `TestConfig` class might change in future.

check out `@superfaceai/testing-lib` [on Github](https://github.com/superfaceai/testing-lib)
:::

### Setting up your Superface configuration {#setup-superface-config}

To test provider map, you have to create necessary components, such as profile, provider and usecase which are esential to perform your usecase. Superface testing library enables to setup these components in multiple ways.

Configuration itself can be represented either with corresponding instances or as string representation of corresponding instances. In example above, we use configuration with string representation of profile, provider and usecase, but we could also pass already created instances into `TestConfig` instance and work with those.

```javascript
const testConfig = new TestConfig({
  profile: 'scope/profile-name',
  provider: 'provider-name',
});
```

```javascript
const client = new SuperfaceClient();
const testConfig = new TestConfig({
  client,
  profile: client.getProfile('scope/profile-name'),
  provider: client.getProvider('provider-name'),
});
```

```javascript
const testConfig = new TestConfig({});
testConfig.setup({
  profile: 'scope/profile-name',
  provider: 'provider-name',
});
```

:::info mutation of Configuration
Setting up Superface configuration can be done in constructor of `TestConfig`, in method `setup` or in method `test`. Note that configuration is mutated in each one, so when configuration gets changed in `setup` or `test` it will stay that way until you change it again.
:::

### Testing your configuration

To test your capabilities, you can use two methods from `TestConfig` class: `test()` and `run()`.

Method `test()` checks whether your configuration is valid. To have valid configuration, your profile, provider and usecase have to be defined in your instance of `TestConfig`. You can also enter your superface configuration here if you didn't specify it yet.

```javascript
await expect(testConfig.test()).resolves.not.toThrow();

// or

await expect(testConfig.test({ useCase: 'UseCaseName' }).resolves.not.toThrow();
```

Method `run(input)` checks that perform runs successfully and that it always returns value or error. It requires one parameter, which is `input` based on your usecase.

```javascript
const input = {
  // ...
};

await expect(testConfig.run(input)).resolves.toMatchSnapshot();
```

:::info
In the example above, we're using jest matcher `.toMatchSnapshot()` because in method `run()` error timestamps are already omitted.
:::info

### Recording

To use recording of traffic as we described before in [recording traffic](#recording-traffic) capitol with Superface testing library, you can use `TestConfig` to leverage `nock.back`, `rec` and `play` within its methods.

#### Setting up NockConfig

If you want to set up where will recordings and fixtures resides, you can enter `nockConfig` accross methods such as `setupNockBack`, `record`, `endRecording` and use different configurations across tests.

```javascript
const testConfig = new TestConfig(
  {},
  { 
    path: "src", 
    dir: "some/dir", 
    fixture: "test", 
    mode: "record",
    hideHeaders: true, 
    update: true,
  }
)
```

:::info
To record with `nock.back` support and playback system, you have to set up `nock.back.fixtures` with `setupNockBack()`, to record with `nock.recorder.rec()` you only have to enter your configuration as second parameter when constructing `TestConfig`.
:::

#### `nock.recorder.rec()` recording

- `record()` starts recording or loads fixture based on fixture path
- `endRecording()` if fixture does not exist, it stores recording to fixture path - this also calls `nock.restore()`

```javascript
const testConfig = new TestConfig({});

testConfig.record({
  path: 'src',
  fixture: 'my-fixture',
  update: true,
  hideHeaders: true
});

// ... performs

await testConfig.endRecording();
```

:::caution
You can also set up `nockConfig` in `endRecording()` method, but `hideHeaders` option have to be set up in `record` or `TestConfig` constructor. 
:::

#### `nock.back` recording

- `setupNockBack()` sets up path to recording fixtures and mode of recording
- `nockBackRecord()` starts recording
- `endNockRecording()` ends recording - this also calls `nock.restore()` 

:::info
Currently this approach does not support updating fixtures or hiding headers.
:::

```javascript
const testConfig = new TestConfig({})

testConfig.setupNockBack({ path: 'src', fixture: 'nockBackTest', mode: 'record' });
testConfig.nockBackRecord();

// ... performs

testConfig.endNockBackRecord();
```

## Generating tests with Superface CLI

To be added

## Running tests

<!-- TODO: DEBUG  -->

To be added

## Examples

- [Integration test for expected result data format](https://github.com/superfaceai/station/blob/main/capabilities/communication/send-message/maps/slack.test.ts)
- [Integration test for expected output for given input](https://github.com/superfaceai/station/blob/main/capabilities/address/clean-address/maps/smartystreets.test.ts)

> If you wish to use your new capability in another Node.js application, please refer to [the following guide](./use-in-app.md).
