import { useSocketEvent } from '@/hooks/useSocketEvent';
import { SERVER_SOCKET_EVENTS } from '@/types/socket-events';
import Toast from '@/utils/appToast';
import { parseSocketMessagePayload } from '@/utils/conversations/parseSocketMessagePayload';
import type { ConversationCachesApi } from './useConversationCaches';

type Args = {
    conversationId: string;
    currentUserId: string;
    modalOpen: boolean;
    caches: ConversationCachesApi;
};

/**
 * Applies server `newMessage` / `errorSendingMessage` / price-offer events to TanStack
 * caches for this conversation.
 */
export function useConversationSocketSync({ conversationId, currentUserId, modalOpen, caches }: Args) {
    const {
        pendingOptimisticIdsRef,
        commitServerMessageToCaches,
        appendTheirMessageToCaches,
        removeFailedOptimistic,
    } = caches;

    useSocketEvent(
        SERVER_SOCKET_EVENTS.newMessage,
        (payload) => {
            const msg = parseSocketMessagePayload(payload);
            if (msg.conversationId !== conversationId) return;
            if (msg.senderId === currentUserId) {
                const pendingId = pendingOptimisticIdsRef.current.shift();
                if (pendingId) {
                    commitServerMessageToCaches(msg, pendingId);
                } else {
                    commitServerMessageToCaches(msg, msg.id);
                }
            } else {
                appendTheirMessageToCaches(msg);
            }
        },
        modalOpen
    );

    useSocketEvent(
        SERVER_SOCKET_EVENTS.errorSendingMessage,
        () => {
            Toast.show({
                type: 'error',
                text1: 'Mesazhi nuk u dërgua',
                text2: 'Biseda mund të jetë e mbyllur ose e palejuar për këtë veprim.',
            });
            const failedId = pendingOptimisticIdsRef.current.pop();
            if (failedId) removeFailedOptimistic(failedId);
        },
        modalOpen
    );

    // Price-offer messages arrive via dedicated events (not newMessage) because
    // the backend creates them through the REST layer and emits them separately.
    useSocketEvent(
        SERVER_SOCKET_EVENTS.driverSendedPriceOffer,
        (payload) => {
            const msg = parseSocketMessagePayload(payload);
            if (msg.conversationId !== conversationId) return;
            // Always treat as their message — the sender refreshes via refetch.
            appendTheirMessageToCaches(msg);
        },
        modalOpen
    );

    useSocketEvent(
        SERVER_SOCKET_EVENTS.passengerSendedPriceOffer,
        (payload) => {
            const msg = parseSocketMessagePayload(payload);
            if (msg.conversationId !== conversationId) return;
            appendTheirMessageToCaches(msg);
        },
        modalOpen
    );
}
