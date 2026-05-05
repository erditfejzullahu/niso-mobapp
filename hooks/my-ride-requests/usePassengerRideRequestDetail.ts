import api from '@/hooks/useApi';
import type { RideRequest } from '@/types/app-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export class RideRequestNotFoundError extends Error {
    constructor() {
        super('RIDE_REQUEST_NOT_FOUND');
        this.name = 'RideRequestNotFoundError';
    }
}

export class RideRequestForbiddenError extends Error {
    constructor() {
        super('RIDE_REQUEST_FORBIDDEN');
        this.name = 'RideRequestForbiddenError';
    }
}

async function fetchPassengerRideRequestById(id: string, signal?: AbortSignal): Promise<RideRequest> {
    try {
        const res = await api.get<RideRequest>(`/rides/passenger-ride-request/${id}`, { signal });
        return res.data;
    } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status === 404) throw new RideRequestNotFoundError();
        if (err.response?.status === 403) throw new RideRequestForbiddenError();
        throw e;
    }
}

export function usePassengerRideRequestDetail(rideRequestId: string | undefined) {
    return useQuery({
        queryKey: ['passengerRideRequest', rideRequestId],
        enabled: !!rideRequestId,
        queryFn: ({ signal }) => fetchPassengerRideRequestById(rideRequestId!, signal),
        staleTime: 30_000,
        retry: 1,
    });
}

export function useDeletePassengerRideRequest(rideRequestId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.delete(`/rides/passenger-ride-request/${rideRequestId}`);
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['passengerRideRequest', rideRequestId] });
        },
    });
}
