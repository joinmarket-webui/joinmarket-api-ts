import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './contrib/jm-ng-openapi.json',
  output: 'src/generated/client',
  plugins: [
    '@hey-api/client-fetch',
    '@tanstack/react-query',
  ],
})
