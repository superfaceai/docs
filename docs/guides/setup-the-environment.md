# How to setup local environment

This document guides you through the installation and basic configuration of components needed to create own skill. So you can publish it or use it locally in your application.

## Prerequisites

To install and use Superface CLI, you will need to have installed:

- [Node.js](https://nodejs.dev/learn/how-to-install-nodejs)
- NPM

## Install the CLI

The Superface CLI is Node.js application. Note that it requires Node.js 12 or higher.

```shell
npm install --global @superfaceai/cli
```

## Create a new project

Start with creating a new directory for the project

```shell
mkdir my_project
```

and changing the directory.

```shell
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

It will create `superface` folder with the below structure

- `grid` - folder for storing skills and mappings
- `types` - folder with generated types
- `super.json` - superface configuration file

And as last step install [OneSDK](/reference/one-sdk-js).

```shell
npm install --save @superfaceai/one-sdk
```

## (Optional) Install the Visual Studio Code extension

You can install the Visual Code Code extension which will give you:

- Syntax highlighting for [Comlink](/comlink)
- Code snippets

It can be installed from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=superfaceai.superface-language-client-vscode).
