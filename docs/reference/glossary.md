---
slug: '/reference/glossary'
displayed_sidebar: referenceSidebar
---

# Glossary

## Use case {#use-case}

_Use case_ (or _integration use case_) describes what the business needs from a specific integration. Technically, the _use case_ defines an interface between the application and the integration provider, the schema of input and output (result) data, possible error conditions, and relevant documentation. It is a part of the [profile](#profile).

For example, the [Send SMS Message](https://superface.ai/communication/send-sms@2.0) (`SendMessage`) use case expects recipient's phone number, sender's phone number, and the text message contents. It will return a message ID as the result.

Use cases are written using the [Comlink Profile language](#comlink), for example:

```hcl
"""
Send SMS Message
Send single text message
"""
usecase SendMessage unsafe {
  input {
    "Recipient of the message"
    to string

    "Sender of the message"
    from string

    "The text of the message"
    text string
  }

  result {
    "Identifier of Message"
    messageId string
  }
}
```

## Profile {#profile}

A _profile_ contains one or more [use cases](#use-case), along with the version and general documentation for that group of use cases. It is identified by a name, with an optional scope separated by a slash, for example: `communication/send-sms`. Optionally, the profile can be scoped to a specific version, for example: `communication/send-sms@2.0.1`. Profiles are versioned with [Semantic Versioning](https://semver.org/) to indicate breaking changes.

Profile's file has an extension `.supr` and it is _installed_ with the Superface CLI. It should be committed to a version control system and kept with the application's code.

Profiles are written using the [Comlink Profile language](#comlink), for example:

```hcl title="communication/send-sms.supr"
"""
Send SMS Message
Send a single SMS message or retrieve its status.
"""

name = "communication/send-sms"
version = "2.0.1"

// First use case definition:
usecase SendMessage unsafe {
  // use case body
}

// Second use case definition:
"""
Message Status
Retrieve status of a sent SMS message
"""
usecase RetrieveMessageStatus safe {
  // use case body
}

// Shared fields and models:
field messageId string

field deliveryStatus enum {
  accepted
  delivered
  seen
  unknown
  failed
}
```

## Map {#map}

_Map_ defines a [provider](#provider)-specific logic to fulfill the use case, i.e. what API endpoints need to be called, how to format requests and responses, and how authentication is performed.

Maps are fetched by [OneSDK](#one-sdk) at runtime (i.e., when the particular profile is used with the particular provider for the first time) and can be also updated at runtime (e.g., to fix/handle breaking changes in the provider's API).

Map files have an extension `.suma`, and are written in the [Comlink Map language](#comlink). They specify the name of the provider and the profile, along with its major and minor version. For each use case defined in the respective profile, there is a corresponding `map` directive inside the map file.

Example of the map for `communication/send-sms` profile and the provider `twilio`:

```hcl title="communication/send-sms.twilio.suma"
profile = "communication/send-sms@2.0"
provider = "twilio"

map SendMessage {
  http POST "/2010-04-01/Accounts/{parameters.accountSid}/Messages.json" {
    security "basic"

    request "application/x-www-form-urlencoded" {
      body {
        To = input.to,
        From = input.from,
        Body = input.text
      }
    }

    response 201 "application/json" {
      map result {
        messageId = body.sid
      }
    }
  }
}

map RetrieveMessageStatus {
  // body of the RetrieveMessageStatus logic
}
```

## Provider {#provider}

_Provider_ (or _integration provider_) defines a set of base URLs (services), security schemes, and [integration parameters](#integration-parameter). This information is used for reusability between maps, and as a security measure. Maps cannot send requests outside of defined services, and cannot read values passed to the authentication scheme.

:::info Provider vs. company

From the perspective of Superface, a single provider does not have to correspond to a single company. Large companies, like Google, often have multiple unrelated APIs, each with its own provider (e.g. `google-apis-maps` or `google-apis-computer-vision`). Conversely, your provider can specify services from unrelated companies, if you need to use these services in a single map.

:::

Provider definition is a JSON file adhering to the [Comlink Provider schema](#comlink). The provider is _configured_ by the Superface CLI for particular profiles, which enables the respective maps to be used by [OneSDK](#one-sdk) in the runtime. A *provider* is identified by its name, for example: `twilio`.

:::caution Provider name limitations

Provider name cannot contain numbers to avoid typosquatting attacks. Furthermore, if you are publishing a provider into the registry, its name must start with `unverified-` prefix, e.g. `unverified-twilio`. See [Verification](../verification.mdx) for further details.

:::

Example of the `twilio` provider:

```json title="twilio.provider.json"
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
  ],
  "parameters": [
    {
      "name": "accountSid",
      "description": "Account security identifier"
    }
  ]
}
```

## Integration parameter {#integration-parameter}

_Integration parameters_ are provider-specific values which can be used in maps and provider definitions. A parameter's value can be specified either via an environment variable, in the [super.json file](#super-json), or at runtime as an argument of the [`perform()` method](./one-sdk.mdx#perform).

Common uses for integration parameters include:

- specifying alternate URL or regional domain for the provider's service (e.g. [IBM Cloud Speech to Text provider](https://github.com/superfaceai/station/blob/31c145aa618555c9084f80423c7094acbd43e02e/providers/ibm-cloud-speech-to-text.json#L6))
- passing additional values required by the provider which cannot be covered by profile's input values (e.g. [Mailgun DOMAIN parameter](https://github.com/superfaceai/station/blob/31c145aa618555c9084f80423c7094acbd43e02e/providers/mailgun.json#L18-L21))
- passing user's OAuth2 Access Tokens at runtime (e.g. [Twitter accessToken parameter](https://github.com/superfaceai/station/blob/31c145aa618555c9084f80423c7094acbd43e02e/providers/twitter.json#L10-L13))

## Registry {#registry}

_Registry_ is a web service for the distribution and discovery of profiles, maps, and providers. The service accepts [Comlink](#comlink) files for publishing, and generates Abstract Syntax Tree (AST) for runtime consumption by [OneSDK](#one-sdk).

The public registry is available at [superface.ai](https://superface.ai/catalog). Integrations available in the public catalog are maintained and published from the [Station GitHub repository](https://github.com/superfaceai/station).

## OneSDK {#one-sdk}

_OneSDK_ is a universal API client for Node.js. It is the primary way of using Superface integrations. It can update and execute [Comlink](#comlink) files, automatically switch providers, and report integrations' health via built-in [monitoring](../guides/integrations-monitoring.mdx).

For more details, see [OneSDK reference](./one-sdk.mdx) and its [GitHub repostiory](https://github.com/superfaceai/one-sdk-js).

## super.json {#super-json}

_super.json_ is the configuration file used by [OneSDK](#one-sdk) to load profiles, maps, and provider files. By default it is located in `superface/super.json`. It is managed with [Superface CLI](https://github.com/superfaceai/cli).

For more details about the file's content, see [super.json reference](./superjson.mdx).

## Comlink {#comlink}

_Comlink_ is a domain-specific language for declarative description of API integrations. It consists of three parts: [Profile](#profile), [Map](#map), and [Provider definition](#provider). Integrations written with Comlink are consumed by [OneSDK](#one-sdk).

For more details see [Comlink reference](../comlink/).
