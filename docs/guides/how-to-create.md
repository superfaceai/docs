# How to integrate new API: Overview

This guide walks you through the process of creating a new API integration. You will learn how to setup the development environment, author the integration in Comlink language, integrate the API in your application, and run it in the production.

:::info

Before diving into the process of authoring the integration in Comlink language you should check [Superface Catalog](https://superface.ai/catalog) and search through existing use cases. If your use case already exists in [Superface Catalog](https://superface.ai/catalog) follow the [Getting started](../getting-started.mdx) guide.

:::

Superface created new domain-specific language called _Comlink_ for abstracting API integrations. Comlink language is designed to help developers create reusable, platform-agnostic API integrations.

Comlink language documents the integration for humans and describes the integration for machines to perform the API calls and understand API responses.

## Understand the Superface terms

First let's cover the terms you will deal with throughout this guide. The _Comlink_ language key concepts are _Profile_, _Use Case_, _Map_, and _Provider_.

Let's unpack this:

- **Use Case** represents a functionality that serves a business need. For example: send email, geocode a postal address, or track a package. Use case describes its expected input and result data. Use cases are listed in _Profile_ files with `.supr` extension. For example:
  - the [Send SMS profile](https://superface.ai/communication/send-sms@1.0.1) profile contains two use cases: _Send SMS message_ and _Retrieve Message Status_.
  - the [Geocoding profile](https://superface.ai/address/geocoding@3.0.1) profile contains two use cases: _Geocode address_ and _Reverse geocode_.
  - the [Shipment information profile](https://superface.ai/delivery-tracking/shipment-info@1.0.1) profile contains a single use case: _Retrieve Shipment Status_.
- **Profile** is collection of _use cases_ that serves common cause. Profiles are files with extension `.supr`.
- **Map** connects the _Use Case_ to a _Provider_. It contains the provider-specific logic to fulfill the use case: what API endpoints need to be called, how to format requests and responses, and how an authentication is performed. Map is a file with `.suma` extension.
  - For example the [Send Email](https://superface.ai/communication/send-email) use cases can be fulfilled by many providers, e.g. Mailchimp, SendGrid, Postmark, and others.
  - For each of these providers there is a separate `.suma` file which maps the profile to the respective provider.
- **Provider** is a JSON file describing a set of host URLs, security schemes and integration parameters that fulfill use cases. One provider can be shared among multiple use cases and profiles.

![Comlink key concepts.](../../assets/comlink-key-concepts.svg)

## What is Your Goal?

Depending on your needs, you can skip some parts of the guide to focus on your particular goal.

### I Need a Completely New Use Case

> I want to launch a spaceship but there is no use case for that in your catalog!

Adding a new use case is covered by the guide. Start with [Setup the development environment](setup-the-environment.md) and then follow the next chapters. Once the use case works for you, consider publishing it into the catalog so other users can use it in their projects and map it to other providers.

### I Want to Add a New Provider for the Existing Use Case

> I want to send emails with my favorite provider, but it's not in your catalog!

Ideally there is already a use case in the catalog which covers your need, but it cannot be performed with your preferred provider.

1. [Setup the development environment](setup-the-environment.md)
2. [Add a new provider](add-new-provider.md) if the provider doesn't exist yet (it may be used by another use case)
3. [Map use case to a provider](map-use-case-to-provider.md)

### I Have an Issue With an Existing Use Case

> I have tried a use case from the catalog, but it doesn't work!

> Your map is using the provider's API incorrectly!

Most of the use cases and providers maintained by Superface are located in the [Station GitHub repository](https://github.com/superfaceai/station). If you have any issues or suggestions regarding the existing capabilities, feel free to report an issue or send a pull request!
