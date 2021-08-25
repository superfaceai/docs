
# Getting started with Superface 

## How Superface works

  Superface is all about you, the consumer of API capabilities. To get started, first pick a capability and its provider, install it to your application and use Superface One SDK to make the call.

  Unlike every other API client no **API details are hard-coded in your application or the SDK**. 

  The instructions how to make a call are downloaded during your App runtime and resolved by One SDK to make a **direct HTTP** call to the API. The calls go straight from your App to the provider's API and are **never proxied through Superface**.

  <img src="/docs/img/how-it-works-detail.png" alt="how it works" width="500px" />

  The following steps will guide you how to get started with Superface and One SDK in 5 minutes.

1. ### Pick a capability
	  
    To start, select what capability you would like to use in your application. Each capability is described by its profile and have its unique id. In this guide, we will use the capability to **list user repositories of a VCS** like GitHub or Gitlab, that has the id `vcs/user-repos`. 
    
    <sup>If you are interested in detailed description of the capability, you can check its <a href="https://superface.ai/vcs/user-repos">profile detail page ➚</a>.</sup><br />
    <sup>You can discover more <a>capabilties at Superface.ai ➚</a>.</sup>

1. ### Pick provider
	
    The next step is to **pick a provider that you would like to use**. In this guide we will continue with `github`. 

    <sup>You can find the list of capability providers at its <a href="https://superface.ai/vcs/user-repos">profile detail page ➚</a>.</sup><br />

1. ### Install OneSDK

    In your application directory, install the One SDK library (`@superfaceai/one-sdk`):

    ```shell
    $ npm install @superfaceai/one-sdk
    ```

1. ### Install capability

    Next, add the `vcs/user-repos` capability to your application using the Superface CLI (`@superfaceai/cli`):
 
    ```shell
    $ npx @superfaceai/cli install vcs/user-repos
    ```

1. ### Configure provider

    The next step is to configure the provider you want to use. In our case we are configure `github` for capabiltiy profile `vcs/user-repos`:

    ```shell
    $ npx @superfaceai/cli configure github --profile vcs/user-repos
    ```

    <sup>In many cases this step may need to setup provider credentials but since we are using the unauthenticatd GitHub API we can skip it for now. To learn how to authenticate providers check the <a href="#">provider authentication ➚</a>.</sup>

1. ### Code

    Finally, use the One SDK in your Application. If you are starting from scratch create the `index.js` with the following JavaScript code:

    ```shell
    $ touch index.js
    ```
	
    ```js title="index.js"
    const { SuperfaceClient } = require('@superfaceai/one-sdk');
    const sdk = new SuperfaceClient();

    async function main() {
      // Load the capability profile
      const profile = await sdk.getProfile('vcs/user-repos');

      // Invoke the capability use case
      const result = await profile
        .getUseCase('UserRepos')
        .perform({
          user: 'superfaceai'
        });

      // Handle the result
      try {
        const data = result.unwrap();
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    }

    main();
    ```

1. ### Run

    With capability installed, provider configured and One SDK, it is the time to execute your App:
    
    ```shell
    $ node index.js
    ```

1. ### Introspecting HTTP communication

    To see what API calls One SDK made to GitHub' API set the environment variable `DEBUG` to `superface:http*`:

    ```shell
    $ DEBUG="superface:http*" node index.js
    ```

    <sup>Note this can print out potentially sensitive informations. Set the DEBUG value to `*` to see everything what is going in under the hood. You can always check One SDK's documentation and source code for more details.</sup>

1. ### Understanding runtime integration

    During the application runtime One SDK downloaded so-called Comlink map from Superface servers. This Comlink maps instructs the SDK how to make the direct call to GitHub API to deliver the requested capability. 

    You can always check the Comlink map source at profile's detail page for the given provider.
    
    [The latest map for `vcs/user-repos` and `github` ➚](https://superface.ai/raw/vcs/user-repos.github@1.0.2.suma).

<br /><br /><br /><br /><br />

## Integration monitoring with Superface projects
---

Superface comes with out-of-the box monitoring of your application integrations. 

1. ### Create new project

    Create a new project in your Superface dashboard.

1. ### Get your SDK token

    Copy the project's SDK token. 

1. ### Use the SDK token with your Application

    In command line, set the token as `SUPERFACE_SDK_TOKEN` environment variable:

    ```shell
    $ export SUPERFACE_SDK_TOKEN="your token"
    ```

    Run your application again

    ```shell
    $ node index.js
    ```

1. ### Check your dashboard

    Observe how are the capabilities used by your application.

1. ### Monitor your API dependencies

    In the case of API failure Superface will email you with the notification .... 

<br /><br /><br /><br /><br />

## Next steps
---

1. ### Install other capabilities

    Lorem ipsum.

1. ### Configure additional providers

    Lorem ipsum.

1. ### Setup failover

    Lorem ipsum.

1. ### Add custom capabilties

    Lorem ipsum. [How to Create a Capability](guides/how-to-create).