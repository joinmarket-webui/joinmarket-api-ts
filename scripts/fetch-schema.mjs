#!/usr/bin/env node
// Fetches the JoinMarket-NG OpenAPI spec from a running ``jmwalletd`` and
// writes both JSON and YAML copies into ``contrib/``.
//
// The default endpoint targets a local jmwalletd. Override with the
// ``JM_NG_OPENAPI_URL`` environment variable, e.g.:
//
//   JM_NG_OPENAPI_URL=https://127.0.0.1:28183/openapi.json \
//     npm run openapi-ts:fetch-schema
//
// Self-signed development certificates are accepted only when the URL is on
// localhost.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import yaml from 'js-yaml'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '..', 'contrib')

const url = process.env.JM_NG_OPENAPI_URL ?? 'https://127.0.0.1:28183/openapi.json'

const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(url)
if (isLocal && url.startsWith('https://')) {
  // Allow self-signed dev certs.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

console.log(`fetching ${url}`)
const res = await fetch(url)
if (!res.ok) {
  console.error(`failed: ${res.status} ${res.statusText}`)
  process.exit(1)
}
const text = await res.text()
let parsed
try {
  parsed = JSON.parse(text)
} catch (err) {
  console.error('response was not JSON:', err)
  process.exit(1)
}

const jsonPath = resolve(outDir, 'jm-ng-openapi.json')
const yamlPath = resolve(outDir, 'jm-ng-openapi.yaml')
writeFileSync(jsonPath, JSON.stringify(parsed, null, 2) + '\n')
writeFileSync(yamlPath, yaml.dump(parsed, { noRefs: true, lineWidth: 120 }))
console.log(`wrote ${jsonPath}`)
console.log(`wrote ${yamlPath}`)