# joinmarket-ng-api-ts

OpenAPI TypeScript types and client for JoinMarket-NG (`jmwalletd`).

This package generates TypeScript models, a fetch client, and React Query hooks based on the JoinMarket-NG OpenAPI specification.

## Getting Started

### 1. Install dependencies

```shell
npm install
```

### 2. Fetch the OpenAPI Schema (Optional)

By default, the package includes pre-generated client files. If you want to update the schema from a running `jmwalletd` daemon:

```shell
# Fetch schema using the default local endpoint (https://127.0.0.1:28183/openapi.json)
npm run openapi-ts:fetch-schema

# Or specify a custom URL using JM_NG_OPENAPI_URL
JM_NG_OPENAPI_URL=https://127.0.0.1:28183/openapi.json npm run openapi-ts:fetch-schema
```

This will write the schema to:
- [contrib/jm-ng-openapi.json](contrib/jm-ng-openapi.json)
- [contrib/jm-ng-openapi.yaml](contrib/jm-ng-openapi.yaml)

### 3. Generate the TypeScript Client

Generate the fetch client and React Query hooks from the fetched OpenAPI schema:

```shell
npm run openapi-ts
```

This creates the generated files under `src/generated/client/`.

### 4. Build the Project

Compile the code with `tsup`:

```shell
npm run build
```

### 5. Run the Example

If you have a local `jmwalletd` running, you can run the example script:

```shell
npm run example
```

## API

The client and types are generated from the JoinMarket-NG OpenAPI schema files:
- [jm-ng-openapi.json](contrib/jm-ng-openapi.json)
- [jm-ng-openapi.yaml](contrib/jm-ng-openapi.yaml)

## License

The project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Resources

- **JoinMarket-NG**: [joinmarket-ng/joinmarket-ng](https://github.com/joinmarket-ng/joinmarket-ng)
- **Jam WebUI**: [joinmarket-webui/jam](https://github.com/joinmarket-webui/jam)
- **Hey API (openapi-ts)**: [heyapi.dev/openapi-ts](https://heyapi.dev/openapi-ts/get-started)
- **@hey-api/client-fetch**: [heyapi.dev/openapi-ts/clients/fetch](https://heyapi.dev/openapi-ts/clients/fetch)
- **@tanstack/react-query**: [TanStack/query](https://github.com/TanStack/query)

