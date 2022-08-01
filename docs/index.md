---
slug: /
id: introduction
---

# Introduction

⚡️ Superface will help you quickly use and manage integrations, so that you can focus on developing your application.

💸 Developing integrations over and over is expensive. Use integrations developed by others the same way you'd use npm packages or crates.

🔐 You data is safe, Superface isn't a proxy nor a middle-man.

🎓 This approach gives you a framework to decouple the lifecycle of your application and the integrations it uses.

💥 Ready for more? Use advanced features like [provider failover](./guides/using-multiple-providers.mdx#failover) and [monitoring](./guides/integrations-monitoring.mdx).

🧐 Superface is a language and a protocol for abstracting integrations as application use-cases. It allows use-case discovery and distribution of integration code at runtime.

## Fast track ⏱️

The easiest way to start is with [OneSDK](https://github.com/superfaceai/one-sdk-js) for Node.js and with an existing [use case](./reference//glossary.md#usecase). Let's say you want to see what repositories Superface has on GitHub.

Install [Node.js](https://nodejs.org/en/download/) and create a new project with [OneSDK](https://github.com/superfaceai/one-sdk-js):

```shell
mkdir my_project
cd my_project
npm init -y
npm install --save @superfaceai/one-sdk
```

Create `index.js` file, and insert the following code:

```js
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const sdk = new SuperfaceClient();

async function main() {
  // Load the profile identified by profile ID and version
  const profile = await sdk.getProfile('vcs/user-repos@2.0.1');

  // Load use case, pass use case name as argument
  const useCase = profile.getUseCase('UserRepos');

  // Invoke the use case, pass user in perform input parameter and provider name in perform options
  const result = await useCase
    .perform({
      user: 'superfaceai', // use case input, in our case GitHub user name
    }, {
      provider: 'github' // provider name
    });

  // Handle the result
  try {
    const data = result.unwrap();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

main();
```

Run it:

```shell
node index.js
```

:::tip

Check out [how Superface works](./how-superface-works.mdx) to learn more about what goes on under the hood.

Or read [getting started](./getting-started.mdx) for a more detailed step-by-step guide.
:::
