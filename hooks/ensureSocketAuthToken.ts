import api from "./useApi";
import { getSocketAuthToken } from "./socketAuthToken";

/**
 * After a cold start, REST may work via cookies while the JWT for Socket.IO auth
 * was never persisted. One refresh sets Set-Cookie and the axios interceptor saves it.
 */
export async function ensureSocketAuthToken(): Promise<boolean> {
  if (await getSocketAuthToken()) return true;
  try {
    await api.post("/auth/update-session", {}, { withCredentials: true });
    return !!(await getSocketAuthToken());
  } catch {
    return false;
  }
}
