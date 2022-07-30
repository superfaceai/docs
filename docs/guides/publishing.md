# Publish to Superface catalog

Once your API integration is tested and works, consider publishing it to the Superface catalog. This will simplify the reuse of profile, map, and/or provider in other projects. The published capabilities will be also usable by other developers.

<!-- TODO: Note about private capabilities / registries -->

## Prerequisites

To publish content to the Superface registry, you need to:

1. Have an existing [Superface account](https://superface.ai/).
2. Have the [Superface CLI installed](./setup-the-environment.md).
3. Have the local profile, map, and/or provider linked in `super.json` (as described in previous steps).

## Log in to the registry

First login with Superface CLI:

```shell
superface login
```

This will prompt you to login using the browser. Once you confirm the login return back to the terminal.

## Publish the content

Use the `publish` command with `profile`, `provider`, or `map`. You always need to specify a profile ID and provider name. The command has the following format:

```shell
superface publish profile|map|provider --profileId <profile-id> --provider <provider-name> [--dryRun]
```

`<profile-id>` corresponds to the profile ID including the scope (e.g. `communication/send-sms`), it can be a published profile. `<provider-name>` is a provider name as specified either in the local `.provider.json` file or already published provider.

Use the `--dryRun` option to preview the publishing. This is also useful for checking for possible errors and issues in the profile, map or provider (e.g. syntax errors or incompatibility between the map and the profile). For example:

```shell
superface publish profile --profileId my-profile --provider google-apis --dryRun
```

### Publish profile

If you are publishing a new capability start by publishing a profile:

```shell
superface publish profile --profileId my-profile --provider github
```

### Publish provider

When publishing a provider, its name **must** start with `unverified-` prefix otherwise the publishing fails (see [Add a new provider](add-new-provider.md) for details about naming).

```shell
publish map --profileId communication/send-sms --provider unverified-my-provider
```

<!-- TODO: Migrating from local provider w/out prefix -->

### Publish map

When publishing a new map, both its provider and the mapped profile must be already published.

```shell
superface publish map --profileId communication/send-sms --providerName twilio
```

## Switch to the published profile

After successful publishing the CLI will ask you to switch to the remote profile:

```
? Do you want to switch to remote profile instead of a locally linked one?: (Y/n)
```

Answering `Y` will disable the use of local files. If you plan on further updating and publishing the capability from the current project, answer `N`.

<!-- TODO: Notes about versioning & updating -->
