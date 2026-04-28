import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Conversations, Message } from '@/types/app-types';

export const conversationItemQueryKey = (conversationId: string) =>
    ['conversation-item', conversationId] as const;

const conversationsListQueryKey = ['conversations'] as const;

export function conversationDateField(d: Message['createdAt']): Date {
    return d instanceof Date ? d : new Date(d as unknown as string);
}

/**
 * Optimistic-send flow: prepend thread + update list preview, then reconcile via socket `newMessage`,
 * or roll back preview on `errorSendingMessage`.
 */
export function useConversationCaches(conversationId: string) {
    const queryClient = useQueryClient();
    /** FIFO: server acknowledgements ordered with sends. */
    const pendingOptimisticIdsRef = useRef<string[]>([]);

    const applyOptimisticToCaches = useCallback(
        (optimistic: Message) => {
            const lastAt = conversationDateField(optimistic.createdAt);
            queryClient.setQueryData<Message[]>(conversationItemQueryKey(conversationId), (old) => [
                optimistic,
                ...(old ?? []),
            ]);
            queryClient.setQueryData<Conversations[]>(conversationsListQueryKey, (old) => {
                if (!old) return old;
                return old.map((c) =>
                    c.id === conversationId ? { ...c, messages: [optimistic], lastMessageAt: lastAt } : c
                );
            });
        },
        [conversationId, queryClient]
    );

    const commitServerMessageToCaches = useCallback(
        (serverMsg: Message, replaceOptimisticId: string) => {
            const lastAt = conversationDateField(serverMsg.createdAt);
            queryClient.setQueryData<Message[]>(conversationItemQueryKey(conversationId), (old) => {
                const list = old ?? [];
                const idx = list.findIndex((m) => m.id === replaceOptimisticId);
                if (idx !== -1) {
                    const next = [...list];
                    next[idx] = serverMsg;
                    return next;
                }
                if (list.some((m) => m.id === serverMsg.id)) return list;
                return [serverMsg, ...list];
            });
            queryClient.setQueryData<Conversations[]>(conversationsListQueryKey, (old) => {
                if (!old) return old;
                return old.map((c) =>
                    c.id === conversationId ? { ...c, messages: [serverMsg], lastMessageAt: lastAt } : c
                );
            });
        },
        [conversationId, queryClient]
    );

    const appendTheirMessageToCaches = useCallback(
        (serverMsg: Message) => {
            const lastAt = conversationDateField(serverMsg.createdAt);
            queryClient.setQueryData<Message[]>(conversationItemQueryKey(conversationId), (old) => {
                const list = old ?? [];
                if (list.some((m) => m.id === serverMsg.id)) return list;
                return [serverMsg, ...list];
            });
            queryClient.setQueryData<Conversations[]>(conversationsListQueryKey, (old) => {
                if (!old) return old;
                return old.map((c) =>
                    c.id === conversationId ? { ...c, messages: [serverMsg], lastMessageAt: lastAt } : c
                );
            });
        },
        [conversationId, queryClient]
    );

    const removeFailedOptimistic = useCallback(
        (failedId: string) => {
            let top: Message | undefined;
            queryClient.setQueryData<Message[]>(conversationItemQueryKey(conversationId), (old) => {
                const list = (old ?? []).filter((m) => m.id !== failedId);
                top = list[0];
                return list;
            });
            if (top) {
                const lastAt = conversationDateField(top.createdAt);
                queryClient.setQueryData<Conversations[]>(conversationsListQueryKey, (old) => {
                    if (!old) return old;
                    return old.map((c) =>
                        c.id === conversationId ? { ...c, messages: [top!], lastMessageAt: lastAt } : c
                    );
                });
            }
        },
        [conversationId, queryClient]
    );

    return {
        pendingOptimisticIdsRef,
        applyOptimisticToCaches,
        commitServerMessageToCaches,
        appendTheirMessageToCaches,
        removeFailedOptimistic,
    };
}

export type ConversationCachesApi = ReturnType<typeof useConversationCaches>;
