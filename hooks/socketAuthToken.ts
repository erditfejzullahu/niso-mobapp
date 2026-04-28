import type { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import { getStoredCookies } from "./cookieManagement";

const JWT_STORAGE_KEY = "jwt_access_for_socket";

export function parseAccessTokenFromSetCookie(
  setCookie: string | string[] | undefined
): string | null {
  if (!setCookie) return null;
  const lines = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const line of lines) {
    const m = /^access_token=([^;]+)/i.exec(line.trim());
    if (m?.[1]) return decodeURIComponent(m[1]);
  }
  return null;
}

function parseAccessTokenFromCookieHeader(cookieHeader: string): string | null {
  const m = /(?:^|;\s*)access_token=([^;]+)/.exec(cookieHeader);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

export async function setSocketAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(JWT_STORAGE_KEY, token);
}

export async function getSocketAuthToken(): Promise<string | null> {
  try {
    const stored = await SecureStore.getItemAsync(JWT_STORAGE_KEY);
    if (stored) return stored;
    const cookies = await getStoredCookies();
    if (!cookies) return null;
    return parseAccessTokenFromCookieHeader(cookies);
  } catch {
    return null;
  }
}

export async function clearSocketAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(JWT_STORAGE_KEY);
  } catch {
    /* key may be absent */
  }
}

/** Persist JWT from any response that rotates access_token (login, refresh, update-session). */
export async function saveAccessTokenFromResponse(
  response: AxiosResponse
): Promise<void> {
  const raw = response.headers?.["set-cookie"] as string | string[] | undefined;
  const token = parseAccessTokenFromSetCookie(raw);
  if (token) await setSocketAuthToken(token);
}
