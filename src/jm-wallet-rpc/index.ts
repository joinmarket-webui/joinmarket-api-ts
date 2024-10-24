import createClient from 'openapi-fetch'
import type { paths } from './jm-wallet-rpc'

export default createClient<paths>
