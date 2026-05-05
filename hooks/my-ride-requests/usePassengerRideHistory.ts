import api from '@/hooks/useApi';
import type { CursorPage, PassengerRideHistoryItem } from '@/types/app-types';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_LIMIT = 15;

async function fetchPage(
    cursor: string | null,
    signal?: AbortSignal,
): Promise<CursorPage<PassengerRideHistoryItem>> {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (cursor) params.set('cursor', cursor);
    const res = await api.get<CursorPage<PassengerRideHistoryItem>>(
        `/passengers/my-ride-history?${params.toString()}`,
        { signal },
    );
    return res.data;
}

export function usePassengerRideHistory() {
    return useInfiniteQuery({
        queryKey: ['passengerRideHistory'],
        queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: 30_000,
        retry: 2,
        refetchOnWindowFocus: false,
    });
}
