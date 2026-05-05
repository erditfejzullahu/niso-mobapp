import type { NotificationMetadatas } from '@/types/app-types';

type NavigateAction = NonNullable<NotificationMetadatas['navigateAction']>;

/**
 * Pull a stable id out of a notification's `navigateAction`. Accepts the canonical
 * id-key (e.g. `rideRequestId`) and a legacy fallback (`rideRequest`) which may have
 * historically stored either a string id or a full object with an `id` field.
 */
function resolveId(
    navigateAction: NavigateAction | undefined,
    canonicalKey: keyof NavigateAction,
    legacyKey?: keyof NavigateAction,
): string | null {
    if (!navigateAction) return null;
    const canonical = navigateAction[canonicalKey];
    if (typeof canonical === 'string' && canonical.length > 0) return canonical;
    if (canonical && typeof canonical === 'object' && typeof (canonical as { id?: string }).id === 'string') {
        return (canonical as { id: string }).id;
    }
    if (legacyKey) {
        const legacy = navigateAction[legacyKey];
        if (typeof legacy === 'string' && legacy.length > 0) return legacy;
        if (legacy && typeof legacy === 'object' && typeof (legacy as { id?: string }).id === 'string') {
            return (legacy as { id: string }).id;
        }
    }
    return null;
}

export function getRideRequestIdFromMetadata(metadata: NotificationMetadatas | null): string | null {
    return resolveId(metadata?.navigateAction, 'rideRequestId', 'rideRequest');
}

export function getConnectedRideIdFromMetadata(metadata: NotificationMetadatas | null): string | null {
    return resolveId(metadata?.navigateAction, 'connectedRideId', 'connectedRide');
}

export function getConversationIdFromMetadata(metadata: NotificationMetadatas | null): string | null {
    return resolveId(metadata?.navigateAction, 'conversationId');
}
