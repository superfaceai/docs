# Create a new use case as Profile Maker

Use case specifies input and result parameters, and error behavior of the API integration. Use case inputs and result should not contain any provider specific parameters and provider implementation details like authentication credentials.

Use cases are defined through a [Comlink profile](../comlink/reference/profile.mdx). A profile is a set of use cases that serve the same business need. The Comlink profile is a file with `.supr` extension.

This guide will walk you through the process of defining a new use case within a Comlink profile. You will use the Superface CLI to bootstrap a new profile and learn the syntax.

<!-- TODO: describe in detail -->
## Setup

This guide assumes you have set up Superface Station project with dependencies installed.
<!-- TODO: describe flow in detail - correct order of commands, test are used to run use cases -->

## Create New Profile in Station

<!-- TODO: more details? - multiple use case per profile? -->
For more detailed info about profile names and scopes check [create new use case](./create-new-use-case.md) guide.


### Bootstrap With CLI

You can use the [Superface CLI](https://github.com/superfaceai/cli) to set up an empty Comlink profile:

```shell
superface prepare:profile <use_case_name> --station
```

Where `<use_case_name>` is the name of use case you wish to create.

:::tip CLI Help

Use the `--help` flag for more options and examples:

```shell
superface prepare:profile --help
```
:::

The CLI creates `profile.supr` file in directory `grid/use_case_name` and links to it from the `superface/super.json`.

Res of profile file creation is desrbied in [create new use case](./create-new-use-case.md) guide.


## Create new provider definition in Station

### Bootstrap via CLI

The easiest way to bootstrap a new provider is using [Superface CLI](/reference/cli).

```shell
superface prepare:provider <provider-name> --station
```

_Replace the `<provider-name>` in the command with the actual name you wish to use._

Running the command will interactivelly guide you through provider definition.

First you will be asked to enter base URL of [default service](#default-service). More [services](#services) can be added later. Next, you will select security scheme used for [authentication](#authentication). Then you can enter [Integration parameters](../reference/glossary.md#integration-parameter). Each integration parameter consists of name and optional default value.

You will end up with functional provider definition that can be used to [create a mapping for the use case](./map-use-case-to-provider.md).

If you need more than one service you can check [configure the services](#services) and add new service to file `<provider-name>.provider.json`. Similarly you can add more then one security scheme as described in [authentication](#authentication). 



## Create new Map document

Mapping happens between _a specific version of Profile_ and some _Provider_. Choose which profile version you want to fulfill by the provider.

The easiest way to then bootstrap a new Map document is using [Superface CLI](/reference/cli).

```shell
superface prepare:map <profile-name> <provider-name> --station
```

_Replace the `<profile-name>` and `<provider-name>` in the command with the actual profile and provider you wish to create new Map for._

## Create test for map


```shell
superface prepare:test <profile-name> <provider-name> --station
```

_Replace the `<profile-name>` and `<provider-name>` in the command with the actual profile and provider you wish to create new Map for._


## Run test
<!-- Link to test-use.case station section? -->

```shell
npm run test:record grid/<profile-name>/maps
```


## Create map for mock provider


```shell
superface prepare:mock-map <profile-name> --station
```

_Replace the `<profile-name>` and `<provider-name>` in the command with the actual profile and provider you wish to create new Map for._


## Create test for mock map


```shell
superface prepare:mock-map-test <profile-name> --station
```

_Replace the `<profile-name>` and `<provider-name>` in the command with the actual profile and provider you wish to create new Map for._


## Additional Resources

- [Comlink Profile Reference](https://superface.ai/docs/comlink/profile)
- [Examples](https://github.com/superfaceai/station)
