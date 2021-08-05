# Find provider by name

The easiest way to check whether a provider exists is to search the registry API for its name.

If the registry responds with status code 404, the provider doesn't exist and the name is available. Otherwise, it already exists and might be used in your new capability mappings.

#### Using [cURL](https://curl.se)

```shell
curl -H "Accept: application/json" https://superface.ai/providers/<provider-name>
```

#### Using any other HTTP requesting tool

Send `GET` request to `https://superface.ai/providers/<provider-name>` with `Accept` header set to `application/json`.