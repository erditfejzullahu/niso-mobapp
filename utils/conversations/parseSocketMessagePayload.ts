import type { Message } from '@/types/app-types';

/**
 * Normalizes Prisma/socket JSON (ISO date strings) into the app `Message` shape.
 */
export function parseSocketMessagePayload(raw: unknown): Message {
    const m = raw as Message & {
        createdAt?: string | Date;
        updatedAt?: string | Date;
    };
    return {
        ...m,
        createdAt:
            m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt as string),
        updatedAt:
            m.updatedAt instanceof Date
                ? m.updatedAt
                : new Date((m.updatedAt ?? m.createdAt) as string),
    } as Message;
}
