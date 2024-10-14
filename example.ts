import createClient from './index'

const client = createClient({ baseUrl: 'http://localhost:3000' })

// https://openapi-ts.dev/openapi-fetch/
;(async function() {
    const {
        data, // only present if 2XX response
        error, // only present if 4XX or 5XX response
        response
      } = await client.GET('/getinfo')

      console.log('/getinfo', data, error, response)
})()
