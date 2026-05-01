import { useCallback, useRef } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { ConversationMessagesPageResponse, Conversations, Message } from '@/types/app-types';

export const conversationItemQueryKey = (conversationId: string) =>
    ['conversation-item', conversationId] as const;

const conversationsListQueryKey = ['conversations'] as const;

export type ConversationMessagesInfiniteData = InfiniteData<ConversationMessagesPageResponse>;

export function flattenConversationMessagePagesArray(
    pages: ConversationMessagesPageResponse[]
): Message[] {
    /** `pages[0]` = latest API page (newest msgs); append older pages after. */
    return [...pages]
        .reverse()
        .flatMap((page) => sortMessagesByCreatedAtAsc(page.messages));
}

export function flattenInfiniteConversationMessages(
    data: ConversationMessagesInfiniteData | undefined
): Message[] {
    if (!data?.pages.length) return [];
    return flattenConversationMessagePagesArray(data.pages);
}

export function conversationDateField(d: Message['createdAt']): Date {
    return d instanceof Date ? d : new Date(d as unknown as string);
}

export function sortMessagesByCreatedAtAsc(messages: Message[]): Message[] {
    return [...messages].sort(
        (a, b) => conversationDateField(a.createdAt).getTime() - conversationDateField(b.createdAt).getTime()
    );
}

function latestMessageInList(list: Message[]): Message | undefined {
    return list.reduce<Message | undefined>((acc, m) => {
        if (!acc) return m;
        return conversationDateField(m.createdAt) > conversationDateField(acc.createdAt) ? m : acc;
    }, undefined);
}

function messageExistsInPages(pages: ConversationMessagesPageResponse[], id: string): boolean {
    return pages.some((p) => p.messages.some((m) => m.id === id));
}

/**
 * Optimistic-send flow: append to thread (newest at bottom) + list preview, then reconcile via socket
 * `newMessage`, or roll back preview on `errorSendingMessage`.
 */
export function useConversationCaches(conversationId: string) {
    const queryClient = useQueryClient();
    /** FIFO: server acknowledgements ordered with sends. */
    const pendingOptimisticIdsRef = useRef<string[]>([]);

    const applyOptimisticToCaches = useCallback(
        (optimistic: Message) => {
            const lastAt = conversationDateField(optimistic.createdAt);
            queryClient.setQueryData<ConversationMessagesInfiniteData>(
                conversationItemQueryKey(conversationId),
                (old) => {
                    if (!old?.pages.length) {
                        return {
                            pages: [{ messages: [optimistic], hasMore: false }],
                            pageParams: [undefined],
                        };
                    }
                    const pages = old.pages.map((p, i) =>
                        i === 0 ? { ...p, messages: [optimistic, ...p.messages] } : p
                    );
                    return { ...old, pages };
                }
            );
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
            queryClient.setQueryData<ConversationMessagesInfiniteData>(
                conversationItemQueryKey(conversationId),
                (old) => {
                    if (!old?.pages.length) {
                        return {
                            pages: [{ messages: [serverMsg], hasMore: false }],
                            pageParams: [undefined],
                        };
                    }
                    const pages = old.pages.map((p) => ({ ...p, messages: [...p.messages] }));
                    for (let i = 0; i < pages.length; i++) {
                        const idx = pages[i].messages.findIndex((m) => m.id === replaceOptimisticId);
                        if (idx !== -1) {
                            pages[i].messages[idx] = serverMsg;
                            return { ...old, pages };
                        }
                    }
                    if (messageExistsInPages(pages, serverMsg.id)) return old;
                    pages[0].messages = [serverMsg, ...pages[0].messages];
                    return { ...old, pages };
                }
            );
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
            queryClient.setQueryData<ConversationMessagesInfiniteData>(
                conversationItemQueryKey(conversationId),
                (old) => {
                    if (!old?.pages.length) {
                        return {
                            pages: [{ messages: [serverMsg], hasMore: false }],
                            pageParams: [undefined],
                        };
                    }
                    if (messageExistsInPages(old.pages, serverMsg.id)) return old;
                    const pages = old.pages.map((p, i) =>
                        i === 0 ? { ...p, messages: [serverMsg, ...p.messages] } : p
                    );
                    return { ...old, pages };
                }
            );
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
            queryClient.setQueryData<ConversationMessagesInfiniteData>(
                conversationItemQueryKey(conversationId),
                (old) => {
                    if (!old?.pages.length) return old;
                    const pages = old.pages.map((p, i) =>
                        i === 0
                            ? { ...p, messages: p.messages.filter((m) => m.id !== failedId) }
                            : p
                    );
                    top = latestMessageInList(flattenConversationMessagePagesArray(pages));
                    return { ...old, pages };
                }
            );
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
