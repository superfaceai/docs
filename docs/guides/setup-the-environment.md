# How to setup local environment

This document guides you through the installation and basic configuration of components **needed to create own API integration**, so that you can publish it, or use it locally in your application.

## Prerequisites

To install and use Superface CLI, you will need to have installed [Node.js](https://nodejs.dev/learn/how-to-install-nodejs) version 12 or higher, and `npm`.

## Install the CLI

The Superface CLI is a Node.js application. It provides all the tooling needed to author and manage your integrations with Superface.

```shell
npm install --global @superfaceai/cli
```

## Create a new project

:::note

If you have OpenAPI specification of the API you want to integrate you can use [Interactive designer](./interactive-designer) to bootstrap the project.

:::

Start with creating a new directory for the project

```shell
mkdir my_project
cd my_project
```

Optionally create `package.json` by running the following command:

```shell
npm init
```

Now initialize Superface local folder structure in the project root.

```shell
superface init
```

It will create `superface` folder with superface configuration file `super.json`.

And as last step install [OneSDK](/reference/one-sdk).

```shell
npm install --save @superfaceai/one-sdk
```

## (Optional) Install the Visual Studio Code extension

You can install the Visual Code Code extension which will give you:

- Syntax highlighting for [Comlink](/comlink)
- Code snippets

It can be installed from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=superfaceai.superface-language-client-vscode).
