import api from '@/hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { connectedRideQueryKey } from './useConnectedRideDetail';

interface MutationOk { success: true; newStatus?: string }

export function useStartConnectedRide(connectedRideId: string | undefined) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await api.patch<MutationOk>(`/rides/connected-ride/${connectedRideId}/start`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: connectedRideQueryKey(connectedRideId) });
            qc.invalidateQueries({ queryKey: ['passengerConnectedRideHistory'] });
            qc.invalidateQueries({ queryKey: ['passengerRideHistory'] });
            qc.invalidateQueries({ queryKey: ['passengerHomeData'] });
        },
    });
}

export function useCancelConnectedRide(connectedRideId: string | undefined) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await api.patch<MutationOk>(`/rides/connected-ride/${connectedRideId}/cancel`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: connectedRideQueryKey(connectedRideId) });
            qc.invalidateQueries({ queryKey: ['passengerConnectedRideHistory'] });
            qc.invalidateQueries({ queryKey: ['passengerRideHistory'] });
            qc.invalidateQueries({ queryKey: ['passengerHomeData'] });
        },
    });
}
