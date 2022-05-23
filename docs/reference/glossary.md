---
slug: '/reference/glossary'
displayed_sidebar: referenceSidebar
---

# Glossary

## Use case {#use-case}

_Use case_ or _integration use case_ describes what the business needs from a specific integration. Technically the use case defines an interface between the application and the integration provider, schema for input and output (result) data, possible error conditions, and documentation. It is part of the [profile](#profile).

For example, the [Send SMS Message](https://superface.ai/communication/send-sms@2.0) (`SendMessage`) expects recipient's phone number, sender's phone number, and the text message contents. It will return a message ID as the result.

Use case is written with the [Comlink Profile language](#comlink), for example:

```hcl
"""
Send SMS Message
Send single text message
"""
usecase SendMessage unsafe {
  input {
    "Recepient of the message"
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

_Profile_ contains one or more [use cases](#use-case) along with the version and a general documentation for the group of use cases. It is identified by a name with an optional scope separated with a slash, for example: `communication/send-sms`. Optionally, the profile can be scoped to a specific version, for example: `communication/send-sms@2.0.1`. Profiles are versioned with [Semantic Versioning](https://semver.org/) to facilitate for breaking changes.

Profile's file has an extension `.supr` and it is _installed_ with the Superface CLI, forming a static part of the integration.

Profile is written with the [Comlink Profile language](#comlink), for example:

```hcl title="communication/send-sms.supr"
"""
Send SMS Message
Send a single SMS message or retieve its status.
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

_Map_ defines a [provider](#provider)-specific logic to fulfill the use case: what API endpoints need to be called, how to format requests and responses, and how an authentication is performed.

Maps are fetched by [OneSDK](#one-sdk) in the runtime (i.e. when the particular profile is used with the particular provider for the first time) and can be also updated in the runtime (e.g. to fix handle a breaking changes in the provider's API).

Map file has an extension `.suma` and it is written in the [Comlink Map language](#comlink). It specifies the name of the provider and the profile, along with its major and minor version. For each use case defined in the respective profile, there is a corresponding `map` directive inside the map file.

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

_Provider_ or _integration provider_ defines a set of base URLs (services), security schemes, and [integration parameters](#integration-parameter). This information is used for reusability between maps and as a security measure. Maps cannot send requests outside of services defined and cannot read values passed to the authentication scheme.

:::info Provider vs. company

From Superface perspective, single provider doesn't have to correspond to a single company. Large companies, like Google, have multiple unrelated APIs, each with its own provider, e.g. `google-apis-maps` or `google-apis-computer-vision`. On the other hand, your provider can specify services from unrelated companies if you need to use these services in a single map.

:::

Provider definition is a JSON file adhering to the [Comlink Provider schema](#comlink). The provider is _configured_ by the Superface CLI for particular profiles, which enables the respective maps to be used by [OneSDK](#one-sdk) in the runtime. Provider is identified by its name, for example: `twilio`.

:::caution Provider name limitations

Name of the provider cannot contain numbers to avoid typosquatting attacks. If you are publishing a provider into the registry, its name must start with `unverified-` prefix, e.g. `unverified-twilio`

:::

Example of the `twilio` provider:

```hcl title="twilio.provider.json"
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

## Registry {#registry}

## Integration parameter {#integration-parameter}

## OneSDK {#one-sdk}

## super.json {#super-json}

## Comlink {#comlink}
