import { useSocketStore } from "@/store/useSocketStore";
import type { ServerSocketEventName } from "@/types/socket-events";
import { useEffect, useRef } from "react";

/**
 * Subscribe to a server event while the shared socket is connected.
 * Handler always sees the latest closure via ref (no stale callbacks).
 * Use ...args — backend may emit multiple payloads (e.g. newRideRequest).
 */
export function useSocketEvent(
  event: ServerSocketEventName,
  handler: (...args: unknown[]) => void
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const status = useSocketStore((s) => s.status);

  useEffect(() => {
    if (status !== "connected") return;

    const socket = useSocketStore.getState().getSocket();
    if (!socket) return;

    const listener = (...args: unknown[]) => handlerRef.current(...args);
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [event, status]);
}
