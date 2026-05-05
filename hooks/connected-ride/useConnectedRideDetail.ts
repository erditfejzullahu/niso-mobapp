import api from '@/hooks/useApi';
import type { ConnectedRideDetail } from '@/types/app-types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export class ConnectedRideNotFoundError extends Error {
    constructor() {
        super('CONNECTED_RIDE_NOT_FOUND');
        this.name = 'ConnectedRideNotFoundError';
    }
}

export class ConnectedRideForbiddenError extends Error {
    constructor() {
        super('CONNECTED_RIDE_FORBIDDEN');
        this.name = 'ConnectedRideForbiddenError';
    }
}

async function fetchConnectedRideById(id: string, signal?: AbortSignal): Promise<ConnectedRideDetail> {
    try {
        const res = await api.get<ConnectedRideDetail>(`/rides/connected-ride/${id}`, { signal });
        return res.data;
    } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status === 404) throw new ConnectedRideNotFoundError();
        if (err.response?.status === 403) throw new ConnectedRideForbiddenError();
        throw e;
    }
}

export function useConnectedRideDetail(connectedRideId: string | undefined) {
    return useQuery({
        queryKey: ['connectedRide', connectedRideId],
        enabled: !!connectedRideId,
        queryFn: ({ signal }) => fetchConnectedRideById(connectedRideId!, signal),
        staleTime: 15_000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

export const connectedRideQueryKey = (id: string | undefined) => ['connectedRide', id] as const;
