/**
 * Environment SATUSEHAT yang didukung
 */
export type Environment = 'development' | 'production';

/**
 * Opsi konfigurasi untuk client SATUSEHAT
 */
export interface SatusehatConfig {
  /** OAuth client ID dari SATUSEHAT */
  clientId: string;
  /** OAuth client secret dari SATUSEHAT */
  clientSecret: string;
  /** Environment yang digunakan (development atau production) */
  environment: Environment;
}

/**
 * Konfigurasi base URL untuk setiap environment
 */
export const BASE_URLS: Record<Environment, { auth: string; fhir: string }> = {
  development: {
    auth: 'https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1',
    fhir: 'https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1',
  },
  production: {
    auth: 'https://api-satusehat.kemkes.go.id/oauth2/v1',
    fhir: 'https://api-satusehat.kemkes.go.id/fhir-r4/v1',
  },
};

/**
 * Re-export tipe-tipe Bundle FHIR R4 dari @types/fhir
 */
import type * as fhir4 from 'fhir/r4';
import { FhirOperationOutcomeError } from './resources/fhir';

// Re-export tipe-tipe Bundle untuk kemudahan penggunaan
export type Meta = fhir4.Meta;
export type BundleLink = fhir4.BundleLink;
export type BundleEntry<T> = fhir4.BundleEntry<T>;
export type Bundle<T> = fhir4.Bundle<T>;

export { FhirOperationOutcomeError };
