import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import api from '@/hooks/useApi';
import { paginationDto } from '@/utils/paginationDto';
import type { ConversationMessagesPageResponse } from '@/types/app-types';
import {
    conversationItemQueryKey,
    flattenInfiniteConversationMessages,
} from './useConversationCaches';

const NEAR_TOP_OFFSET_PX = 100;

export function useConversationMessagesQuery(conversationId: string, enabled: boolean) {
    const limit = paginationDto.limit;

    const query = useInfiniteQuery({
        queryKey: conversationItemQueryKey(conversationId),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const res = await api.get<ConversationMessagesPageResponse>(
                `/conversations/get-messages/${conversationId}`,
                { params: { page: pageParam, limit } }
            );
            return res.data;
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
            lastPage.hasMore ? Number(lastPageParam) + 1 : undefined,
        enabled,
        refetchOnWindowFocus: false,
    });

    const messages = useMemo(() => flattenInfiniteConversationMessages(query.data), [query.data]);

    return {
        messages,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isPending,
        isRefetching: query.isRefetching,
        error: query.error,
        refetch: query.refetch,
        nearTopLoadThresholdPx: NEAR_TOP_OFFSET_PX,
    };
}
