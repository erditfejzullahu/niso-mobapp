import api from '@/hooks/useApi';
import type { Notification, RideNotificationsCount } from '@/types/app-types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface RideNotificationsPage {
    data: Notification[];
    hasMore: boolean;
    nextCursor: string | null;
}

const PAGE_LIMIT = 15;

interface RideScope {
    connectedRideId?: string;
    rideRequestId?: string;
}

function buildScopeKey(scope: RideScope): string {
    return `${scope.connectedRideId ?? ''}|${scope.rideRequestId ?? ''}`;
}

function hasAnyId(scope: RideScope): boolean {
    return !!(scope.connectedRideId || scope.rideRequestId);
}

async function fetchPage(scope: RideScope, cursor: string | null, signal?: AbortSignal): Promise<RideNotificationsPage> {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (scope.connectedRideId) params.set('connectedRideId', scope.connectedRideId);
    if (scope.rideRequestId) params.set('rideRequestId', scope.rideRequestId);
    if (cursor) params.set('cursor', cursor);
    const res = await api.get<RideNotificationsPage>(`/notifications/by-ride?${params.toString()}`, { signal });
    return res.data;
}

export function useRideNotifications(scope: RideScope, enabled = true) {
    return useInfiniteQuery({
        queryKey: ['rideNotifications', buildScopeKey(scope)],
        enabled: enabled && hasAnyId(scope),
        queryFn: ({ pageParam, signal }) => fetchPage(scope, pageParam, signal),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: 15_000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

export function useRideNotificationsCount(scope: RideScope, enabled = true) {
    return useQuery({
        queryKey: ['rideNotificationsCount', buildScopeKey(scope)],
        enabled: enabled && hasAnyId(scope),
        queryFn: async ({ signal }) => {
            const params = new URLSearchParams();
            if (scope.connectedRideId) params.set('connectedRideId', scope.connectedRideId);
            if (scope.rideRequestId) params.set('rideRequestId', scope.rideRequestId);
            const res = await api.get<RideNotificationsCount>(`/notifications/by-ride/count?${params.toString()}`, { signal });
            return res.data;
        },
        staleTime: 15_000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}
