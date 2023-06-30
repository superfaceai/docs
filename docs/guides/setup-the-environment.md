# Setup your local environment

This document guides you through the installation and basic configuration of components needed to create your own API integration that is ready to use in your application.

## Prerequisites

To install and use Superface CLI, you will need to have installed [Node.js](https://nodejs.dev/learn/how-to-install-nodejs) >= version 18.0.0, and `npm`.

## Install the CLI

The Superface CLI is a Node.js application. It provides all the tooling needed to author and manage your integrations with Superface.

```shell
brew install superface
```

<!-- ```shell
npm install --global @superfaceai/cli
``` -->

## Create a new project

Start with creating a new directory for the project

```shell
mkdir my_project
cd my_project
```

Optionally create `package.json` by running the following command:

```shell
npm init
```

Finally, you can install [OneSDK](/reference/one-sdk).

```shell
npm i @superfaceai/one-sdk@alpha
```

## (Optional) Visual Studio Code extension

You can install the VSCode extension which will give you:

- Syntax highlighting for [Comlink](/comlink)
- Code snippets

It can be installed from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=superfaceai.superface-language-client-vscode).
