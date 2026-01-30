

import { API_BASE_URL } from "@/utils/constants";

type ApiErrorDetails = {
  message: string;
  status: number;
};

export class ApiError extends Error {
  status: number;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.status = details.status;
  }
}

const TOKEN_KEY = "auth_token";
const SESSION_COOKIE = "cni_session";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

async function parseJsonSafely(response: Response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers,
    // credentials: 'include', // Test sans credentials pour debug CORS
  });

  // Helper pour parser le body même si ce n'est pas du JSON
  async function parseJsonSafely(resp: Response) {
    try {
      return await resp.json();
    } catch {
      try {
        return await resp.text();
      } catch {
        return null;
      }
    }
  }

  if (!response.ok) {
    const errorBody = await parseJsonSafely(response);
    // Log le body d'erreur pour debug backend
    // eslint-disable-next-line no-console
    console.error(`[API ERROR] ${path} status=${response.status}`, errorBody);
    throw new ApiError({
      message: response.statusText || "Unexpected error",
      status: response.status,
    });
  }

  return (await parseJsonSafely(response)) as T;
}
