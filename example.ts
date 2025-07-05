import { ClientOptions } from './src/generated/client/types.gen'
import * as sdk from './src/generated/client/sdk.gen'
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
  return async (request: Request) => {
    const authHeader = buildAuthHeader(apiToken)
    request.headers.set(authHeader[0], authHeader[1])
    return request
  }
}

// allow self sign certs
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const baseUrl = 'https://127.0.0.1:28183/api/v1/'
const clientOptions: ClientOptions = { baseUrl }

console.info('Setting up JM API client…', clientOptions)
const client = createClient(clientOptions)

client.interceptors.request.use(loggingRequestInterceptor)
client.interceptors.response.use(loggingResponseInterceptor)

const jamAuthMiddleware = createJamAuthenticationMiddleware('example')
const jamAuthInterceptorId = client.interceptors.request.use(jamAuthMiddleware)
client.interceptors.request.use(jamAuthMiddleware) // example of registering the auth middleware
client.interceptors.request.eject(jamAuthInterceptorId) // example of ejecting the auth middleware again (it is NOT used!)

const getinfo = async () => sdk.version({ client })
const session = async () => sdk.session({ client })
const listwallets = async () => sdk.listwallets({ client })

;(async function() {
  console.info('Request to "/getinfo"…')
  const infoResponse = await getinfo()
  console.info('/getinfo', infoResponse.data, infoResponse.error)

  console.info('Request to "/session"…')
  const sessionResponse = await session()
  console.info('/session', sessionResponse.data, sessionResponse.error)

  console.info('Request to "/wallet/all"…')
  const listwalletsResponse = await listwallets()
  console.info('/wallet/all', listwalletsResponse.data, listwalletsResponse.error)
})()
