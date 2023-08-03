# Setup your local environment

This document guides you through the installation and basic configuration of components needed to create your own API integration that is ready to use in your application.

## Prerequisites

To install and use Superface CLI, you will need to have installed [Node.js](https://nodejs.dev/learn/how-to-install-nodejs) >= version 18.0.0, and `npm`.

## Install the CLI

The Superface CLI provides all the tooling needed to author the Comlinks for your integration and can be installed using [Homebrew](https://brew.sh/) on MacOS/Linux or [NPM](https://www.npmjs.com/) on Windows.

```shell title="Install with Homebrew"
brew install superfaceai/cli/superface
```

```shell title="Install with NPM"
npm install -g @superfaceai/cli@latest
```

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
npm i @superfaceai/one-sdk@beta
```

## (Optional) Visual Studio Code extension

You can install the VSCode extension which will give you:

- Syntax highlighting for [Comlink](/comlink)
- Code snippets

It can be installed from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=superfaceai.superface-language-client-vscode).
