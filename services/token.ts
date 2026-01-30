// Token helpers for auth (localStorage)



const TOKEN_KEY = "auth_token";
const SESSION_COOKIE = "cni_session";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    // Synchronise aussi le cookie pour le middleware
    document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    // Supprime aussi le cookie pour le middleware
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  }
}
