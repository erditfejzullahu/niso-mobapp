import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import type { NotificationConnectedRide, NotificationRideRequest } from '@/types/app-types';

export function useNotificationRideData(args: {
    notificationId: string;
    connectedRideId?: string | null;
    rideRequestId?: string | null;
    enabled: boolean;
}) {
    const { notificationId, connectedRideId, rideRequestId, enabled } = args;

    const connectedRideQuery = useQuery({
        queryKey: ['notifConnectedRide', notificationId],
        queryFn: async () => {
            const res = await api.get<NotificationConnectedRide>(
                `/notifications/get-notification-connected-ride/${notificationId}`,
            );
            return res.data;
        },
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: Boolean(connectedRideId) && enabled,
    });

    const rideRequestQuery = useQuery({
        queryKey: ['notifRideRequest', notificationId],
        queryFn: async () => {
            const res = await api.get<NotificationRideRequest>(
                `/notification/get-notification-ride-request/${notificationId}`,
            );
            return res.data;
        },
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: Boolean(rideRequestId) && enabled,
    });

    return { connectedRideQuery, rideRequestQuery };
}

