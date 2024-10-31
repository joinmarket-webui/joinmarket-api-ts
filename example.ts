import {
  ClientOptions,
  Middleware,
  MiddlewareCallbackParams,
} from "openapi-fetch";
import { ErrorResponse, ResponseObjectMap } from "openapi-typescript-helpers";
import type { components } from "./src/jm-wallet-rpc/jm-wallet-rpc";
import createClient from "./src/jm-wallet-rpc/index";
import { t, TFunction } from "i18next";

type ApiToken = string;
interface ApiRequestContext {
  signal?: AbortSignal;
}
type WithWalletFileName = {
  walletFileName: WalletFileName;
};
type WalletRequestContext = ApiRequestContext & WithWalletFileName;

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

interface ApiError {
  message: string;
}

const errorResolver = (t: TFunction, i18nKey: string | string[]) => ({
  resolver: (_: Response, reason: string) => `${t(i18nKey)} ${reason}`,
  fallbackReason: t("global.errors.reason_unknown"),
});

const extractErrorMessage = async (
  response: Response,
  fallbackReason = response.statusText
): Promise<string> => {
  try {
    // The server will answer with a html response instead of json on certain errors.
    // The situation is mitigated by parsing the returned html.
    const isHtmlErrorMessage =
      response.headers && response.headers.get("content-type") === "text/html";

    if (isHtmlErrorMessage) {
      return await response
        .text()
        .then((html) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");
          return doc.title || fallbackReason;
        })
        .then((reason) => `The server reported a problem: ${reason}`);
    }

    const { message }: ApiError = await response.json();
    return message || fallbackReason;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Will use fallback reason - Error while extracting error message from api response:",
        err
      );
    }

    return fallbackReason;
  }
};

const DEFAULT_RESOLVER = (res: Response, reason: string) => reason;

class JmApiError extends Error {
  public response: Response;

  constructor(response: Response, message: string) {
    super(message);
    this.response = response;
  }
}

const throwResolved = async (
  response: Response,
  { resolver = DEFAULT_RESOLVER, fallbackReason = response.statusText } = {}
): Promise<never> => {
  const reason = await extractErrorMessage(response, fallbackReason);
  const errorMessage = resolver(response, reason) || reason;
  throw new JmApiError(response, errorMessage);
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

const listWalletsEncapsulated = async ({ signal }: ApiRequestContext) => {
  const { data, error, response } = await client.GET("/wallet/all", { signal });

  if (error) {
    throwResolved(response, errorResolver(t, "wallets.error_loading_failed"));
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
    throwResolved(response);
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

type DirectSendRequest = components["schemas"]["DirectSendRequest"];

const postDirectSend = async (
  { signal, walletFileName }: WalletRequestContext,
  req: DirectSendRequest,
  errorMessage: string
) => {
  const { data, error, response } = await client.POST(
    "/wallet/{walletname}/taker/direct-send",
    {
      params: { path: { walletname: walletFileName } },
      body: req,
      signal,
    }
  );

  if (error) {
    throwResolved(response, errorResolver(t, errorMessage));
  }

  if (typeof data === "undefined") {
    // do something here
    throw new Error();
  }

  return data;
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
      walletname: "testwallet3",
      password: "test",
      wallettype: "sw-fb",
    }
  );

  console.log("/wallet/create", postWalletCreateData);

  const listWalletsEncapsulatedData = await listWalletsEncapsulated({
    signal: undefined,
  });

  console.log("listWalletsEncapsulated", listWalletsEncapsulatedData);

  // const postDirectSendData = await postDirectSend(
  //   { signal: undefined, walletFileName: "testwallet.jmdat" },
  //   {
  //     amount_sats: 100000,
  //     destination: "bcrt1qujp2x2fv437493sm25gfjycns7d39exjnpptzw",
  //     mixdepth: 0,
  //   },
  //   "earn.fidelity_bond.error_creating_fidelity_bond" // pass in a different error message depending on the where this is called
  // );
})();
