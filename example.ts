import {
  ClientOptions,
  Middleware,
  MiddlewareCallbackParams,
} from "openapi-fetch";
import { ErrorResponse, ResponseObjectMap } from "openapi-typescript-helpers";
import type { components } from "./src/jm-wallet-rpc/jm-wallet-rpc";
import createClient from "./src/jm-wallet-rpc/index";

type ApiToken = string;

const buildAuthHeader = (token: ApiToken): [string, string] => {
  return ["x-jm-authorization", `Bearer ${token}`];
};

const loggingMiddleware: Middleware = {
  async onRequest({ id, schemaPath, request }: MiddlewareCallbackParams) {
    console.debug("[onRequest]", id, schemaPath, request.url);
    return undefined; // undefined means: 'do nothing'
  },
  async onResponse({
    id,
    schemaPath,
    response,
  }: MiddlewareCallbackParams & { response: Response }) {
    console.debug(
      "[onResponse]",
      id,
      schemaPath,
      response.status,
      response.statusText,
      response.ok
    );
    return undefined; // undefined means: 'do nothing'
  },
};

const createJamAuthenticationMiddleware: (apiToken: ApiToken) => Middleware = (
  apiToken
) => ({
  async onRequest({ request }: MiddlewareCallbackParams) {
    const authHeader = buildAuthHeader(apiToken);
    request.headers.set(authHeader[0], authHeader[1]);
    return request;
  },
});

const clientOptions: ClientOptions = {
  baseUrl: "http://localhost:3000/api/v1/",
};
const client = createClient(clientOptions);
client.use(loggingMiddleware);

const jamAuthMiddleware = createJamAuthenticationMiddleware("example");
client.use(jamAuthMiddleware); // example of registering the auth middleware
client.eject(jamAuthMiddleware); // example of ejecting the auth middleware again (it is NOT used!)

type FetchResponse<T> = {
  data?: T;
  error?:
    | ErrorResponse<ResponseObjectMap<T>>
    | components["schemas"]["ErrorMessage"];
  response: Response;
};

type GetinfoResponse = FetchResponse<components["schemas"]["GetinfoResponse"]>;

const getinfo = async (): Promise<GetinfoResponse> => {
  const { data, error, response } = await client.GET("/getinfo");
  return { data, error, response };
};

type SessionResponse = FetchResponse<components["schemas"]["SessionResponse"]>;

const session = async (): Promise<SessionResponse> => {
  const { data, error, response } = await client.GET("/session");
  return { data, error, response };
};

type ListWalletsResponse = FetchResponse<
  components["schemas"]["ListWalletsResponse"]
>;

const listWallets = async (): Promise<ListWalletsResponse> => {
  const { data, error, response } = await client.GET("/wallet/all");
  return { data, error, response };
};

interface ApiRequestContext {
  signal?: AbortSignal;
}

const listWalletsEncapsulated = async ({ signal }: ApiRequestContext) => {
  const { data, error, response } = await client.GET("/wallet/all", { signal });

  if (error) {
    //  Api.Helper.throwError(res, t('wallets.error_loading_failed'))
    console.error("Error fetching wallets", error);
  }

  if (typeof data === "undefined") {
    // do something here
    throw new Error();
  }

  return data;
};

type WalletFileName = `${string}.jmdat`;

const toWalletFileName = (walletname: string): WalletFileName => {
  return walletname.endsWith(".jmdat")
    ? (walletname as WalletFileName)
    : `${walletname}.jmdat`;
};

type CreateWalletRequest = components["schemas"]["CreateWalletRequest"];

const postWalletCreate = async (
  { signal }: ApiRequestContext,
  req: CreateWalletRequest
) => {
  // api needs .jmdat ending(?), but generated types only enfore string
  const reqWalletname = req.walletname.endsWith(".jmdat")
    ? req.walletname
    : `${req.walletname}.jmdat`;
  const reqWithWalletname = { ...req, walletname: reqWalletname };
  const { data, error, response } = await client.POST("/wallet/create", {
    body: reqWithWalletname,
    signal,
  });

  if (error) {
    // Helper.throwResolved(response);
  }

  if (typeof data === "undefined") {
    // do something here
    throw new Error();
  }

  const walletname = toWalletFileName(data.walletname);

  return {
    ...data,
    walletname,
  };
};

// https://openapi-ts.dev/openapi-fetch/
(async function () {
  const infoResponse = await getinfo();
  console.log("/getinfo", infoResponse.data, infoResponse.error);

  const sessionResponse = await session();
  console.log("/session", sessionResponse.data, sessionResponse.error);

  const listWalletsResponse = await listWallets();
  console.log(
    "/wallet/all",
    listWalletsResponse.data,
    listWalletsResponse.error
  );

  const postWalletCreateData = await postWalletCreate(
    { signal: undefined },
    {
      walletname: "testwallet",
      password: "test",
      wallettype: "sw-fb",
    }
  );

  console.log("/wallet/create", postWalletCreateData);

  const listWalletsEncapsulatedData = await listWalletsEncapsulated({
    signal: undefined,
  });

  console.log("listWalletsEncapsulated", listWalletsEncapsulatedData);
})();
