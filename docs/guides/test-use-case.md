# Testing use case code

### Prerequisites

- Existing Node.js [project set up](./setup-the-environment.md)
- Existing local profile
- Existing [provider definition](./add-new-provider.md)
- Existing local [map between profile & the provider](./map-use-case-to-provider.md)

## Test the provider map

Out of profile, provider definition, and map, only the map contains logic which should be automatically tested. This document describes the process of testing the map using Jest and Nock libraries. Additionally these tests can be used as continuous integration tests against the provider's sandbox or live servers.

You can use OneSDK in your tests to perform the use cases through the provider's map. You need to explicitly set the provider to make sure that the correct map is being tested.

:::info super.json

To know more about profiles, maps and their configurations in `super.json`, check out our documentation about /s **[Comlink](/comlink)**

:::

### Setting up testing enviroment

Install necessary packages into your project:

```shell
npm install --save-dev jest nock
```

### Write a test for the provider map

Use OneSDK like in [Run Capability](./run-use-case#write-node.js-app) and test out result coming from perform.

```javascript title="profile.provider.test.js"
const { SuperfaceClient } = require('@superfaceai/one-sdk');

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    sdk = new SuperfaceClient();
    profile = await sdk.getProfile('scope/profile-name');
    provider = await sdk.getProvider('provider');
  });

  it('returns a result when called with ...', async () => {
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

:::caution

This test example will hit live APIs.

If your capabilities require authorization, you can load keys from enviroment variables as described in [Run Capability](./run-use-case#set-environment-variables)

If you want to reduce amount of calls to live APIs, see section about [recording traffic](#recording-traffic).

:::

### Asserting results

Usually we want to assert result coming from our map. Result from perform always returns a `Result` type that is either `Ok` or `Err`. This follows the [neverthrow](https://github.com/supermacro/neverthrow) approach.

We can use methods `isOk()` and `isErr()` to narrow down the result to either `result.value` or `result.error` properties which we can then test.

Or we can use method `unwrap()`, which is less safe because it can throw an error.

```javascript title="profile.provider.test.js" {21-24}
const { SuperfaceClient } = require('@superfaceai/one-sdk');

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    sdk = new SuperfaceClient();
    profile = await sdk.getProfile('scope/profile-name');
    provider = await sdk.getProvider('provider');
  });

  it('should return a result when called with ...', async () => {
    const input = {
      // ...
    };
    const result = await profile
      .getUseCase('UseCaseName')
      .perform(input, { provider });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual({
      result: 'test',
    });
  });
});
```

:::caution

If `result.isErr()` is true and you call `result.unwrap()`, it will throw an error.

For this situation you can use the [`toThrow` matcher](https://jestjs.io/docs/expect#tothrowerror):

```javascript
expect(result.isErr()).toBe(true);
expect(() => {
  result.unwrap();
}).toThrow();
```

:::

### Using Jest snapshots

You can use [Jest snapshots](https://jestjs.io/docs/snapshot-testing) to automatically capture the result:

```javascript title="profile.provider.test.js" {21-22}
const { SuperfaceClient } = require('@superfaceai/one-sdk');

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    sdk = new SuperfaceClient();
    profile = await sdk.getProfile('scope/profile-name');
    provider = await sdk.getProvider('provider');
  });

  it('should return a result when called with ...', async () => {
    const input = {
      // ...
    };
    const result = await profile
      .getUseCase('UseCaseName')
      .perform(input, { provider });

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toMatchSnapshot();
  });
});
```

:::caution

If `result.isErr()` is true, `result.unwrap()` will throw an error.

To capture snapshot of error, you can use [`toThrowErrorMatchingSnapshot` matcher](https://jestjs.io/docs/expect#tothrowerrormatchingsnapshothint):

```javascript
expect(result.isErr()).toBe(true);
expect(() => {
  result.unwrap();
}).toThrowErrorMatchingSnapshot();
```

:::

### Recording traffic

If you don't want to hit providers API upon each test run you can set up recording with [`nock`](https://github.com/nock) and use prerecorded responses during development.

```javascript title="profile.provider.test.js" {2,12-13,21,27}
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const nockBack = require('nock').back;

describe('scope/profile-name/provider', () => {
  let sdk, profile, provider;

  beforeAll(async () => {
    sdk = new SuperfaceClient();
    profile = await sdk.getProfile('scope/profile-name');
    provider = await sdk.getProvider('provider');

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

<!-- ## Use Superface testing library {#testing-lib}

To make it easier you can write your tests with class `TestConfig` from testing library `@superfaceai/testing-lib`.

```javascript title="profile.provider.test.js" {1,4,7-13,15-22,26,34-35}
const { TestConfig } = require('@superfaceai/testing-lib');

describe('scope/profile-name/provider', () => {
  let testConfig;

  beforeAll(() => {
    testConfig = new TestConfig({
      profile: 'scope/profile-name',
      provider: 'provider',
      useCase: 'first-usecase',
    });

    testConfig.record({ path: 'src' });
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
  provider: 'provider',
});
```

```javascript
const client = new SuperfaceClient();
const testConfig = new TestConfig({
  client,
  profile: client.getProfile('scope/profile-name'),
  provider: client.getProvider('provider'),
});
```

```javascript
const testConfig = new TestConfig({});
testConfig.setup({
  profile: 'scope/profile-name',
  provider: 'provider',
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

:::

### Recording

To use recording of traffic as we described before in [recording traffic](#recording-traffic) capitol with Superface testing library, you can use `TestConfig` to leverage `nock.back`, `rec` and `play` within its methods.

#### Setting up NockConfig

If you want to set up where will recordings and fixtures resides, you can enter `nockConfig` accross methods such as `setupNockBack`, `record`, `endRecording` and use different configurations across tests.

```javascript
const testConfig = new TestConfig(
  {},
  {
    path: 'src',
    dir: 'some/dir',
    fixture: 'test',
    mode: 'record',
    hideHeaders: true,
    update: true,
  }
);
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
  hideHeaders: true,
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
const testConfig = new TestConfig({});

testConfig.setupNockBack({
  path: 'src',
  fixture: 'nockBackTest',
  mode: 'record',
});
testConfig.nockBackRecord();

// ... performs

testConfig.endNockBackRecord();
```

## Generating tests with Superface CLI

To be added

### Setting up test configuration file {#set-test-configuration-file}

To be added -->

## Running tests

When your tests are ready, run them with Jest CLI:

```shell
npx jest
```

You can use `--updateSnapshot` flag when modifying tests or when the expected results change. See [Jest documentation](https://jestjs.io/docs/cli) for further CLI options.
