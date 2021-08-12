# How to Create a Capability: Overview

While [Superface catalog](https://superface.ai/catalog) continuously grows, it's possible your particular use-case or provider might be missing. This guide walks you through the process of authoring new capabilities, from setting up the environment to running the capability in production.

## Understand the Superface Terms

First let's cover the terms you will deal with throughout this guide. The Superface capability consists of _Profile_, _Use-Cases_, _Map_, and _Provider_. In other words:

> _Capability_ is a _profile_ with _use-cases_ _mapped_ to a _provider_.

Let's unpack this:

- **Capability** represents a functionality to serve some business need. For example: sending e-mails, geocoding a postal address, or tracking a package.
- **Profile** is a file with extension `.supr` which describes the capability both for the computer and the developer in the Comlink Profile format.
It consists of one or many _use-cases_.
- **Use-Case** describes one particular piece of functionality related to the capability - its expected input and result data. It's a part of the `.supr` file. For example:
  - the [Send SMS capability](https://superface.ai/communication/send-sms@1.0.1) contains two use-cases: _Send SMS message_ and _Retrieve Message Status_.
  - for the [Geocoding capability](https://superface.ai/address/geocoding@3.0.1) contains two use-cases: _Geocode address_ and _Reverse geocode_.
  - for the [Shipment information](https://superface.ai/delivery-tracking/shipment-info@1.0.1) contains a single use-case: `Retrieve Shipment Status`.
- **Map** is a file with `.suma` extension written in the Comlink Map format. It connects the _Use-Case_ to a _Provider_. It contains the provider-specific logic to fulfill the use-case: what API endpoints need to be called, formatting requests and responses, and how authentication is performed.
  - For example the [Send Email](https://superface.ai/communication/send-email) capability can be fulfilled by many providers, e.g. Mailchimp, SendGrid, Postmark, and others.
  - For each of these providers there is a separate `.suma` file which describes the logic for all use-cases in the profile.
- **Provider** is a JSON file describing a particular on-line service to which the _Map_ can refer to. It declares the service's URLs and supported security schemas.

<!-- TODO: Fancy diagram here -->

## What is Your Goal?

Depending on your needs, you can skip some parts of the guide to focus on your particular goal.

### I Need a Completely New Capability

> I want to launch a spaceship but there is no capability for that in your catalog!

Addition of a new capability is covered by the guide. Start with [Setup the development environment](setup-the-environment.md) and then follow the next chapters. Once you the capability works for you, consider publishing it into the catalog so other users can use it in their projects and map it to other providers.

### I Want a New Provider For Existing Capability

> I want to send emails with my favorite provider, but it's not in your catalog!

Ideally there is already a capability in the catalog which covers your need, but it cannot be performed with your preferred provider.

1. [Setup the development environment](setup-the-environment.md),
2. [add a new provider](add-new-provider.md) if the provider doesn't exist yet (it may be used by another capability),
3. [map capability to a provider](map-capability-to-provider.md).

### I Have an Issue With Your Existing Capability

> I have tried a capability from the catalog, but it doesn't work!

> You are using the API wrong!

Most of the capabilities and providers maintained by Superface are currently maintained in the [Station GitHub repository](https://github.com/superfaceai/station). If you have any issues or suggestions regarding the existing capabilities, feel free to report an issue or send a pull request!
