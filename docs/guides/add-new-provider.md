# Add a new provider

_Provider_ definition is a simple JSON description of a remote service running on the Internet. It declares:

- the service provider name
- where to find its servers
- how to authenticate against those servers

This definition is later used by _Map_ documents that create a request/response mapping between a specific capability and the provider's servers.

#### Basic Example

```json
{
  "name": "twilio",
  "services": [
    {
      "id": "default",
      "baseUrl": "https://api.twilio.com"
    }
  ],
  "defaultService": "default",
  "securitySchemes": [
    {
      "id": "basic",
      "type": "http",
      "scheme": "basic"
    }
  ]
}
```

:::info Before you start

Please [check our registry for existing providers](./find-provider-by-name.md) before creating your own. Chances are the provider you're interested in was already defined by someone else. 

In that case you can skip this guide & simply [create a mapping for the capability using an existing provider](./map-capability-to-provider.md).

:::

## Setup

This guide assumes you have a project set up with Superface installed. If you need to set up a new project, please reference the [Setup Guide](./setup-the-environment.md).

## Create new provider definition {#create-new}

### Choose the name

Provider name serves primarily for identification. We recommend it to be as short as possible. It should also map the original provider's business name as closely as possible _(e.g. if you're describing Facebook's API, just use `facebook` as the name)_.

### Bootstrap via CLI

The easiest way to bootstrap a new provider is using [Superface CLI](/reference/cli).

```shell
superface create --provider --providerName <provider-name>
```

_Replace the `<provider-name>` in the command with the actual name you wish to use._

Running the above command creates a new JSON file at `<provider-name>.provider.json` and links the provider in the local `super.json` configuration file.

```json title="<provider-name>.provider.json"
{
  "name": "<provider-name>",
  ...
}
```

## Configure the services {#services}

To be able to call the provider's web services, you need to first define them. Each service points to a specific base URL and has an identifier that is unique within the provider document.


```json title="<provider-name>.provider.json" {3-8}
{
  "name": "<provider-name>",
  "services": [
    {
      "id": "api",
      "baseUrl": "https://api.example.com"
    },
  ],
  ...
}
```

_Replace the `baseUrl` value in the example with the actual base URL of the provider's API. You can also use your own `id`._

Some providers' APIs span across more URLs, or have different API versions hosted on different base URLs. In those cases, you should define multiple services.

### Choose the default service {#default-service}

Each provider needs one service to be selected as the default one. Choose one of the defined services and set its ID to `defaultService` parameter.

```json title="<provider-name>.provider.json" {5,9}
{
  "name": "<provider-name>",
  "services": [
    {
      "id": "api",
      "baseUrl": "https://api.example.com"
    }
  ],
  "defaultService": "api"
}
```

_Note that `api` is the name of the service, thus can be used as a value for `defaultService`._

## Configure authentication (security schemes) {#authentication}

:::info Optional

If the provider offers a public API that _does not_ require any authentication, you can skip this step.

:::

Define the expected form of authentication using _security schemes_.  The actual credentials, tokens or keys will be provided later in runtime by the consumer either directly or via environment variables. Currently 3 types of security schemes are supported:

- [Basic Auth](#basic-auth)
- [Bearer Token](#bearer-token)
- [API key in header or query](#api-key)

### Basic Auth {#basic-auth}

_`https://user:pass@api.example.com` or `Authorization: Basic <credentials>` in headers_

Use the following scheme with an arbitrary ID which can be referenced later from the mapping.

```json title="<provider-name>.provider.json" {10-16}
{
  "name": "<provider-name>",
  "services": [
    {
      "id": "api",
      "baseUrl": "https://api.example.com"
    }
  ],
  "defaultService": "api",
  "securitySchemes": [
    {
      "id": "<scheme-id>",
      "type": "http",
      "scheme": "basic"
    }   
  ]
}
```

_Replace the security scheme `id` value in the example with your own ID._

### Bearer Token {#bearer-token}

_e.g. `Authorization: Bearer <token>` in headers_

Use the following scheme with an arbitrary ID which can be referenced later from the mapping.

The value for `bearerFormat` is a hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.

```json title="<provider-name>.provider.json" {10-17}
{
  "name": "<provider-name>",
  "services": [
    {
      "id": "api",
      "baseUrl": "https://api.example.com"
    }
  ],
  "defaultService": "api",
  "securitySchemes": [
    {
      "id": "<scheme-id>",
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "Bearer <token>"
    }
  ]
}
```

_Replace the security scheme `id` value in the example with your own ID. Provide a better `bearerFormat` hint if necessary._

### API Key in Headers or Query {#api-key}

Use the following scheme with an arbitrary ID which can be referenced later from the mapping.


```json title="<provider-name>.provider.json" {10-17}
{
  "name": "<provider-name>",
  "services": [
    {
      "id": "api",
      "baseUrl": "https://api.example.com"
    }
  ],
  "defaultService": "api",
  "securitySchemes": [
    {
      "id": "<scheme-id>",
      "type": "apiKey",
      "in": "header", // supported values are "header" or "query"
      "name": "x-custom-header-name"
    }
  ]
}
```

_Replace the security scheme `id` value in the example with your own ID. Choose the key location & name the parameter._

#### For key in header

_e.g. `X-SECRET-KEY: <apikey>` in headers_

- `in` must be set to `header`
- `name` is the header name that holds the API key (e.g. `X-SECRET-KEY`)

#### For key in query

_e.g. `https://api.example.com/?accessKey=<apikey>`_

- `in` must be set to `query`
- `name` is the query param name that holds the API key (e.g. `accessKey`)


## Examples

- [Provider using Basic auth](https://github.com/superfaceai/station/blob/main/providers/twilio.json)
- [Provider using Bearer token](https://github.com/superfaceai/station/blob/main/providers/slack.json)
- [Provider using API key in request headers](https://github.com/superfaceai/station/blob/main/providers/dhl.json)
- [Provider using API key in request query](https://github.com/superfaceai/station/blob/main/providers/google-apis.json)