# Overview

The following guides will give you more insight into the deeper workings of the Superface system. You will learn how to setup the development environment, understand how to edit Comlinks for providers and use cases, set up API keys correctly, test your Comlinks and debug requests and responses.

## What is _Comlink_

Comlink is a term you'll hear a lot - in the CLI, in OneSDK, and throughout these docs - but what is it?

Comlink is Superface's domain-specific language called for abstracting API integrations. The Comlink language is designed to help our AI create reusable, platform-agnostic API integrations and speed up developer workflow.

The Comlink language documents the integration for humans and describes the integration for machines to perform the API calls and understand API responses.

## Additional terminology

Comlink is probably new to you, so let's cover the terms you will deal with throughout this guide. The _Comlink_ language key concepts are _Profile_, _Use Case_, _Map_, and _Provider_. Let's break down what each of them means:

- [Profile](../reference/glossary.md#profile) is collection of _use cases_ that serves common cause. Profiles are files with `.profile` extension.
- [Use Case](../reference/glossary.md#use-case) represents a functionality that serves a business need.
- [Map](../reference/glossary.md#map) connects the _Use Case_ to a _Provider_. Maps are files with `.map.js` extension.
- [Provider](../reference/glossary.md#provider) is a JSON file describing a set of host URLs, security schemes and integration parameters that fulfill use cases.

![Comlink key concepts.](../../assets/comlink-key-concepts-2023.png)
