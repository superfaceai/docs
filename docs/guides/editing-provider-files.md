# Editing providers

Superface's CLI makes every effort to populate the `.provider.json` files with accurate information on security policies, API endpoints and additional parameter information, but there will be occasions where you want to edit those files.

Below is a breakdown of each section with an overview of each available option that can be edited.

## Provider.json Overview

A fully formed `.provider.json` file contains the elements needed for the CLI to make requests to an API and to further populate Profiles and Maps with the correct information about how to communicate with that API.

They look like this:

```json title=".provider.json"
{
  "name": "sendgrid",
  "services": [
    {
      "id": "default",
      "baseUrl": "https://api.sendgrid.com"
    }
  ],
  "defaultService": "default",
  "securitySchemes": [
    {
      "id": "bearer_token",
      "type": "http",
      "scheme": "bearer"
    }
  ],
  "parameters": [
    {
      "name": "email",
      "description": "Email of sender - must be set to a valid email address that is registered with SendGrid"
    },
    {
      "name": "name",
      "description": "Name of sender - must be set to a valid name that is registered with SendGrid"
    }
  ]
}
```
