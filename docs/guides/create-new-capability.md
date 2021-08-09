# Create a new capability

Capability is an application functionality to serve business needs. It consists of one or more use-cases targeted at particular business scenarios that the capability is designed to solve.

Use-cases are defined though a [Comlink profile](https://superface.ai/docs/comlink/profile). The Comlink profile is a file with `.supr` extension. It specifies the abstract business behavior of the use-case: its input and result parameters, error behavior and data types.

This guide will walk you through the process of defining a new capability with a Comlink profile. You will use the Superface CLI to bootstrap a new profile and learn the syntax.

## Setup

This guide assumes you have set up a Node.js project with Superface and OneSDK. If you need to set up a new project, please see the [Setup Guide](./setup-the-environment.md).

## Create New Profile

### Choose Profile Name

Profile's name must consist of alpha-numeric characters, dashes and underscores.

Valid
: `my_profile`, `myprofile`, `my-profile`

Invalid
: `my profile`, `my+profile`

While single profile file can contain multiple use-cases, we generally recommend to keep single use-case per profile. So the profile can be named after the use-case, for example:

- Get weather: `get-weather`
- Make payment: `make-payment`
- Send email: `send-email`

<!--
:::info

Occasionally it makes sense to put multiple use-cases into a single profile file. For example, the [communication/send-email](https://superface.ai/communication/send-email) defines two use-cases

:::
-->

:::tip Scoped profiles
Profile name can contain scope for grouping profiles together.
To scope a profile, add `scope-name/` before profile name, for example: `communication/send-email`.
:::

### Bootstrap With CLI

You can use the [Superface CLI](https://github.com/superfaceai/cli) to set up an empty Comlink profile:

```shell
superface create --profile --profileId <use_case_name>
```

Where `<use_case_name>` is the name of use-case you wish to create.

:::tip CLI Help
Use the `--help` flag for more options and examples:

```shell
superface create --help
```

:::

The CLI creates `use_case_name.supr` file in current directory and links to it from the `superface/super.json`.

The new profile will look similarly to this:

```hcl title=use_case_name.supr
name = "use_case_name"
version = "1.0.0"

"""
UseCaseName usecase
"""
usecase UseCaseName {}
```

## Define the Use-Case {#usecase}

With the Comlink profile ready, you can now define your business use-case. The use-case is a task that needs to be done. You can think of it as a function with specified input and output parameters. The use-case can also specify its safety.

### Overview

<!-- TODO: General usecase syntax -->

### Specify Safety of the Use-Case {#safety}

The use-case can be marked as `safe`, `unsafe` or `idempotent`. If the safety is not specified, the use-case is treated as `unsafe` by default.


`safe`
: The use-case doesn't change anything or doesn't perform any action. Generally reading operations can be considered safe, for example retrieving information about shipment or geocoding a postal address.

`unsafe`
: The use-case changes the world state and its retry may result in unintended side effects. For example, sending an email, or placing an order is unsafe: executing these use-cases repeatedly results in sending multiple emails or placing multiple orders.

`idempotent`
: The use-case can be executed multiple times without changing the result. For example updating an article with the same data multiple times results in the same article.

:::info HTTP Methods

If you are familiar with REST APIs and HTTP methods, you can think of the safety in this manner:

- `safe` corresponds to `GET` and `HEAD` methods,
- `unsafe` corresponds to `POST` method,
- `idempotent` corresponds to `PUT` and `DELETE` methods.

For more information see [Understanding Idempotency and Safety in API Design](https://nordicapis.com/understanding-idempotency-and-safety-in-api-design/).

:::

The safety is defined after the use-case's name:

```hcl
usecase ListOrders safe {}

usecase SendMessage unsafe {}

usecase UpdateProfile idempotent {}

// if safety is not specified, the use-case is considered unsafe
usecase SendEmail {}
```

While the safety information is optional, it can be used by OneSDK to treat the use-case in particular manner. For example, the SDK can attempt to automatically repeat a failed request if the use-case is `safe`.

### Define Input Fields {#input}

To execute the use-case, you typically need to provide some input. For example to send a text message, you need at least a recipient's phone number and the message's contents. 

In Comlink profile, the use-case's input is specified in the `input` block:

```hcl {2-5}
usecase SendMessage unsafe {
  input {
    to
    message
  }
}
```

The above use-case expects an object with two optional, untyped input fields: `to` and `message`. You may want to mark the field as required or specify that `message` must be a string - see the [More About Fields](#fields) section for more information about these features.

If the use-case doesn't need any input, the `input` block can be omitted.

### Define Result Fields {#result}

Similar to defining the input, use-case can describe its output (called result). For example the [Geocoding use-case](https://superface.ai/address/geocoding) provides and object with fields latitude and longitude:

```hcl
usecase Geocode {
  // ...
  result {
    latitude
    longitude
  }
}
```

The result can be also just a plain value (e.g. string) or array, specify optionality and type, and reuse named models. See [More About Fields](#fields) section.

### Define Error {#error}

The use-case can define optional error fields. These will be returned when the use-case execution fails:

```hcl
usecase SendEmail unsafe {
  // ...
  error {
    title
    detail
  }
}
```

## Add Human-Readable Descriptions {#descriptions}

The use-case will be consumed by computers, but humans will be the ones integrating the use-case into their code. Any block and definition in the profile can be preceded by a description. It consists of title and body surrounded either by a single double quote `"`, or three double quotes `"""`.

The first description in the document should explain the overall purpose of the use case. Its title also specifies a human readable name of the profile:

```hcl title=send-email.supr {1-5}
"""
Send Email

Send one transactional email
"""

name = "communication/send-email"
version = "1.1.1"

usecase SendEmail unsafe {}
```

Both single quotes and triple quotes description can contain both title and a body of the description. In the single quote variant the description must be indented:

```hcl
"Use case name
  Description of the use case"
usecase UseCaseName {}
```

In the triple quote variant the description starts on a new line:

"""
Use case name
Description of the use case
"""
usecase UseCaseName {}
```

Individual fields can be also documented:

```hcl
usecase SendEmail {
  input {
    "To
      The recipient's identificator."
    to

    "Message
      Text of the message"
    message
  }

  "Message ID
    Result should be unique message identifier."
  result string
}
```

<!-- TODO: Why prefer single / triple quote over the other? Can I mix them or it's discouraged? -->

<!-- ???: "It is also possible to add title and description to each field >>and result itself.<<  per-spec this is not possible -->

## More about fields {#fields}

In previous steps fields were used to define inputs, result and error.

Fields can be defined as `scalar` or `collection` types.
Comlink refers to types as [Models](https://superface.ai/docs/comlink/profile#sec-Model-Definition).

### Field Types {#field-types}

For type safety, you can specify model of the field.

Comlink supports following `scalar` models:

- `string`
- `number`
- `boolean`

```hcl
usecase UseCaseName {
  input {
    contanctId number
    name string
    isActive boolean
  }
}
```

_For details about scalar types see [Scalar Model](https://superface.ai/docs/comlink/profile#sec-Scalar-Model)._

Now when you know about scalar models lets have a look at various collections.

- `Object`
- `List`

Result as `obejct`:

```hcl
usecase UseCaseName {
  result {
    field1 string
    field2 number
  }
}
```

Result as `list` of `objects`:

```hcl
usecase UseCaseName {
  result [{
    field1 string
    field2 number
  }]
}
```

_All supported Models are decribed in [Model Definition](https://superface.ai/docs/comlink/profile#sec-Model-Definition)_

### Required fields

Fields are by default optional. To make them required, you can use `!`.

```hcl
usecase SendMessage unsafe {
  input {
    to!
    message!
    attachment
  }
}
```

### Non-null fields

By default field can be null. To make it non-null, you can use `!` on type definition.

```hcl
usecase UseCaseName {
  input {
    contactId number!
  }
}
```

The above definition says, if `contactId` is passed as input, it must be a number.

```hcl
usecase UseCaseName {
  input {
    contactId! number!
  }
}
```

Here is field required and must be non-null. In other words a number must be passed as input.

## Additional resources

- [Comlink Profile Reference](https://superface.ai/docs/comlink/profile)
- [Examples](https://github.com/superfaceai/station)
