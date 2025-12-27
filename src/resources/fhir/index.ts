/**
 * FHIR Resource Builder
 * Menyediakan akses fleksibel dan type-safe ke semua resource FHIR R4
 */
import type { OAuth } from '../../auth';
import type * as fhir4 from 'fhir/r4';
import type { FhirResourceMap, FhirResourceType, FhirGetParams, FhirPutParams } from './types';
import { FhirOperationOutcomeError } from './types';

/**
 * Builder untuk operasi FHIR resource
 * Menyediakan metode get, post, put, delete dengan type safety
 *
 * @example
 * ```typescript
 * // GET by ID
 * const patient = await builder.get({ pathParams: "123" });
 *
 * // Search
 * const bundle = await builder.get({ queryParams: { name: "John" } });
 *
 * // POST
 * const created = await builder.post({ resourceType: "Patient", ... });
 * ```
 */
export class FhirResourceBuilder<T extends FhirResourceType> {
  private oauth: OAuth;
  private baseUrl: string;
  private resourceType: T;

  constructor(oauth: OAuth, baseUrl: string, resourceType: T) {
    this.oauth = oauth;
    this.baseUrl = baseUrl;
    this.resourceType = resourceType;
  }

  /**
   * Bangun URL dengan path params dan query params
   */
  private buildUrl(
    pathParams?: string,
    queryParams?: Record<string, string | string[] | number | boolean>,
  ): string {
    let url = `${this.baseUrl}/${this.resourceType}`;

    if (pathParams) {
      url += `/${encodeURIComponent(pathParams)}`;
    }

    if (queryParams && Object.keys(queryParams).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  /**
   * Handle error response dan throw appropriate error
   * Jika response adalah OperationOutcome, throw FhirOperationOutcomeError
   * Jika bukan, throw Error biasa
   */
  private async handleErrorResponse(response: Response, method: string): Promise<never> {
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      if (json?.resourceType === 'OperationOutcome') {
        throw new FhirOperationOutcomeError(json as fhir4.OperationOutcome, response.status);
      }
    } catch (e) {
      if (e instanceof FhirOperationOutcomeError) throw e;
    }

    throw new Error(`FHIR ${method} ${this.resourceType} gagal: ${response.status} ${text}`);
  }

  /**
   * GET resource berdasarkan ID atau search dengan query params
   *
   * @param params - Parameter request (pathParams untuk ID, queryParams untuk search)
   * @returns Resource tunggal jika pathParams ada, Bundle jika search
   *
   * @example
   * ```typescript
   * // GET by ID - returns Patient
   * const patient = await client.fhir("Patient").get({ pathParams: "123" });
   *
   * // Search - returns Bundle
   * const bundle = await client.fhir("Patient").get({
   *   queryParams: { name: "John" }
   * });
   * ```
   */
  async get(params?: FhirGetParams): Promise<FhirResourceMap[T] | fhir4.Bundle> {
    const token = await this.oauth.getAccessToken();
    const url = this.buildUrl(params?.pathParams, params?.queryParams);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, 'GET');
    }

    return (await response.json()) as FhirResourceMap[T] | fhir4.Bundle;
  }

  /**
   * POST untuk membuat resource baru
   *
   * @param body - Resource FHIR yang akan dibuat
   * @returns Resource yang telah dibuat (dengan ID dari server)
   *
   * @example
   * ```typescript
   * const patient = await client.fhir("Patient").post({
   *   resourceType: "Patient",
   *   name: [{ text: "John Smith" }],
   *   gender: "male"
   * });
   * ```
   */
  async post(body: FhirResourceMap[T]): Promise<FhirResourceMap[T]> {
    const token = await this.oauth.getAccessToken();
    const url = this.buildUrl();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, 'POST');
    }

    return (await response.json()) as FhirResourceMap[T];
  }

  /**
   * PUT untuk update resource yang sudah ada
   *
   * @param params - Parameter dengan pathParams (ID resource)
   * @param body - Resource FHIR yang akan diupdate
   * @returns Resource yang telah diupdate
   *
   * @example
   * ```typescript
   * const updated = await client.fhir("Patient").put(
   *   { pathParams: "123" },
   *   { resourceType: "Patient", id: "123", name: [{ text: "Jane Smith" }] }
   * );
   * ```
   */
  async put(params: FhirPutParams, body: FhirResourceMap[T]): Promise<FhirResourceMap[T]> {
    const token = await this.oauth.getAccessToken();
    const url = this.buildUrl(params.pathParams);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, 'PUT');
    }

    return (await response.json()) as FhirResourceMap[T];
  }

  /**
   * PATCH untuk partial update resource (JSON Patch)
   *
   * @param params - Parameter dengan pathParams (ID resource)
   * @param operations - Array operasi JSON Patch
   * @returns Resource yang telah diupdate
   *
   * @example
   * ```typescript
   * const patched = await client.fhir("Patient").patch(
   *   { pathParams: "123" },
   *   [{ op: "replace", path: "/name/0/text", value: "New Name" }]
   * );
   * ```
   */
  async patch(
    params: FhirPutParams,
    operations: Array<{
      op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
      path: string;
      value?: unknown;
    }>,
  ): Promise<FhirResourceMap[T]> {
    const token = await this.oauth.getAccessToken();
    const url = this.buildUrl(params.pathParams);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(operations),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, 'PATCH');
    }

    return (await response.json()) as FhirResourceMap[T];
  }
}

// Export types and error class
export type { FhirResourceMap, FhirResourceType, FhirGetParams, FhirPutParams } from './types';
export { FhirOperationOutcomeError } from './types';
