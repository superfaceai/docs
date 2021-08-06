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

<!-- TODO: General usecase syntax -->

### Specify Safety of the Use-Case

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

### Define input {#input}

Next should be defining [input](https://superface.ai/docs/comlink/profile#Input). To stay with the analogy of the function and the task, inputs are arguments of the function or information that are needed to complete the task.

```hcl
usecase SendMessage unsafe {
  input {
    to
    message
  }
}
```

_In above definition adds two input fields `to` and `message`. To understand fields in depth, check [More about fields](#fields) section._

_If the use-case doesn't need any input, you can skip it._

### Define result {#result}

Once inputs are defined, you should tell what is desired outcome. Think about [result](https://spec.superface.ai/draft/profile-spec.html#Result) as of return value of the function or expected outcome of the task.

```hcl
usecase UseCaseName {
  result string
}
```

_This definition says the result should be a string._

```hcl
usecase UseCaseName {
  result {
    field1
    field2
  }
}

usecase UseCaseName {
  result [number]
}
```

_In this cases result is object with fields, or list of numbers._

_Result can be one of many models, see [Field Types](#field-types) to learn more._

### Define error {#error}

If something goes wrong [error](https://superface.ai/docs/comlink/profile#Error) should be defined, to be able to get detailed information about error that occured.

```hcl
usecase UseCaseName {
  error {
    name
    message
  }
}
```

_The above definition says that error should have name and message fields._

## Provide human readable descriptions {#descriptions}

Now you should add human readable description so other developers can understand what the use-case does.

[Description](https://superface.ai/docs/comlink/profile#sec-Description) consists of two parts `title` and `description` and is surrounded by `"` (double quotes) or by `"""` (three double quotes).

```hcl title=my_profile.supr
"""
My Profile

This is example profile to demonstrate how to add human readable description to profile.
"""

name = "my-profile"
version = "1.0.0"

usecase UseCaseName {}
```

_The above definition adds well formated profile name (`My Profile`) and description_

```hcl
"Use case name
  Description of the use case"
usecase UseCaseName {}

"""
Use case name

Description of the use case
"""
usecase UseCaseName {}
```

_This definition adds use-case title and desctiption in two possible ways._

```hcl
usecase UseCaseName {
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

_It is also possible to add title and description to each field and result itself._

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
