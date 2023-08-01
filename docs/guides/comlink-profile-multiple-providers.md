# Reuse Comlink profiles with multiple providers

When using the Superface CLI, it is possible to generate Comlink profiles for use cases and map them to different providers.

## Example

We will use a familiar use case, sending an email to demonstrate this using two different services, [Resend](https://resend.com) and [SendGrid](https://sendgrid.com).

### Set up providers

Start by creating providers definitions for both of those services from their respective Open API Specifications:

```shell title="Resend"
superface prepare https://raw.githubusercontent.com/resendlabs/resend-openapi/main/resend.yaml resend
```

```shell title="SendGrid"
superface prepare https://raw.githubusercontent.com/sendgrid/sendgrid-oai/main/oai.yaml sendgrid
```

### Create a use case profile

Next, create a Comlink profile for the _send an email_ use case. We'll use Resend as the default provider and explicitly set our profile ID to `emails/send-an-email`.

```shell
superface new resend "send an email" email/send-an-email
```

At this point, Superface will create a new Comlink profile in the `superface` directory named `email.send-an-email.profile`.

### Map the profile to providers

To create the maps that Superface's OneSDK can use to execute this use case with any provider, run the `superface map` command for each provider you want to use.

```shell title="Create a map for Resend"
superface map resend email/send-an-email
```

```shell title="Create a map for SendGrid"
superface map sendgrid email/send-an-email
```

As you can see, the profile referenced above is the same; only the provider name has changed.

At this point, Superface will create map files and executable examples for each provider.

### Add additional providers

If in the future you want to add some additional providers, such as [Mailgun](https://mailgun.com), you would:

1. Run `superface prepare <url-for-mailgun-api-spec> mailgun`
2. Map to the same profile using `superface map mailgun email/send-an-email`
