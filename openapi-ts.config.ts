import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './contrib/jm-wallet-rpc.yaml',
  output: 'src/generated/client',
  plugins: [
    '@hey-api/client-fetch',
    '@tanstack/react-query',
  ],
})
