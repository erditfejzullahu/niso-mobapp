import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { Conversations } from '@/types/app-types';
import api from '@/hooks/useApi';
import Toast from '@/utils/appToast';

type ConversationsPage = { data: Conversations[]; hasMore: boolean };
type ConversationsInfiniteData = { pages: ConversationsPage[]; pageParams: unknown[] };

function updateConversationResolvedStatus(
    data: Conversations[] | ConversationsInfiniteData | undefined,
    conversationId: string,
    isResolved: boolean
) {
    if (!data) return data;
    if (Array.isArray(data)) {
        return data.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, isResolved } : conversation
        );
    }

    return {
        ...data,
        pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((conversation) =>
                conversation.id === conversationId ? { ...conversation, isResolved } : conversation
            ),
        })),
    };
}

type Args = {
    conversationId: string;
    isResolved: boolean;
    onConversationReopened: () => void;
};

export function useReopenResolvedConversation({
    conversationId,
    isResolved,
    onConversationReopened,
}: Args) {
    const queryClient = useQueryClient();
    const [reopenModalOpen, setReopenModalOpen] = useState(false);
    const [isReopening, setIsReopening] = useState(false);

    const openReopenModal = useCallback(() => {
        if (isResolved) setReopenModalOpen(true);
    }, [isResolved]);

    const cancelReopen = useCallback(() => {
        if (!isReopening) setReopenModalOpen(false);
    }, [isReopening]);

    const confirmReopen = useCallback(async () => {
        if (isReopening) return;
        setIsReopening(true);
        try {
            await api.patch(`/conversations/reopen-conversation/${conversationId}`);
            queryClient.setQueriesData<Conversations[] | ConversationsInfiniteData>(
                { queryKey: ['conversations'] },
                (old) => updateConversationResolvedStatus(old, conversationId, false)
            );
            onConversationReopened();
            setReopenModalOpen(false);
            Toast.show({
                type: 'success',
                text1: 'Biseda u hap',
                text2: 'Tani mund te dergoni mesazh perseri.',
            });
        } catch (error) {
            console.error(error);
            const message =
                error instanceof AxiosError && typeof error.response?.data?.message === 'string'
                    ? error.response.data.message
                    : 'Nuk u hap biseda. Provoni perseri.';
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: message,
            });
        } finally {
            setIsReopening(false);
        }
    }, [conversationId, isReopening, onConversationReopened, queryClient]);

    return {
        reopenModalOpen,
        isReopening,
        openReopenModal,
        cancelReopen,
        confirmReopen,
    };
}
