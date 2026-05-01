import api from '@/hooks/useApi';
import { RideRequest } from '@/types/app-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
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
    try {
        const res = await api.get<RideRequest>(`/drivers/available-rides/${id}`, { signal });
        return res.data;
    } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status === 404) {
            throw new RideNotInAvailableListError();
        }
        throw e;
    }
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
