# Integrate OneSDK

After the using the Superface CLI to create Comlinks for the use case you want to achieve it's time to start integrating them into your application.

Below are two examples of functional code for a single use case, in both Node.js and Python.

## Example overview

The examples below are built to achieve the same use case goal; sending an email with the Email API provider [Resend](/docs/api-examples/resend). The architecture is as follows:

- Single script/module
- Exposes an `/execute` endpoint that accepts the required inputs
- Uses Superface OneSDK to execute the use case
- Uses Comlink files created by Superface CLI

## Node.js & Python examples

There are two implementation examples available, for Node.js and Python, that demonstrate how OneSDK fits into an application using common web application frameworks.

<div className="row padding-bottom--lg">
  <div className="col col--6">
    <div className="card shadow">
      <a href="https://github.com/superfaceai/nodejs-production-example" className="menu__link">
        <div className="card__body">
          <h3>Node.js</h3>
          <p>
            OneSDK and Comlink implementation example for Node.js using Express.
          </p>
        </div>
      </a>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow">
      <a href="https://github.com/superfaceai/python-production-example" className="menu__link">
        <div className="card__body">
          <h3>Python</h3>
          <p>
            OneSDK and Comlink implementation example for Python using Flask.
          </p>
        </div>
      </a>
    </div>
  </div>
</div>

Each implementation can be cloned and deployed. Instructions for this are in the readme for each repository.

## Moving from CLI to SDK

If you have created the Comlinks for your use case using the [Superface CLI](/docs/introduction/quick-start), there are three files you must ensure you move over to your production application in order for OneSDK to work.

- Provider - `<api-provider-name.provider.json`
- Profile - `<use-case-profile-name>.profile`
- Map - `<use-case-profile-name>.<api-provider-name>.map.js`

The CLI will have created these files in a directory named `superface`, where you ran the CLI commands.
