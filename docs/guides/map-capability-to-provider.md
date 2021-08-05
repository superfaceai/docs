# Map capability to a provider

_Map_ is a [Comlink](/comlink) document that defines how a specific capability is fulfilled by a provider. It creates a mapping between the abstract profile and the concrete HTTP requests necessary to integrate with the provider.

## Setup

This guide assumes you have a project set up with Superface installed. If you need to set up a new project, please reference the [Setup Guide](/guides/setup-the-environment).

### Prerequisites

- Existing [profile](/guides/create-new-profile)
- Existing [provider definition](/guides/add-new-provider)

## Create new Map document

Mapping happens between _a specific version of Profile_ and some _Provider_. Choose which profile version you want to fulfill by the provider.

The easiest way to then bootstrap a new Map document is using [Superface CLI](/reference/cli).

```shell
superface create --map --profileId <profile-name@version> --providerName <provider-name>
```

_Replace the `<profile-name@version>` and `<provider-name>` in the command with the actual profile and provider you wish to create new Map for._ 

Running the above command creates a new Comlink file and links the new map in your local `super.json` configuration file. The new empty map will look something like this:

```hcl title="<profile-name>.<provider-name>.suma"
profile = "<profile-name>@<version>"
provider = "<provider-name>"

"""
Comment for the map to UseCaseName
"""
map UseCaseName {} // UseCaseName will be different based on the actual use case in the profile
```


## Map use cases

Every profile defines one or more _use cases_. You need to map the use case interfaces to the concrete requests and results towards a provider. If you used CLI to bootstrap the map, it will have pre-defined empty mappings for every profile use case.

### Reading use case inputs {#input-object}

Use cases usually define & expect some _inputs_ from the user. These inputs are [defined in profile in the dedicated field](https://superface.ai/docs/comlink/profile#sec-Use-case).

You can access these inputs via `input` object which is available _inside use case mapping_.

<details>
  <summary>Example</summary>

  Given the following use case definition in a profile:

```hcl title="profile.supr" {4-7}
...

usecase GetWeather {
  input {
    location
    units
  }

  result {
    ...
  }
}

...
```

  These input props are accessible in the use case mapping.

```hcl title="profile.provider.suma" {4-6}
...

map GetWeather {
  // `input` object available
  // `input.location`
  // `input.units`
}

...
```

</details>

### Make HTTP request {#http-request}

Define the first request by specifying the `http` block with HTTP method and URL path.

All widely known HTTP methods are supported. The path is a simple _string_, but can be templated. _E.g. if you need to request resource whose ID was provided in the input, you might want to use something like `/resources/{input.id}`._

```hcl title="<profile-name>.<provider-name>.suma" {5-7}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {

  }
}
```

_The above definition makes `POST` HTTP call to [the provider's default service](/guides/add-new-provider#default-service) on path `/api/messages`.<br />See [Comlink reference](https://superface.ai/docs/comlink/map#sec-HTTP-Call) for specifying a different service & other `http` block features._

### Authenticate the request (optional) {#authentication}

To authenticate the request, simply reference the _security scheme ID_ you want to use for the specific request in `security` definition. Security schemes are defined in Provider JSON documents.

```hcl title="<profile-name>.<provider-name>.suma" {6}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

  }
}
```

_Replace `scheme-id` with one of the schemes defined for the provider you're mapping to.<br />See [Comlink reference](https://superface.ai/docs/comlink/map#sec-HTTP-Security) for details on `security` definition._

### Pass data to request

You can pass any data to the request by adding `request` block. Inside, you can pass data to _headers, query or body_ by specifiying `headers`, `query` or `body` blocks, respectively.

When passing data in _body_, it's a best practice to also define the request content type.

```hcl title="<profile-name>.<provider-name>.suma" {8-17}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

    request "application/json" {
      query {
        from = input.from
      }

      body {
        to = input.to
        text = input.text
      }
    }
  }
}
```

_The above definition makes call to `/api/messages?from=...` with body  of content type `application/json` including object with 2 parameters (`to` & `text`).<br />See [Comlink reference](https://superface.ai/docs/comlink/map#sec-HTTP-Request) for details on `request` block._

### Handle server responses {#handle-response}

You can handle various server responses by introducing one or more `response` blocks inside `http` block. Responses are matched with their respective handler by a combination of _status code, content type_ and _content language_.

```hcl title="<profile-name>.<provider-name>.suma" {10-12,14-16}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

    request "application/json" { /* ... */ }

    response 201 "application/json" {
      // handler context for success response
    }

    response 400 "application/problem+json" {
      // handler context for error response
    }
  }
}
```

_The above example definition:_
- _handles any response with status code `201` and  `application/json` content type in success context,_
- _handles any response with status code `400` and  `application/problem+json` content type in error context._

_Any other response won't be handled and will result in an unexpected error_.

_See [Comlink reference](https://superface.ai/docs/comlink/map#sec-HTTP-Response) for details on `response` block & response matching._

:::note

Some APIs always return a single status code (usually `200`) and mark the response successful/failed somehow in body (either via a boolean flag or by the response format). For such APIs, use a single response handler and refer to [Conditional mapping](#conditional-mapping) below.

:::

### Access response data {#response-data}

Every `response` block creates a context that automatically exposes the response data via 3 variables:

- `statusCode` (_number_): HTTP response status code
- `headers` (_object_): HTTP response headers
- `body` (_object_): HTTP response body

```hcl title="<profile-name>.<provider-name>.suma" {11}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

    request "application/json" { /* ... */ }

    response 201 "application/json" {
      // code in this block can reference `statusCode`, `headers` & `body`
    }
  }
}
```

_See [Comlink reference](https://superface.ai/docs/comlink/map#sec-HTTP-Response.Context-Variables) for details on context variables inside `response` block._

### Map use case result {#map-result}

Typically, use cases expect some [_result_](https://superface.ai/docs/comlink/profile#sec-Use-case) to be returned after they are performed. For some, it may be a simple confirmation of the success _(e.g. SMS was sent, here's in ID)_. For others, the result may be the sole reason you care about the use case _(e.g. Found this address for given coordinates)_.

Map the use case result from the provider's HTTP response using `map result` statement. Note that you must resolve to the same _result_ interface as defined in the profile document.

```hcl title="<profile-name>.<provider-name>.suma" {11-14}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

    request "application/json" { /* ... */ }

    response 201 "application/json" {
      map result {
        messageId = body.message_sid
        remainingMessages = headers["X-CREDIT-LEFT"] / 0.3
      }
    }
  }
}
```

_The above definition maps the 2 expected result fields. One from the response's body, the other is loaded from headers and transformed with a simple Comlink expression.<br />See [Comlink reference](https://superface.ai/docs/comlink/map#sec-Map-Result) for detailed specification of `map result` statement._


:::note 

`map result` is a regular Comlink statement; and as such can theoretically happen from anywhere inside the use case mapping, not necessarily from an inside of the response handler. An example of this would be a capability that doesn't need to call a remote server. However this is _very rare_ and the results are usually mapped from the HTTP responses so the example shows the most common place where the result mapping happens.

:::

### Map errors {#map-error}

In addition to the result, use cases sometimes also expect a specific [_error_](https://superface.ai/docs/comlink/profile#sec-Use-case) interface to be returned from the perform if it fails.

This is very useful as you can map the provider specific API errors (that usually use a technical language) to nicer and more helpful errors that use the language of the use case domain. If the profile defines _error_ expectation, you should strongly consider mapping the possible errors since this dramatically improves the usability of the capability.

Map all the possible use case errors from the provider's HTTP responses using `map error` statement. Note that you must resolve to the same _error_ interface as defined in the profile document.

It's very common for maps to include various different error mappings, each for a different error scenario.

```hcl title="<profile-name>.<provider-name>.suma" {12-17}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

    request "application/json" { /* ... */ }

    response 201 "application/json" { /* ... */ }

    response 429 {
      map error {
        title = "Sending messages too frequently"
        details = (`You can send more message after ${headers['Retry-After']} seconds`)
      }
    }
  }
}
```

_The above definition maps the 2 expected error fields when server responds with status `429 (Too Many Requests)`. One is hardcoded as it describes the error scenario, the other constructs a helpful message with a value from response headers using a simple Comlink expression.<br />See [Comlink reference](https://superface.ai/docs/comlink/map#sec-Map-Error) for detailed specification of `map error` statement._


:::note 

`map error` is a regular Comlink statement; and as such can theoretically happen from anywhere inside the use case mapping, not necessarily from an inside of the response handler. Although the errors are usually mapped from the failed HTTP responses, sometimes you might want to map error from different places. _One example would be validating the inputs against some domain rule. In such case, you might want to map error (or; fail early) when invalid inputs were provided, even before making the request._

:::

### Conditional mapping {#conditional-mapping}

#### Always 200

Some APIs don't follow the HTTP conventions and choose to return the same status code on every response (typically the _success_ `200`), then differentiate between a success and fail using a flag in the body or a similar mechanism.

When dealing which such APIs, map the result & errors based on a condition rather than from an inside of different response handlers.

```hcl title="<profile-name>.<provider-name>.suma" {10-20}
profile = "<profile-name>@<version>"
provider = "<provider-name>"

map UseCaseName {
  http POST "/api/messages" {
    security "scheme-id"

    request "application/json" { /* ... */ }

    response 200 "application/json" {
      map error if (body.error) {
        title = "Couldn't send the message"
        detail = body.error.reason
      }

      map result {
        messageId = body.data.message_sid
        remainingMessages = body.data.credits_left / 0.3
      }
    }
  }
}
```

_The above definition maps the use case outcome based on the presense and value of `error` body param. If `error` param is present and truthy, the outcome of the use case in “error” (incl. some details). Otherwise, the use case's outcome is a valid “result” that maps data from `data` body object._

<details>
  <summary>Example: Server responses mapped in above definition</summary>

```json title="Server response body on success"
{
  "error": null,
  "data": {
    "message_sid": "76TUA987ZHAX",
    "credits_left": 5.1
  }
}
```

```json title="Server response body on failure"
{
  "error": {
    "reason": "You ran out of credits. Please top up your account."
  },
  "data": null
}
```

</details>

_See [Comlink reference](https://superface.ai/docs/comlink/map#sec-Conditions) for more about conditions._

#### Multiple errors

Mapping based on a condition is useful for handling multiple error cases coming under a single response status. This is common for `400 (Bad Request)` errors.

```hcl title="Handling responses with status 400" {2-5,7-10,12-14}
response 400 "application/problem+json" {
  return map error if (body.error_code === "InvalidPhone") {
    title = "Invalid phone number"
    detail = "Please provide phone number in E.164 format"
  } 

  return map error if (body.error_code === "InvalidKey") {
    title = "Unauthorized"
    detail = "Please provide a valid API key in format 'TWL_8765678X'"
  }

  map error {
    title = "Unexpected Error"
  }
}
```

_The above map expects the use case to fail in some scenarios when the user provides invalid inputs. It handles these scenarios by matching `error_code` returned in the response body and maps these technical enum values to much more helpful title & detail readable to the end user. Then, a regular `map error` without a condition is used to handle all other scenarios (which are clearly not expected to happen)._

_Note: the `return` keyword serves the purpose of early return, as you might recognize from other programming languages. Without `return`, the execution would continue to the `map error` without any condition at the end, and that would overwrite the error returned from the response handler._

_See [Comlink reference](https://superface.ai/docs/comlink/map#sec-Conditions) for more about conditions._

## Using functions, conditions, iterations and more {#advanced}

The example Map snippets throughout this guide demonstrated only a portion of Comlink language.

For more complicated maps, you'll find a need for the general programming concepts like reusable functions, conditions, iterations, complex expressions or data manipulation.

:::tip

Comlink supports everything you might expect from a powerful scripting language. We recommend to explore the language by consulting [Comlink Map reference](https://superface.ai/docs/comlink/map) or [the examples below](#examples).

:::

## Examples {#examples}

- [Map with reusable operations, iterations & expressions](https://github.com/superfaceai/station/blob/main/capabilities/delivery-tracking/shipment-info/maps/dhl.suma)
- [Map with multiple error response mappings](https://github.com/superfaceai/station/blob/main/capabilities/communication/send-email/maps/postmark.suma)