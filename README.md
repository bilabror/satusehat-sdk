# SATUSEHAT SDK

TypeScript SDK for the SATUSEHAT API (Indonesian Health Data Integration).

> ⚠️ **Peringatan:** SDK ini masih dalam versi alpha dan belum direkomendasikan untuk digunakan di production. API dan fitur dapat berubah sewaktu-waktu tanpa pemberitahuan.

## Features

- OAuth 2.0 authentication with automatic token refresh
- Type-safe FHIR resource operations
- Support for development and production environments
- Zero external dependencies (uses native `fetch`)

## Installation

```bash
npm install satusehat-sdk
```

SDK ini sudah termasuk tipe-tipe FHIR R4 resmi dari `@types/fhir`, jadi tidak perlu menginstall dependency tambahan untuk type safety.

## Quick Start

```typescript
import { SatusehatClient } from 'satusehat-sdk';

const client = new SatusehatClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  environment: 'development', // or 'production'
});

// Get organization by ID
const organization = await client.organization.byId('7df3273e-8c9c-42de-b500-1bca74721111');
console.log(organization.name);

// Search organizations by name
const results = await client.organization.byName('RS Sehat');
console.log(`Found ${results.total} organizations`);

for (const entry of results.entry ?? []) {
  console.log(entry.resource.name);
}
```

## API Reference

### `SatusehatClient`

Main client for interacting with the SATUSEHAT API.

#### Constructor

```typescript
new SatusehatClient(config: SatusehatConfig)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `config.clientId` | `string` | OAuth client ID from SATUSEHAT |
| `config.clientSecret` | `string` | OAuth client secret from SATUSEHAT |
| `config.environment` | `'development' \| 'production'` | API environment |

#### Methods

| Method | Description |
|--------|-------------|
| `getAccessToken()` | Returns the current access token (auto-refreshes if expired) |
| `clearToken()` | Clears the cached token, forcing refresh on next request |

### `client.organization`

Organization resource operations.

| Method | Description |
|--------|-------------|
| `byId(id: string)` | Get an organization by its unique ID |
| `byName(name: string)` | Search organizations by name (returns Bundle) |

## Environments

| Environment | Auth URL | FHIR URL |
|-------------|----------|----------|
| `development` | `https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1` | `https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1` |
| `production` | `https://api-satusehat.kemkes.go.id/oauth2/v1` | `https://api-satusehat.kemkes.go.id/fhir-r4/v1` |

## Token Management

The SDK automatically handles OAuth token management:

- Tokens are fetched on the first API request
- Tokens are automatically refreshed 60 seconds before expiry
- Use `clearToken()` to force a token refresh

## Error Handling

SDK ini menyediakan error handling yang type-safe untuk response error dari SATUSEHAT API.

### `FhirOperationOutcomeError`

Ketika API mengembalikan error dengan format FHIR `OperationOutcome`, SDK akan melempar `FhirOperationOutcomeError` yang memungkinkan akses type-safe ke detail error.

```typescript
import { SatusehatClient, FhirOperationOutcomeError } from 'satusehat-sdk';

const client = new SatusehatClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  environment: 'development',
});

try {
  const patient = await client.fhir("Patient").get({ pathParams: "123" });
} catch (e) {
  if (e instanceof FhirOperationOutcomeError) {
    // Akses type-safe ke OperationOutcome
    console.log(e.operationOutcome.issue); // Detail issue dari server
    console.log(e.status); // HTTP status code (404, 400, dll)
    console.log(e.message); // Pesan error dari issue pertama
  } else {
    // Error lainnya (network error, parsing error, dll)
    console.log(e.message);
  }
}
```

| Property | Type | Deskripsi |
|----------|------|-----------|
| `operationOutcome` | `fhir4.OperationOutcome` | Object OperationOutcome lengkap dari server |
| `status` | `number` | HTTP status code dari response |
| `message` | `string` | Pesan error dari `issue[0].diagnostics` atau `issue[0].details.text` |

## License

MIT
