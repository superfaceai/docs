# Create a new use case

Use case specifies input and result parameters, and error behavior of the API integration. Use case inputs and result should not contain any provider specific parameters and provider implementation details like authentication credentials.

Use cases are defined through a [Comlink profile](../comlink/reference/profile.mdx). A profile is a set of use cases that serve the same business need. The Comlink profile is a file with `.supr` extension.

This guide will walk you through the process of defining a new use case within a Comlink profile. You will use the Superface CLI to bootstrap a new profile and learn the syntax.

## Setup

This guide assumes you have set up a Node.js project with Superface and OneSDK. If you need to set up a new project, please see the [Setup Guide](./setup-the-environment.md).

## Create New Profile

### Choose Profile Name

Profile's name must consist of lowercase letters, numbers, characters, dashes and underscores.

- Valid: `my_profile`, `myprofile123`, `my-profile`
- Invalid: `my profile`, `my+profile`, `MyProfile`

While single profile file can contain multiple use cases, we generally recommend to keep single use case per profile. So the profile can be named after the use case, for example:

- Get weather: `get-weather`
- Make payment: `make-payment`
- Send email: `send-email`

<!--
:::info

Occasionally it makes sense to put multiple use cases into a single profile file. For example, the [communication/send-email](https://superface.ai/communication/send-email) defines two use cases

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

Where `<use_case_name>` is the name of use case you wish to create.

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

## Define the use case {#usecase}

With the Comlink profile ready, you can now define your business use case. The use case is a task that needs to be done. You can think of it as a function with specified input and output parameters. The use case can also specify its safety.

### Overview {#usecase-overview}

Let's take a look at an example use case (based on the [Shipment information](https://superface.ai/delivery-tracking/shipment-info@1.0.1) capability):

```hcl
"""
Retrieve Shipment Status
Get the current shipment status.
"""
usecase ShipmentInfo safe {
  input {
    "Shipment tracking number
    Identifier of shipment"
    trackingNumber! string!

    "Carrier
    Shipment carrier identification to narrow down the results"
    carrier string!
  }

  result {
    "Carrier
    Name of the carrier responsible for delivery"
    carrier string!

    "Status
    Description of the current shipment status"
    status! string

    "Origin
    A postal address with the origin of the shipment"
    origin string

    "Destination
    A postal shipping address"
    destination string

    events! [{
      timestamp! string
      statusText! string
    }]

    "Estimated date and time of delivery"
    estimatedDeliveryDate
  }

  error {
    title! string
    detail string
  }
}
```

At the outer level, the use case is documented with [descriptions](#descriptions) in triple quotes. The definition itself starts with `usecase` keyword, the use case is named `ShipmentInfo` and is marked as `safe`, so executing it shouldn't change anything (see below for [safety](#safety)).

The use case consists of three blocks:

- [`input`](#input) with fields required for use case's execution,
- [`result`](#result) with expected fields from successful execution,
- [`error`](#error) describing the fields returned in case of execution error (e.g. due to failure on provider's end).

All these blocks consist of fields. The fields are documented with a single double quote (which is equivalent to triple quote, see [descriptions](#descriptions)). Most fields have their type defined (i.e. `string`), but the typing is optional - `estimatedDeliveryDate` field is untyped. The `events` field is an array of objects with `timestamp` and `statusText` fields. See [Field Types](#field-types) for more information about possible types. Some fields are marked with exclamation mark as [required](#required-fields) (e.g. `trackingNumber! string`), and some are marked as [non-null](#non-null) fields (e.g. `carrier string!`).

:::tip

If you prefer learning by example, you can check the source Comlink profile for all the published use cases [in the catalog](https://superface.ai/catalog). Choose a use case and click "raw" to see the code.

:::

### Specify Safety of the Use Case {#safety}

The use case can be marked as `safe`, `unsafe` or `idempotent`. If the safety is not specified, the use case is treated as `unsafe` by default.

- `safe`: The use case doesn't change anything or doesn't perform any action. Generally reading operations can be considered safe, for example retrieving information about shipment or geocoding a postal address.
- `unsafe`: The use case changes the world state and its retry may result in unintended side effects. For example, sending an email, or placing an order is unsafe: executing these use cases repeatedly results in sending multiple emails or placing multiple orders.
- `idempotent`: The use case can be executed multiple times without changing the result. For example updating an article with the same data multiple times results in the same article.

:::info HTTP Methods

If you are familiar with REST APIs and HTTP methods, you can think of the safety in this manner:

- `safe` corresponds to `GET` and `HEAD` methods,
- `unsafe` corresponds to `POST` method,
- `idempotent` corresponds to `PUT` and `DELETE` methods.

For more information see [Understanding Idempotency and Safety in API Design](https://nordicapis.com/understanding-idempotency-and-safety-in-api-design/).

:::

The safety is defined after the use case's name:

```hcl
usecase ShipmentInfo safe {}

usecase SendMessage unsafe {}

usecase UpdateProfile idempotent {}

// if safety is not specified, the use case is considered unsafe
usecase SendEmail {}
```

While the safety information is optional, it can be used by OneSDK to treat the use case in particular manner. For example, the SDK can attempt to automatically repeat a failed request if the use case is `safe`.

### Define Input Fields {#input}

To execute the use case, you typically need to provide some input. For example to send a text message, you need at least a recipient's phone number and the message's contents.

In Comlink profile, the use case's input is specified in the `input` block:

```hcl {2-5}
usecase ShipmentInfo safe {
  input {
    trackingNumber
    carrier
  }
}
```

The above use case expects an object with two optional, untyped input fields: `trackingNumber` and `carrier`. You may want to mark the field as required or specify that `carrier` must be a string - see the [More About Fields](#fields) section for more information about these features.

If the use case doesn't need any input, the `input` block can be omitted.

### Define Result Fields {#result}

Similar to defining the input, use case can describe its output (called result). Our Shipment info use case returns a result object with multiple fields:

```hcl {3-15}
usecase ShipmentInfo safe {
  // ...
  result {
    carrier
    status
    origin
    destination

    events [{
      timestamp
      statusText
    }]

    estimatedDeliveryDate
  }
}
```

In this example, the `events` field is an array of objects with the fields `timestamp` and `statusText`. The fields can also be marked as required and non-null - see [More About Fields](#fields) section.

The result itself can be also a an array or a scalar value:

```
// result is an array of objects
usecase ShipmentInfoEvents {
  result [{
    timestamp
    statusText
  }]
}

// result is a scalar value
usecase ShipmentInfoStatus {
  result string
}
```

### Define Error {#error}

The use case can define optional error fields. These will be returned when the use case execution fails:

```hcl
usecase ShipmentInfo safe {
  // ...
  error {
    title
    detail
  }
}
```

### Add Human-Readable Descriptions {#descriptions}

The use case will be consumed by computers, but humans will be the ones integrating the use case into their code. Use cases and definitions in the profile can be preceded by descriptions. A description consists of title and body surrounded either by a single double quote `"`, or three double quotes `"""` (triple quotes).

The first description in the profile should explain the overall purpose of the use case. Its title also specifies a human readable name of the profile:

```hcl title=delivery-tracking/shipment-info.supr {1-5}
"""
Shipment information

Track your shipment. Get the latest information on your shipment status.
"""

name = "delivery-tracking/shipment-info"
version = "1.0.1"

usecase ShipmentInfo safe {}
```

Both single quotes and triple quotes description can contain both title and a body of the description. In the single quote variant the title is on the same line as quote:

```hcl
"Retrieve Shipment Status
Get the current shipment status."
usecase ShipmentInfo safe {}
```

While triple quotes are separated from the description with new lines:

```hcl
"""
Retrieve Shipment Status
Get the current shipment status.
"""
usecase ShipmentInfo safe {}
```

Individual fields can be also documented:

```hcl
usecase ShipmentInfo safe {
  input {
    """
    Shipment tracking number
    Identifier of shipment
    """
    trackingNumber

    "Carrier
    Shipment carrier identification to narrow down the results"
    carrier string!
  }
}
```

:::note Single Quote vs. Triple Quote

Both description formats are functionally equivalent so the choice is up to your preference. Our current practice is to use triple quotes for high-level descriptions (for the profile itself and use cases), and single quotes for individual fields. Single quotes are also convenient when you want a single-line description (i.e. just a title).

:::

## More About Fields {#fields}

In previous steps we have used fields to define contents of input, result and error in the use case. Fields can be defined as required and non-nullable, and can specify some particular type.

### Field Types {#field-types}

If possible, define the types of fields your use case accepts or provides in result. The example Shipment Information use case expects the tracking number and carrier identification as strings:

```hcl
usecase ShipmentInfo safe {
  input {
    trackingNumber string
    carrier string
  }
}
```

The types can be either _scalar_ or _collections_. Scalar types are primitive values: `string`, `number`, `boolean`. Collections contain other collections or scalars.

Comlink supports the following collections:

- List

  - Corresponds to Array in JavaScript or List in Python.
  - Uses square brackets, e.g. `[string]` defines a list of strings.

- Object
  - Acts as a dictionary with strings for keys.
  - Corresponds to Object in JavaScript or Dictionary in Python.
  - Uses curly brackets, e.g. `{myField number}` defines an object with single field of type number.

Objects are commonly used to define inputs, results, and errors:

```hcl
usecase UseCaseName {
  input {
    inputField string
  }
  result {
    field1 string
    field2 number
  }
}
```

Lists can also contain objects, for example the following use case provides a result with a list of objects with fields `timestamp` and `statusText`:

```hcl
usecase ShipmentInfoEvents {
  result [{
    timestamp string
    statusText string
  }]
}
```

### Required Fields

By default, all fields are optional. Add `!` after the field name to mark it as required. This is especially useful for specifying use case's input to avoid executing the use case unless all required fields are provided:

```hcl
usecase ShipmentInfo safe {
  input {
    // Required field with string
    trackingNumber! string

    // Required, untyped field
    carrier!
  }
}
```

### Non-null fields

By default, all field can be `null`. To mark them as non-nullable, add `!` after the type definition.

In the following example, _if_ `carrier` is passed in the input, it must be a string, not `null`:

```hcl {4}
usecase ShipmentInfo safe {
  input {
    trackingNumber! string!
    carrier string!
  }
}
```

:::warning

Note that marking the field as non-nullable doesn't make it required. To make the field required _and_ non-nullable, you must add `!` after both the field's name and type.

:::

In the above use case the `trackingNumber` field is both required, and non-nullable:

```hcl
usecase UseCaseName {
  input {
    trackingNumber! string!
  }
}
```

## Additional Resources

- [Comlink Profile Reference](https://superface.ai/docs/comlink/profile)
- [Examples](https://github.com/superfaceai/station)
