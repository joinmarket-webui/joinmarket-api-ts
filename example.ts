import { ClientOptions, Middleware, MiddlewareCallbackParams } from 'openapi-fetch'
import { ErrorResponse, ResponseObjectMap } from 'openapi-typescript-helpers'
import type { components } from './src/jm-wallet-rpc/jm-wallet-rpc'
import createClient from './src/jm-wallet-rpc/index'

type ApiToken = string

const buildAuthHeader = (token: ApiToken): [string, string] => {
  return ['x-jm-authorization', `Bearer ${token}`]
}

const loggingMiddleware: Middleware = {
  async onRequest({ id, schemaPath, request } : MiddlewareCallbackParams) {
    console.debug('[onRequest]', id, schemaPath, request.url)
    return undefined // undefined means: 'do nothing'
  },
  async onResponse({ id, schemaPath, response }: MiddlewareCallbackParams & { response: Response }) {
    console.debug('[onResponse]', id, schemaPath, response.status, response.statusText, response.ok)
    return undefined // undefined means: 'do nothing'
  },
}

const createJamAuthenticationMiddleware : (apiToken: ApiToken) => Middleware = (apiToken) => ({
  async onRequest({ request } : MiddlewareCallbackParams) {
    const authHeader = buildAuthHeader(apiToken)
    request.headers.set(authHeader[0], authHeader[1])
    return request
  }
})

const clientOptions: ClientOptions = {
  baseUrl: 'http://localhost:3000/api/v1/',
}
const client = createClient(clientOptions)
client.use(loggingMiddleware)

const jamAuthMiddleware = createJamAuthenticationMiddleware('example')
client.use(jamAuthMiddleware) // example of registering the auth middleware
client.eject(jamAuthMiddleware) // example of ejecting the auth middleware again (it is NOT used!)

type FetchResponse<T> = {
  data?: T
  error?: ErrorResponse<ResponseObjectMap<T>> | components['schemas']['ErrorMessage']
  response: Response
}

type GetinfoResponse = FetchResponse<components['schemas']['GetinfoResponse']>

const getinfo = async () : Promise<GetinfoResponse> => {
  const { data, error, response } = await client.GET('/getinfo')
  return { data, error, response }
}

type SessionResponse = FetchResponse<components['schemas']['SessionResponse']>

const session = async () : Promise<SessionResponse> => {
  const { data, error, response } = await client.GET('/session')
  return { data, error, response }
}

type ListWalletsResponse = FetchResponse<components['schemas']['ListWalletsResponse']>

const listWallets = async () : Promise<ListWalletsResponse> => {
  const { data, error, response } = await client.GET('/wallet/all')
  return { data, error, response }
}

// https://openapi-ts.dev/openapi-fetch/
;(async function() {
  const infoResponse = await getinfo()
  console.log('/getinfo', infoResponse.data, infoResponse.error)

  const sessionResponse = await session()
  console.log('/session', sessionResponse.data, sessionResponse.error)

  const listWalletsResponse = await listWallets()
  console.log('/wallet/all', listWalletsResponse.data, listWalletsResponse.error)
})()
