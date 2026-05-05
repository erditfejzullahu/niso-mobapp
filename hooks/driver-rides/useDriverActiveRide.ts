import api from '@/hooks/useApi';
import type { DriverConnectedRideHistoryItem } from '@/types/app-types';
import { useQuery } from '@tanstack/react-query';

async function fetchActiveRide(signal?: AbortSignal): Promise<DriverConnectedRideHistoryItem | null> {
    const res = await api.get<DriverConnectedRideHistoryItem | null>('/drivers/my-active-ride', { signal });
    return res.data ?? null;
}

export function useDriverActiveRide() {
    return useQuery({
        queryKey: ['driverActiveRide'],
        queryFn: ({ signal }) => fetchActiveRide(signal),
        staleTime: 30_000,
        retry: 2,
        refetchOnWindowFocus: false,
    });
}
