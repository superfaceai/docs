# Editing providers

Comlink maps make use of the Provider Definition by defining which service to call based on the Service ID and which security scheme to use based on the Security Scheme ID. A Provider Definition keeps the provider information separate so it can be reused across maps that might implement other profiles.

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

All provider definitions contain:

- `name` (string) - Provider Name
- `services` (array of [Service](#service))
- `securitySchemes` (array of [Security Scheme](#security-scheme), optional)
- `defaultService` (string) - References the ID of an existing Service

## Service

A service is software that makes itself available over the internet. Typically this is where the API base URL for your provider is defined.

- `id` (string) - ID for service, unique within provider definition
- `baseUrl` - Base URL for the service

### Default Service

A provider can have several services associated with it. Comlink Maps allow for leaving out the service ID when specifying an HTTP call and defaulting to the `defaultService` as defined in the provider definition.

## Security Schemes

The Provider Definition includes security schemes that describe the ways a client must authenticate in order to use the provider API. These security schemes are referenced in maps as security requirements. The security schemes in a Provider Definition declare how security works for a provider, while the security requirements in the map describe which HTTP calls use those security schemes.

The Security Scheme may be one of the following:

- [API Key Header](#api-key-header)
- [API Key Query Parameter](#api-key-query-parameter)
- [API Key URL Path](#api-key-url-path)
- [API Key Body](#api-key-body)
- [Basic Auth](#basic-auth)
- [Bearer Token](#bearer-token)

### Security Scheme Types

#### API Key Header

For this security scheme, the client should add the API key into a specified HTTP header.

- `id` (string) - ID for security scheme, unique within provider definition
- `type`: "apiKey" (string)
- `in`: "header" (string)
- `name` (string) - Name of HTTP header

```js example
{
  "id": "my-api-key-header",
  "type": "apiKey",
  "in": "header",
  "name": "API-Key"
}
```

In this example, the `name` refers to the HTTP header name.

#### API Key Query Parameter

For this security scheme, the client should add the API key into a specified query parameter.

- `id` (string) - Unique ID for security scheme
- `type`: "apiKey" (string)
- `in`: "query" (string)
- `name` (string) - Name of query parameter

```js example
{
  "id": "my-api-key-query-param",
  "type": "apiKey",
  "in": "query",
  "name": "apiKey"
}
```

In this example, the `name` refers to the query parameter to use for this security scheme.

#### API Key URL Path

For this security scheme, the client should replace `{PLACEHOLDER_NAME}` in URL with the API key.

The placeholder can be defined in provider definition or in the map.

It is recommended to use `[A-Z0-9_]` for the name of the placeholder.

- `id` (string) - Unique ID for security scheme
- `type`: "apikey" (string)
- `in`: "path" (string)
- `name` (string) - Placeholder name

```js example
{
  "id": "my-api-key-url-path",
  "type": "apikey",
  "in": "path",
  "name": "PATH_SECRET",
}
```

For example if placeholder is defined in service's base url `https://example.com/{PATH_SECRET}`, then it will become `https://example.com/actual_api_key`.

Similarly you can defined placeholder in Comlink map:

```javascript
const url = `${services.default}/{PATH_SECRET}`;
const response = std.unstable.fetch(url).response();
// ...
```

#### API Key Body

For this security scheme, the client should add the API key into the request body.

- `id` (string) - Unique ID for security scheme
- `type`: "apikey" (string)
- `in`: "body" (string)
- `name`: (string) - Selector
- `bodyType`: "json" (string)

```js example
{
  "id": "my-api-key-body",
  "type": "apikey",
  "in": "body",
  "name": "/json/path",
  "bodyType": "json",
}
```

Api Keys in body support only JSON bodies right now.

In the example `"name": "/json/path"` is selector to specify locatation in object, where the api key should be placed.

```js example
  {
    "json": {
      "path": "actual_api_key"
    }
  }
```

#### Basic Auth

This security scheme refers to HTTP Basic Authentication as described in [RFC 7235](https://datatracker.ietf.org/doc/html/rfc7235).

- `id` (string) - Unique ID for security scheme
- `type`: "http" (string)
- `scheme`: "basic" (string)

```js example
{
  "id": "my-basic-auth",
  "type": "http",
  "scheme": "basic"
}
```

#### Digest Auth

This security scheme refers to HTTP Digest Authentication as described in [RFC 7616](https://datatracker.ietf.org/doc/html/rfc7616).

- `id` (string) - Unique ID for security scheme
- `type`: "http" (string)
- `scheme`: "digest" (string)
- `statusCode` (number, optional) - HTTP status code expected for the initial response with the challenge header. Default value is `401`.
- `challengeHeader` (string, optional) - Case insensitive name of the response header with server issued challenge. Default value is [`www-authenticate`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate).
- `authorizationHeader` (string, optional) - Case insensitive name of the request header containing digest authorization details. Default value is [`authorization`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization).

```js example
{
  "id": "my-digest-auth",
  "type": "http",
  "scheme": "digest",
  "statusCode": 401,
  "challengeHeader": "www-authenticate",
  "authorizationHeader": "Authorization"
}
```

#### Bearer Token

- `id` (string) - Unique ID for security scheme
- `type`: "http" (string)
- `scheme`: "bearer" (string)
- `bearerFormat` (string, optional) - A hint to the client to identify how the bearer token is formatted for documentation purposes only

```js example
{
  "id": "my-bearer-token",
  "type": "http",
  "scheme": "bearer",
  "bearerFormat": "JWT"
}
```

## Examples

- [Provider using Basic auth](https://github.com/superfaceai/station/blob/main/providers/twilio.json)
- [Provider using Bearer token](https://github.com/superfaceai/station/blob/main/providers/slack.json)
- [Provider using API key in request headers](https://github.com/superfaceai/station/blob/main/providers/dhl.json)
- [Provider using API key in request query](https://github.com/superfaceai/station/blob/main/providers/google-apis.json)

## JSON Schema

```yaml
$schema: http://json-schema.org/draft-07/schema
type: object
properties:
  name:
    type: string
    pattern: "^(unverified\\/)?[a-z][_\\-a-z]*$"
  services:
    type: array
    items:
      $ref: '#/definitions/Service'
    minItems: 1
  securitySchemes:
    type: array
    items:
      $ref: '#/definitions/SecurityScheme'
  defaultService:
    description: ServiceIdentifier must correspond to existing Service `id` from services.
    $ref: '#/definitions/ServiceIdentifier'
required:
  - name
  - services
  - defaultService
definitions:
  Service:
    type: object
    properties:
      id:
        $ref: '#/definitions/ServiceIdentifier'
      baseUrl:
        type: string
        examples:
          - https://swapi.dev/api
    required:
      - id
      - baseUrl
  ServiceIdentifier:
    $ref: '#/definitions/Identifier'
  Identifier:
    type: string
    pattern: '[_A-Za-z][A-Za-z]*'
    examples:
      - swapidev
  SecurityScheme:
    oneOf:
      - $ref: '#/definitions/ApiKeyHeaderSecurity'
      - $ref: '#/definitions/ApiKeyQueryParamSecurity'
      - $ref: '#/definitions/BasicAuthSecurity'
      - $ref: '#/definitions/BearerTokenSecurity'
  SecurityIdentifier:
    $ref: '#/definitions/Identifier'
  ApiKeyHeaderSecurity:
    type: object
    properties:
      id:
        $ref: '#/definitions/Identifier'
      type:
        type: string
        enum:
          - apiKey
      in:
        type: string
        enum:
          - header
      name:
        type: string
        description: Name of header
        examples:
          - X-API-Key
    required:
      - id
      - type
      - in
      - name
  ApiKeyQueryParamSecurity:
    type: object
    properties:
      id:
        $ref: '#/definitions/SecurityIdentifier'
      type:
        type: string
        enum:
          - apiKey
      in:
        type: string
        enum:
          - query
      name:
        type: string
        description: Name of query parameter
    required:
      - id
      - type
      - in
      - name
  BasicAuthSecurity:
    type: object
    properties:
      id:
        $ref: '#/definitions/SecurityIdentifier'
      type:
        type: string
        enum:
          - http
      scheme:
        type: string
        enum:
          - basic
    required:
      - id
      - type
      - scheme
  BearerTokenSecurity:
    type: object
    properties:
      id:
        $ref: '#/definitions/SecurityIdentifier'
      type:
        type: string
        enum:
          - http
      scheme:
        type: string
        enum:
          - bearer
      bearerFormat:
        description: |
          A hint to the client to identify how the bearer token is formatted.
          Bearer tokens are usually generated by an authorization server, so this
          information is primarily for documentation purposes.
        type: string
        examples:
          - JWT
    required:
      - id
      - type
      - scheme
```
