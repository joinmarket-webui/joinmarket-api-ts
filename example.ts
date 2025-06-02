import { ClientOptions } from './src/generated/client/types.gen'
import * as sdk from './src/generated/client/sdk.gen';
import { createClient } from './src/index'


type ApiToken = string

const buildAuthHeader = (token: ApiToken): [string, string] => {
  return ['x-jm-authorization', `Bearer ${token}`]
}

async function loggingRequestInterceptor(request: Request) {
  console.debug('[onRequest]', request)
  return request
}
async function loggingResponseInterceptor(response: Response) {
  console.debug('[onResponse]', response)
  return response
}

const createJamAuthenticationMiddleware = (apiToken: ApiToken) => {
  return async (request) => {
    const authHeader = buildAuthHeader(apiToken)
    request.headers.set(authHeader[0], authHeader[1])
    return request
  }
}

const clientOptions: ClientOptions = {
  baseUrl: 'http://localhost:3000/api/v1/',
}
const client = createClient(clientOptions)

client.interceptors.request.use(loggingRequestInterceptor);
client.interceptors.response.use(loggingResponseInterceptor);

const jamAuthMiddleware = createJamAuthenticationMiddleware('example')
const jamAuthInterceptorId = client.interceptors.request.use(jamAuthMiddleware);
client.interceptors.request.use(jamAuthMiddleware) // example of registering the auth middleware
client.interceptors.request.eject(jamAuthInterceptorId) // example of ejecting the auth middleware again (it is NOT used!)

const getinfo = async () => sdk.version({ client })
const session = async () => sdk.session({ client })
const listWallets = async () => sdk.listwallets({ client })

// https://openapi-ts.dev/openapi-fetch/
;(async function() {
  const infoResponse = await getinfo()
  console.log('/getinfo', infoResponse.data, infoResponse.error)

  const sessionResponse = await session()
  console.log('/session', sessionResponse.data, sessionResponse.error)

  const listWalletsResponse = await listWallets()
  console.log('/wallet/all', listWalletsResponse.data, listWalletsResponse.error)
})()
