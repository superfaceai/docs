# Upgrading to OneSDK v2.0

This guide aims to help users of OneSDK for Node.js (`@superfaceai/one-sdk`) with upgrade to version 2.0.0 and above.

For new features in the release, take a look at the [announcement post](https://superface.ai/blog/one-sdk-2.0). See the [changelog] for the full list of changes.

## Compatibility

OneSDK v2.0.0 supports Node.js v14.20, v16.16, v18.7, and above.

## Breaking change: Removal of parser

The biggest breaking change is removal of the Comlink parser from the core of OneSDK. This change affects only **projects with local `.supr` and `.suma` files linked from `super.json`** file. OneSDK won't parse local files automatically, instead you need to compile them with Superface CLI.

Follow these steps to see if this change impacts your project and how to adapt to this change.

### Check if you are affected

In `superface/super.json` file, look for the `"file"` property, for example, the following configuration file uses both local profile and map files.

```json title="superface/super.json"
{
  "profiles": {
    "my-profile": {
      "file": "./my-profile.supr",
      "providers": {
        "my-provider": {
          "file": "./my-profile.my-provider.suma"
        }
      }
    }
  }
}
```

If you don't see any `"file"` property in your configuration file, this breaking change does not impact your project.

### Compile source maps to AST

To upgrade your project to OneSDK v2.0, you will need to compile the source `.supr` and `.suma` files to their AST form (with `.ast.json` extension).

You can run the following command to perform a one-off compilation:

```shell
npx @superfaceai/cli@3 compile
```

This will generate `.ast.json` files next to the existing source files linked from `super.json` file.

:::caution

The compilation is **necessary after every change** to local files `.suma` and `.supr` files.

:::

:::caution

The `.ast.json` files must be available in the runtime for OneSDK. It is recommended to commit the `.ast.json` files to version control.

:::

### Add compilation to your build process

To prevent stale changes in source `.suma` and `.supr` files, add `@superfaceai/cli@3` package to your development dependencies and add the compilation step into your build process.

First, install the CLI dev dependency:

```shell
npm i --save-dev @superfaceai/cli@3
```

Next, create [npm scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts) in project's `package.json`.

For a vanilla JavaScript application without an existing build step, make sure to run the compilation before running and testing the application. You can use [pre- scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts) to achieve that:

```json title="package.json"
{
  "scripts": {
    "compile": "superface compile",
    "prestart": "npm run compile",
    "pretest": "npm run compile"
  }
}
```

If your application already has a build step (for example, with TypeScript, or Next.js), the compilation can run before the `build` script:

```json title="package.json"
{
  "scripts": {
    "prebuild": "superface compile"
  }
}
```

## Change of the cache directory location

OneSDK relies on a runtime cache to store AST files of remote profiles the application depends upon. Previously, these files were stored in `superface/.cache` directory. In OneSDK v2.0.0 this location changed to `node_modules/.cache/superface`. The cache directory is created automatically, no change is necessary.

If this directory isn't writable in the runtime, you can either deploy it with your application (for example, include it in the Docker image), or disable the file system cache completely, upon OneSDK initialization:

```js
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient({
  // highlight-next-line
  cache: false,
});
```

## Optional cleanups

You can safely remove the following folders, as they're no longer required by OneSDK v2.0:

- `superface/.cache`
- `superface/grid`
- `superface/types`

Only the `super.json` file remains in the `superface` folder.

[changelog]: https://github.com/superfaceai/one-sdk-js/blob/v2.0.0/CHANGELOG.md#200---2022-08-15
