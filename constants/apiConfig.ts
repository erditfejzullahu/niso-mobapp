/** HTTP origin for REST (no trailing slash). Must match Nest listen URL. */
export const API_BASE_URL = "http://192.168.1.22:3000";

/** Socket.IO path — must match backend SocketIoAdapter (default in this project: /ws). */
export const SOCKET_IO_PATH = "/ws";

/** NestJS gateway namespace for real-time features. */
export const SOCKET_NAMESPACE = "/updates";
