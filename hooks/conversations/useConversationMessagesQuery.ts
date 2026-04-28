import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/hooks/useApi';
import { paginationDto } from '@/utils/paginationDto';
import type { Message } from '@/types/app-types';
import { conversationItemQueryKey } from './useConversationCaches';

export function useConversationMessagesQuery(conversationId: string, enabled: boolean) {
    const [pagination] = useState(() => ({ ...paginationDto }));

    return useQuery({
        queryKey: conversationItemQueryKey(conversationId),
        queryFn: async () => {
            const res = await api.get<Message[]>(
                `/conversations/get-messages/${conversationId}`,
                { params: pagination }
            );
            return res.data;
        },
        refetchOnWindowFocus: false,
        enabled,
    });
}
