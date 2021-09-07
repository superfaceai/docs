
# Test Capability

### Prerequisites

- Existing Node.js [project set up](./setup-the-environment.md)
- Existing local profile
- Existing [provider definition](./add-new-provider.md)
- Existing local [map between profile & the provider](./map-capability-to-provider.md)

## Test the provider map

Since profile & provider are simple descriptions of entities and actions, we don't usually test them. However the maps typically contain non-trivial logic that benefits from being properly tested. In addition, you might want to run integration tests against the provider's sandbox or live servers.

Testing is easy since you simply perform the use case via OneSDK. Then, you test it as any other function. The only difference is that you want to make OneSDK use a specific provider when running in test. You can do that by specifying `provider` parameter inside options for `.perform` method.

:::info SuperJson

To know more about profiles, maps and their configurations in `super.json`, check out our documentation about **[Comlink](/comlink)**

:::

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

There are four modes of `nock.back` recording support and playback, you can read more about them [here](https://github.com/nock/nock#modes). You can also use `nock.recorder.rec()` and `nock.recorder.play()` and handle recordings yourself (more about `rec` and `play` [here](https://github.com/nock/nock#recording)).

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

### Setting up test configuration file {#set-test-configuration-file}

To be added

## Running tests

Since in this guide, we are using `jest` framework, we can run tests with its CLI tool and call `jest` within CLI or add it in `package.json` and run it with `npm` or `yarn`. 

`jest` has multiple [CLI options](https://jestjs.io/docs/cli). It also has a flag `--updateSnapshot` to update snapshots, when modifying tests in some way.

## Examples

- [Integration test for expected result data format](https://github.com/superfaceai/station/blob/main/capabilities/communication/send-message/maps/slack.test.ts)
- [Integration test for expected output for given input](https://github.com/superfaceai/station/blob/main/capabilities/address/clean-address/maps/smartystreets.test.ts)

> If you wish to use your new capability in another Node.js application, please refer to [the following guide](./run-capability.md).
