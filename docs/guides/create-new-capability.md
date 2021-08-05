# Create a new Capability

Capability is application functionality to serve business needs.

Capability is defined in [Comlink profile](https://superface.dev/docs/comlink/profile), which enables you to describe business behavior without a need to go deep into the implementation details.

Comlink profile has several keywords and in this guide, you will learn how to use them.

## Setup

This guide assumes you have a project set up with Superface installed. If you need to set up a new project, please see the [Setup Guide](/guides/setup-the-environment).

## Create a Profile document

### Choose the name

Profile should consist of alpha-numeric characters, dashes and underscores<br/>
**Valid:** `my-profile`<br/>
**Invalid:** `my profile`.

By convention, one profile should comprise of one use-case (E.g. “Get weather” or “Make payment”).

So you can name your profile by use-case name.

Examples:

- Get weather -> `get_weather`
- Make payment -> `make_payment`

### Bootstrap with CLI

The easiest way to create a new Profile is to use [Superface CLI](https://github.com/superfaceai/cli).

```shell
superface create --profile --profileId <use_case_name>
```

_replace `<use_case_name>` with name of the name of use-case you wish to create._

:::tip see help
You can use the `--help` flag to see more options.
:::

As result you will see new file called `use_case_name.supr` and updated `superface/super.json` linking your new profile.

Created profile will look similarly to this:

```hcl title=use_case_name.supr
name = "use_case_name"
version = "1.0.0"

"""
UseCaseName usecase
"""
usecase UseCaseName {}
```

## Define Usecase {#usecase}

Now it is time to describe what functionality is needed in the application.
To do that you will need to define `usecase`. If you are a programmer you can imagine use-case as a function. If programming isn't your thing, you can think of it as a task that needs to be done.

Since profile was bootsrapped with CLI, the use-case is already defined.

```hcl
usecase UseCaseName {}
```

:::tip Use PascalCase to name usecases
By convention, use [PascalCase](https://techterms.com/definition/pascalcase) to name your usecases.
:::

### Specify Safety of the Use-Case

You can mark usecase as `safe`, `unsafe` or `idempotent`, to declare how it should be treated by OneSDK.

If you do not specify safety, Superface will assume usecase is `unsafe`.

`safe` usecase is a usecase that is safe to execute. It means that it doesn't change the world state. So any data reading is considered safe.

`unsafe` usecase is a usecase that changes the world state. For example, sending an email, or placing an order is unsafe usecase.

`idempotent` usecase is a usecase that is idempotent. It means that it can be executed multiple times without changing the result.

```hcl
usecase SendMessage unsafe {}
usecase ListOrders safe {}
usecase UpdateProfile idempotent {}
```

## Input {#input}

Next should be defined inputs. To stay with the analogy of function and task, inputs are arguments of the function or information that are needed to complete the task.

Input is an [object](https://superface.dev/docs/comlink/profile#sec-Object-Model) which consists of one or more fields.

If the use-case doesn't need any input, you can skip it.

To add input to use-case, you use `input` keyword and define fields.

```hcl
usecase SendMessage unsafe {
  input {
    to
    message
  }
}
```

To learn understand fields in depth, check [More about fields](#fields) section.

## Result {#result}

Once inputs are defined, you should tell how outcome should look like. [Result](https://spec.superface.dev/draft/profile-spec.html#Result) is a return value of the function or expected outcome of the task.

You can define result as `scalar` value

```hcl
usecase UseCaseName {
  result string
}
```

Or collection

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

Result can be one of many models, see [Field Types](#field-types) to learn more.

## Error {#error}

If something goes wrong, for example, the request is unauthenticated, model of the [error](https://superface.dev/docs/comlink/profile#Error) should be defined. Then you will be able to get details about it in your application.

It can be simple error message:

```hcl
usecase UseCaseName {
  error string
}
```

or something more complex such as [application problem](https://datatracker.ietf.org/doc/html/rfc7807)

```hcl
usecase UseCaseName {
  error {
    type
    title
    detail
    instance
  }
}
```

## Provide human readable description {#descriptions}

Human readable description should be added in the profile, so others can better understand meaning of the profile, usecase or particular field.

[Description](https://superface.dev/docs/comlink/profile#sec-Description) consists of two parts `title` and `description` and is surrounded by `"` (double quotes) or by `"""` (three double quotes).

For profile add description to beginning of the file:

```hcl title=my-profile.supr
"""
My Profile

This is example profile to demonstrate how to add human readable description to profile.
"""

name = "my-profile"
version = "1.0.0"

usecase UseCaseName {}

```

For use-case you can define it as:

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

Similarly can be added description to fields:

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

## More about fields {#fields}

In previous steps fields were used to define inputs, result and error.

Fields can be defined as `scalar` or `collection` types.
Comlink refers to types as [Models](https://superface.dev/docs/comlink/profile#sec-Model-Definition).

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

_For details about scalar types see [Scalar Model](https://superface.dev/docs/comlink/profile#sec-Scalar-Model)._

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

_All supported Models are decribed in [Model Definition](https://superface.dev/docs/comlink/profile#sec-Model-Definition)_

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
