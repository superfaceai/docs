# Run capability in production

This guide describes how a capability can be used in any production Node.js application, without the use of Superface [remote registry](https://superface.ai/catalog).

## Prerequisites

- Existing Node.js [project set up](/guides/setup-the-environment)
- Existing [profile](#todo) ([compiled](/guides/run-and-test#compile-comlink-documents))
- Existing [provider definition](#todo)
- Existing [map between profile & the provider](#todo) ([compiled](/guides/run-and-test#compile-comlink-documents))
- `super.json` with [configured provider security](/guides/run-and-test#configure-security)
- [Superface OneSDK](#todo) installed

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

## Load & perform the use case

### Set necessary environment variables

For apps running capabilities that require authentication, you'll typically want to supply the providers' API keys via environment variables.

If `.env` is available, it should have the expected variables predefined. You can them simply fill in the values. Then install [`dotenv`](https://www.npmjs.com/package/dotenv) package that will load the `.env` file for you. 

If `.env` is not available, you can find the expected environment variables in `/superface/super.json`. Any value that starts with a dollar sign (`$`) is a reference to an env variable.

### Write & run the app

Use Superface OneSDK to load & perform the use case:

```javascript title="app.js" {8,11,12}
// If you're using .env file, you should also install and init `dotenv` package
require('dotenv').config()
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function main() {
	const profile = await sdk.getProfile('scope/profile-name');

	const result = await profile
		.getUseCase('UseCaseName')
		.perform(/* Input object as defined in the profile */);

	console.info('Hooray!', result.unwrap())
}

main();

```

_Replace `scope/profile-name`, `UseCaseName` and inputs for `.perform` method with the use case details you actually want to use.<br />For details on SuperfaceClient API, please consult [OneSDK reference](#todo)._

You can then run your app that performs the use case.

```shell
node app.js
```

> Note: Later you'll be able to publish your capability to the Superface registry. This will give you many advantages over usage from the local files, like: injecting latest map, provider failover, observability dashboard, any more. Stay tuned.


