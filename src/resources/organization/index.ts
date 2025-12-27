import type { OAuth } from '../../auth';
import type * as fhir4 from 'fhir/r4';
import { FhirResourceBuilder } from '../fhir';

/**
 * Layanan resource organisasi
 * Menyediakan metode untuk berinteraksi dengan resource FHIR Organization
 */
export class OrganizationService {
  private oauth: OAuth;
  private baseUrl: string;
  private resourceType: string;
  private fhir: FhirResourceBuilder<'Organization'>;

  constructor(oauth: OAuth, baseUrl: string) {
    this.oauth = oauth;
    this.baseUrl = baseUrl;
    this.resourceType = 'Organization';
    this.fhir = new FhirResourceBuilder<'Organization'>(oauth, baseUrl, 'Organization');
  }

  /**
   * Dapatkan organisasi berdasarkan ID-nya
   * @param id - Pengenal unik organisasi
   * @returns Resource Organization
   */
  async byId(id: string): Promise<fhir4.Organization> {
    // const token = await this.oauth.getAccessToken();

    const response = await this.fhir.get({
      pathParams: id,
    });

    return response as fhir4.Organization;

    // const response = await fetch(`${this.baseUrl}/${this.resourceType}/${encodeURIComponent(id)}`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(`Failed to fetch ${this.resourceType}: ${response.status} ${errorText}`);
    // }

    // return (await response.json()) as fhir4.Organization;
  }

  /**
   * Cari organisasi berdasarkan nama
   * @param name - Nama yang akan dicari
   * @returns Bundle yang berisi organisasi yang cocok
   */
  async byName(name: string): Promise<fhir4.Bundle<fhir4.Organization>> {
    const token = await this.oauth.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/${this.resourceType}?name=${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search ${this.resourceType}: ${response.status} ${errorText}`);
    }

    return (await response.json()) as fhir4.Bundle<fhir4.Organization>;
  }
}

// Re-export tipe-tipe dari types.ts
export type { Organization, Telecom, Identifier, Address } from './types';
