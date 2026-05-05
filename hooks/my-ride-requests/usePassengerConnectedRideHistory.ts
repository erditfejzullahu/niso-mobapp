import api from '@/hooks/useApi';
import type { CursorPage, PassengerConnectedRideHistoryItem } from '@/types/app-types';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_LIMIT = 15;

async function fetchPage(
    cursor: string | null,
    signal?: AbortSignal,
): Promise<CursorPage<PassengerConnectedRideHistoryItem>> {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (cursor) params.set('cursor', cursor);
    const res = await api.get<CursorPage<PassengerConnectedRideHistoryItem>>(
        `/passengers/my-connected-rides?${params.toString()}`,
        { signal },
    );
    return res.data;
}

export function usePassengerConnectedRideHistory() {
    return useInfiniteQuery({
        queryKey: ['passengerConnectedRideHistory'],
        queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: 30_000,
        retry: 2,
        refetchOnWindowFocus: false,
    });
}
