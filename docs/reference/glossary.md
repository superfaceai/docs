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

For example, the [Send SMS Message](https://superface.ai/communication/send-sms@2.0) expects recipient's phone number, sender's phone number, and the text message contents. It will return a message ID as the result.

The use case is defined as follows, in the [Comlink Profile language](#comlink):

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

## Map

## Provider

## Registry

## Integration parameter

## OneSDK

## super.json

## Comlink
