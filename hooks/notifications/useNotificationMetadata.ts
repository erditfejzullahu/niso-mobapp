import { useMemo } from 'react';
import type { Notification, NotificationMetadatas } from '@/types/app-types';

function safeParseMetadata(raw?: string | null): NotificationMetadatas | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as NotificationMetadatas;
    } catch {
        return null;
    }
}

export function useNotificationMetadata(item: Notification) {
    return useMemo(() => safeParseMetadata(item.metadata), [item.metadata]);
}

