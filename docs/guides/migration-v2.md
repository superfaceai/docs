# Migrating to SDK v2.0

If you're reading this, then you're probably in the process of upgrading to OneSDK v2.0. Congratulations! This new version brings a lot of improvements. The most notable change is being able to **use OneSDK without `super.json`**, greatly simplifying usage if you're only just trying Superface out.

However, this also brings some breaking changes that you should be aware of. This guide will help you migrate your existing code depending on how you're using OneSDK at the moment.

## Use cases from the Superface Catalog
If you're only using use cases from the Superface catalog, you can safely remove the following folders, as they're no longer required by OneSDK v2.0:
- `superface/.cache`
- `superface/grid`
- `superface/types`

Only the `super.json` file remains in the `superface` folder.

## Locally stored maps and profiles
If you're also using some maps and profiles that are loaded from the local filesystem (instead of the Superface catalog), you will have to get acquainted with the `compile` command of the [Superface CLI](https://github.com/superfaceai/cli).

```shell
superface compile
# Or, if you don't have the CLI installed:
npx @superfaceai/cli compile
```

This command *compiles* the local maps and profiles as specified in the `super.json` configuration file. It is recommended to commit the resulting files (`*.ast.json`) to version control.

This command must be ran upon first upgrading to OneSDK v2.0, otherwise OneSDK will crash. It also has to be ran **on every change** of local maps and profiles, as the changes made will not be in effect otherwise.

For this reason, it is highly recommended to include running this command in your CI pipeline, or upon starting your application (e.g. as part of a `build` command in `package.json`).
// TODO jnv?


<!--
## `super.json` in code

This only applies if you're using OneSDK v1.5.2, and probably isn't relevant.

-->