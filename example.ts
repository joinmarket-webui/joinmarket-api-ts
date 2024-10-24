import { ErrorResponse, ResponseObjectMap } from 'openapi-typescript-helpers'
import type { components } from './jm-wallet-rpc'
import createClient from './index'

const client = createClient({ baseUrl: 'http://localhost:3000/api/v1/' })

type FetchResponse<T> =
  | {
      data: T
      error?: never
      response: Response
    }
  | {
      data?: never
      error: ErrorResponse<ResponseObjectMap<T>, 'application/json'>
      response: Response
    }

type GetinfoResponse = FetchResponse<components["schemas"]["GetinfoResponse"]>

const getinfo = async () : Promise<GetinfoResponse> => {
  const fetchResponse = await client.GET('/getinfo')
  return fetchResponse
}

// https://openapi-ts.dev/openapi-fetch/
;(async function() {
    const {
        data, // only present if 2XX response
        error, // only present if 4XX or 5XX response
      } = await getinfo()

      console.log('/getinfo', data, error)
})()
