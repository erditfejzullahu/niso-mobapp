import api from '@/hooks/useApi';
import { RideRequest } from '@/types/app-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useMemo } from 'react';

export class RideNotInAvailableListError extends Error {
    constructor() {
        super('RIDE_NOT_IN_AVAILABLE_LIST');
        this.name = 'RideNotInAvailableListError';
    }
}

type AvailableRidesBody = {
    rides: RideRequest[];
    hasMore: boolean;
};

/** Reads rides cached from the listing query (`availableRides` key). */
function rideFromListingCache(queryClient: ReturnType<typeof useQueryClient>, id: string): RideRequest | undefined {
    const entries = queryClient.getQueriesData<AxiosResponse<AvailableRidesBody>>({
        queryKey: ['availableRides'],
    });

    for (const [, axiosRes] of entries) {
        if (!axiosRes?.data?.rides) continue;
        const found = axiosRes.data.rides.find((r) => r.id === id);
        if (found) return found;
    }

    return undefined;
}

async function fetchAvailableRideById(id: string, signal?: AbortSignal): Promise<RideRequest> {
    const limit = 50;
    let page = 1;
    const maxPages = 40;

    while (page <= maxPages) {
        const res = await api.get<AvailableRidesBody>('/drivers/available-rides', {
            params: {
                sortOrder: 'latest',
                urgencyType: 'normal',
                distanceRange: undefined,
                page,
                limit,
            },
            signal,
        });

        const { rides, hasMore } = res.data;
        const found = rides.find((r) => r.id === id);
        if (found) return found;

        if (!hasMore) break;
        page += 1;
    }

    throw new RideNotInAvailableListError();
}

export function useAvailableRideDetail(rideRequestId: string | undefined) {
    const queryClient = useQueryClient();

    const placeholderData = useMemo(() => {
        if (!rideRequestId) return undefined;
        return rideFromListingCache(queryClient, rideRequestId);
    }, [queryClient, rideRequestId]);

    return useQuery({
        queryKey: ['availableRide', rideRequestId],
        enabled: !!rideRequestId,
        queryFn: ({ signal }) => fetchAvailableRideById(rideRequestId!, signal),
        placeholderData,
        staleTime: 30_000,
        retry: 1,
    });
}
