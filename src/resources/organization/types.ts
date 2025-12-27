/**
 * Re-export tipe-tipe FHIR R4 untuk kemudahan penggunaan
 * Menggunakan tipe resmi dari @types/fhir
 */
import type * as fhir4 from 'fhir/r4';

// Re-export tipe-tipe yang umum digunakan
export type Organization = fhir4.Organization;
export type Telecom = fhir4.ContactPoint;
export type Identifier = fhir4.Identifier;
export type Address = fhir4.Address;
