import Constants from "expo-constants";

function getDevHostFromExpo(): string | null {
  // `hostUri` is typically like "192.168.1.22:8081" in Expo dev.
  const hostUri =
    Constants.expoConfig?.hostUri ??
    // Some environments still expose hostUri via manifest2 extras
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ??
    (Constants as any)?.manifest?.hostUri ??
    null;

  if (!hostUri || typeof hostUri !== "string") return null;

  const hostname = hostUri.split(":")[0];
  return hostname || null;
}

/** HTTP origin for REST (no trailing slash). */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (__DEV__ ? `http://${getDevHostFromExpo() ?? "192.168.1.22"}:3000` : "http://192.168.1.22:3000");

/** Socket.IO path — must match backend SocketIoAdapter (default in this project: /ws). */
export const SOCKET_IO_PATH = "/ws";

/** NestJS gateway namespace for real-time features. */
export const SOCKET_NAMESPACE = "/updates";
