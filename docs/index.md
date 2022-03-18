# Introduction

⚡️ Superface will help you to quickly use and manage integrations, so you can focus on your applicaition.

💸 Developing integrations over and over is expensive. Use integrations developed by others as you use NPM packages or Crates.

💥 Ready for more? Use advanced features like provider failover and Monitoring.

🔐 You data are safe, Superface isn't acting like proxy.

🧐 Superface is a language and a protocol for abstracting integrations to application use-cases. It allows use-case discovery and distribution of integration code at runtime.

🎓 This approach gives you a framework to decouple lifecycle of your application and integrations it uses.

## Fast track ⏱️

Easiest way to start with existing use-case. Lets say, you want show what wheater is in New York.

Install [Node.js](https://nodejs.org/en/download/) and create new project

```shell
mkdir my_project
cd my_project
npm init -y
```

Install [OneSDK](https://github.com/superfaceai/one-sdk-js) and configure with [Current Weather in city](https://superface.ai/weather/current-city).

```shell
npx @superfaceai/cli install weather/current-city --providers wttr-in
```

Create and open `index.js` file, and paste in:

```js
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function run() {
  // Load the installed profile
  const profile = await sdk.getProfile('weather/current-city');

  // Use the profile
  const result = await profile.getUseCase('GetCurrentWeatherInCity').perform({
    city: 'Prague, Czech Republic',
    units: 'C',
  });

  return result.unwrap();
}

run();
```

And run it

```shell
node index.js
```
