import {
  API_BASE_URL,
  SOCKET_IO_PATH,
  SOCKET_NAMESPACE,
} from "@/constants/apiConfig";
import { getSocketAuthToken } from "@/hooks/socketAuthToken";
import type { ClientSocketEventName } from "@/types/socket-events";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";

export type SocketConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

let socketRef: Socket | null = null;

type SocketStore = {
  status: SocketConnectionStatus;
  socketId: string | null;
  lastError: string | null;
  /** Underlying client; prefer this only after status === 'connected'. */
  getSocket: () => Socket | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  emit: (event: ClientSocketEventName, payload?: unknown) => boolean;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  status: "disconnected",
  socketId: null,
  lastError: null,

  getSocket: () => socketRef,

  connect: async () => {
    const token = await getSocketAuthToken();
    if (!token) {
      set({ status: "disconnected", lastError: null, socketId: null });
      return;
    }

    if (socketRef?.connected) {
      set({ status: "connected", socketId: socketRef.id ?? null, lastError: null });
      return;
    }

    if (socketRef) {
      socketRef.removeAllListeners();
      socketRef.disconnect();
      socketRef = null;
    }

    set({ status: "connecting", lastError: null });

    const socket = io(`${API_BASE_URL}${SOCKET_NAMESPACE}`, {
      path: SOCKET_IO_PATH,
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
    });

    socketRef = socket;

    socket.on("connect", () => {
      set({
        status: "connected",
        socketId: socket.id ?? null,
        lastError: null,
      });
    });

    socket.io.on("reconnect_attempt", () => {
      set({ status: "reconnecting" });
    });

    socket.on("disconnect", () => {
      set({ status: "disconnected", socketId: null });
    });

    socket.on("connect_error", (err: Error) => {
      set({ lastError: err.message });
    });
  },

  disconnect: () => {
    if (socketRef) {
      socketRef.removeAllListeners();
      socketRef.disconnect();
      socketRef = null;
    }
    set({ status: "disconnected", socketId: null, lastError: null });
  },

  reconnect: async () => {
    get().disconnect();
    await get().connect();
  },

  emit: (event, payload) => {
    const s = socketRef;
    if (!s?.connected) return false;
    s.emit(event, payload);
    return true;
  },
}));
