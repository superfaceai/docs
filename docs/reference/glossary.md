---
slug: '/reference/glossary'
displayed_sidebar: referenceSidebar
---

profile
map
provider
registry
use-case
OneSDK
Comlink

## Use case

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

  error {
    title! string
    detail string
  }

  example Successful {
    input {
      to = '+12127290149',
      from = '+4915207955279',
      text = 'Your order is ready to be picked up!',
    }

    result {
      messageId = '150000003351F9D7',
    }
  }

  example Failed {
    input {
      to = '+12127290149',
      from = '',
      text = 'Your order is ready to be picked up!',
    }

    error {
      title = "Missing 'from' number",
    }
  }
}
```

## Profile

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

## Map

_Map_ defines a [provider](#provider)-specific logic to fulfill the use case: what API endpoints need to be called, how to format requests and responses, and how an authentication is performed.

Maps are fetched by [OneSDK](#onesdk) in the runtime (i.e. when the particular profile is used with the particular provider for the first time) and can be also updated in the runtime (e.g. to fix handle a breaking changes in the provider's API).

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

## Provider

## Registry

## Integration parameter

## OneSDK

## super.json

## Comlink
