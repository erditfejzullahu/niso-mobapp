import { useCallback } from 'react';
import { useSocketStore } from '@/store/useSocketStore';
import { CLIENT_SOCKET_EVENTS } from '@/types/socket-events';
import { ConversationType, type Conversations, type Message, type Role, type User } from '@/types/app-types';
import Toast from '@/utils/appToast';
import type { ConversationCachesApi } from './useConversationCaches';

/** Other-topic messages (OTHER / non–ride-thread) via websocket + optimistic caches. */
export function useSendOtherConversationMessage(
    conversation: Conversations,
    user: User,
    caches: ConversationCachesApi
) {
    const { pendingOptimisticIdsRef, applyOptimisticToCaches } = caches;

    return useCallback(
        (draftText: string): boolean => {
            const content = draftText.trim();
            if (!content) return false;

            if (
                conversation.type === ConversationType.RIDE_RELATED ||
                conversation.isResolved
            ) {
                Toast.show({
                    type: 'error',
                    text1: 'Nuk mund të dërgohet',
                    text2: conversation.isResolved
                        ? 'Biseda është mbyllur.'
                        : 'Për këtë lloj bisede përdorni rrjedhën e udhëtimit.',
                });
                return false;
            }

            const ok = useSocketStore.getState().emit(CLIENT_SOCKET_EVENTS.sendOtherMessage, {
                passengerId: conversation.passengerId,
                driverId: conversation.driverId,
                conversationId: conversation.id,
                content,
                mediaUrls: [],
            });

            if (!ok) {
                Toast.show({
                    type: 'error',
                    text1: 'Jo e lidhur',
                    text2: 'Provoni përsëri pas një momenti.',
                });
                return false;
            }

            const optimisticId = `optimistic:${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            pendingOptimisticIdsRef.current.push(optimisticId);
            const now = new Date();
            const optimistic: Message = {
                id: optimisticId,
                conversationId: conversation.id,
                senderId: user.id,
                senderRole: user.role as Role,
                content,
                mediaUrls: [],
                priceOffer: null,
                isRead: true,
                createdAt: now,
                updatedAt: now,
                conversation,
                sender: user as unknown as Message['sender'],
            };
            applyOptimisticToCaches(optimistic);
            return true;
        },
        [applyOptimisticToCaches, conversation, pendingOptimisticIdsRef, user]
    );
}
