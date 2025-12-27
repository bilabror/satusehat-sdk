import { OAuth } from './auth';
import { OrganizationService } from './resources/organization';
import { FhirResourceBuilder, type FhirResourceType } from './resources/fhir';
import { BASE_URLS, type SatusehatConfig } from './types';

/**
 * Client utama untuk berinteraksi dengan API SATUSEHAT FHIR
 *
 * @example
 * ```typescript
 * const client = new SatusehatClient({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   environment: 'development',
 * });
 *
 * // Ambil organisasi berdasarkan ID
 * const org = await client.organization.byId('uuid-here');
 *
 * // Cari berdasarkan nama
 * const results = await client.organization.byName('RS Sehat');
 *
 * // Akses resource FHIR secara fleksibel
 * const patient = await client.fhir("Patient").get({ pathParams: "123" });
 * const bundle = await client.fhir("Patient").get({ queryParams: { name: "John" } });
 * ```
 */
export class SatusehatClient {
  private oauth: OAuth;
  private fhirBaseUrl: string;

  /** Operasi resource organisasi */
  public readonly organization: OrganizationService;

  constructor(config: SatusehatConfig) {
    const { clientId, clientSecret, environment } = config;
    const urls = BASE_URLS[environment];

    this.oauth = new OAuth(clientId, clientSecret, environment);
    this.fhirBaseUrl = urls.fhir;
    this.organization = new OrganizationService(this.oauth, urls.fhir);
  }

  /**
   * Akses resource FHIR secara fleksibel dengan type safety
   *
   * @param resourceType - Nama resource FHIR (e.g., "Patient", "Encounter", "Observation")
   * @returns FhirResourceBuilder dengan metode get, post, put, delete
   *
   * @example
   * ```typescript
   * // GET by ID
   * const patient = await client.fhir("Patient").get({ pathParams: "123" });
   *
   * // Search dengan query params
   * const bundle = await client.fhir("Patient").get({
   *   queryParams: { name: "John", gender: "male" }
   * });
   *
   * // POST - buat resource baru
   * const created = await client.fhir("Patient").post({
   *   resourceType: "Patient",
   *   name: [{ text: "John Smith" }],
   *   gender: "male"
   * });
   *
   * // PUT - update resource
   * const updated = await client.fhir("Patient").put(
   *   { pathParams: "123" },
   *   { resourceType: "Patient", id: "123", name: [{ text: "Jane" }] }
   * );
   *
   * // DELETE
   * await client.fhir("Patient").delete({ pathParams: "123" });
   * ```
   */
  fhir<T extends FhirResourceType>(resourceType: T): FhirResourceBuilder<T> {
    return new FhirResourceBuilder<T>(this.oauth, this.fhirBaseUrl, resourceType);
  }

  /**
   * Dapatkan access token saat ini (mengambil/memperbarui jika diperlukan)
   * Berguna untuk membuat panggilan API kustom
   */
  async getAccessToken(): Promise<string> {
    return this.oauth.getAccessToken();
  }

  /**
   * Hapus access token yang di-cache
   * Memaksa token baru untuk diambil pada permintaan berikutnya
   */
  clearToken(): void {
    this.oauth.clearToken();
  }
}
