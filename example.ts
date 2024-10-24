import { Middleware } from 'openapi-fetch'
import { ErrorResponse, ResponseObjectMap } from 'openapi-typescript-helpers'
import type { components } from './src/jm-wallet-rpc/jm-wallet-rpc'
import createClient from './src/jm-wallet-rpc/index'

const middleware: Middleware = {
  async onRequest({ request, options }) {
    // request.headers.set('Authorization', `Bearer ${accessToken}`);
    return undefined // undefined means: 'do nothing'
  },
  async onResponse({ request, response, options }) {
    return undefined // undefined means: 'do nothing'
  },
}

const client = createClient({ baseUrl: 'http://localhost:3000/api/v1/' })
client.use(middleware)

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
