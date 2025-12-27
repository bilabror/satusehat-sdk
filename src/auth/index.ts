import type { TokenResponse, TokenState } from './types';
import { BASE_URLS, type Environment } from '../types';

/** Waktu buffer dalam detik sebelum token kedaluwarsa untuk memicu refresh */
const TOKEN_EXPIRY_BUFFER = 60;

/**
 * Layanan OAuth untuk autentikasi SATUSEHAT
 * Menangani pengambilan token dan pembaruan otomatis
 */
export class OAuth {
  private clientId: string;
  private clientSecret: string;
  private authUrl: string;
  private tokenState: TokenState | null = null;

  constructor(clientId: string, clientSecret: string, environment: Environment) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authUrl = BASE_URLS[environment].auth;
  }

  /**
   * Dapatkan access token yang valid, mengambil atau memperbarui sesuai kebutuhan
   */
  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.tokenState!.accessToken;
    }

    await this.fetchToken();
    return this.tokenState!.accessToken;
  }

  /**
   * Periksa apakah token saat ini masih valid (dengan buffer)
   */
  private isTokenValid(): boolean {
    if (!this.tokenState) {
      return false;
    }

    const now = Date.now();
    const expiresAt = this.tokenState.expiresAt - TOKEN_EXPIRY_BUFFER * 1000;
    return now < expiresAt;
  }

  /**
   * Ambil access token baru dari SATUSEHAT
   */
  private async fetchToken(): Promise<void> {
    const url = `${this.authUrl}/accesstoken?grant_type=client_credentials`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch access token: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as TokenResponse;

    const expiresInMs = parseInt(data.expires_in, 10) * 1000;
    const issuedAt = parseInt(data.issued_at, 10);

    this.tokenState = {
      accessToken: data.access_token,
      expiresAt: issuedAt + expiresInMs,
    };
  }

  /**
   * Hapus token saat ini (berguna untuk memaksa refresh)
   */
  clearToken(): void {
    this.tokenState = null;
  }
}

export type { TokenResponse, TokenState } from './types';
