# Create a new capability

Capability is application functionality to serve business needs.

Capability is defined through use-cases, which are the business scenarios that the capability is designed to solve.

Use-cases are defined in [Comlink profile](https://superface.ai/docs/comlink/profile), which enables you to describe business behavior without a need to go deep into the implementation details.

Comlink profile has several keywords and in this guide, you will learn how to use them to define your own capability.

## Setup

This guide assumes you have a project set up with Superface installed. If you need to set up a new project, please see the [Setup Guide](/guides/setup-the-environment).

## Create new Profile document

### Choose Profile Name

Profile name must consist of alpha-numeric characters, dashes and underscores.

**Valid:** `my_profile`, `myprofile`, `my-profile`<br/>
**Invalid:** `my profile`, `my+profile`

By convention, one profile should comprise one use-case (E.g. “Get weather” or “Make payment”).

So good practice is to name your profile after the use-case.

- Get weather -> `get-weather`
- Make payment -> `make-payment`

:::tip Scoped profiles
Profile can be scoped, which allows to group profiles together.
To scope a profile, add `scope-name/` before profile name `[ProfileScope/]<ProfileName>`.

For example: `communication/send-email`
:::

### Bootstrap with CLI

The easiest way to create a new Profile document is to use [Superface CLI](https://github.com/superfaceai/cli).

```shell
superface create --profile --profileId <use_case_name>
```

_replace `<use_case_name>` with the name of use-case you wish to create._

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
