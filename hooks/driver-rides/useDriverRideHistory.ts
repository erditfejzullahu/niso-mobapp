import api from '@/hooks/useApi';
import type { CursorPage, DriverRideHistoryItem } from '@/types/app-types';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_LIMIT = 15;

async function fetchPage(
    cursor: string | null,
    signal?: AbortSignal,
): Promise<CursorPage<DriverRideHistoryItem>> {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (cursor) params.set('cursor', cursor);
    const res = await api.get<CursorPage<DriverRideHistoryItem>>(
        `/drivers/my-ride-history?${params.toString()}`,
        { signal },
    );
    return res.data;
}

export function useDriverRideHistory() {
    return useInfiniteQuery({
        queryKey: ['driverRideHistory'],
        queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: 30_000,
        retry: 2,
        refetchOnWindowFocus: false,
    });
}
