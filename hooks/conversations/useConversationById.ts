import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import type { Conversations } from '@/types/app-types';

/**
 * Fetch a single conversation by id. Used when opening a conversation directly
 * (e.g. from a notification's "Hap Bisedën" action) without going through the
 * conversations list.
 */
export function useConversationById(conversationId: string | null | undefined, enabled: boolean) {
    return useQuery({
        queryKey: ['conversation-by-id', conversationId],
        queryFn: async () => {
            const res = await api.get<Conversations>(`/conversations/get-conversation/${conversationId}`);
            return res.data;
        },
        enabled: Boolean(conversationId) && enabled,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
