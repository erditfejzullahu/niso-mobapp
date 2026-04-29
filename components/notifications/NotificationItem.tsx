import React, { memo, useCallback, useMemo, useState } from 'react';
import type { Notification, User as UserType } from '@/types/app-types';
import { useRouter } from 'expo-router';
import { useToggleNotifications } from '@/store/useToggleNotifications';
import { useNotificationMetadata } from '@/hooks/notifications/useNotificationMetadata';
import { useNotificationRideData } from '@/hooks/notifications/useNotificationRideData';
import { getNotificationActionButtonText, getNotificationContext } from '@/utils/notifications/notificationCopy';
import NotificationRow from '@/components/notifications/NotificationRow';
import NotificationDetailsModal from '@/components/notifications/NotificationDetailsModal';

type Props = {
    item: Notification;
    onDelete: (id: string) => void;
    user: UserType;
};

function NotificationItem({ item, onDelete, user }: Props) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const { setToggled } = useToggleNotifications();

    const metadata = useNotificationMetadata(item);

    const connectedRideId = metadata?.navigateAction?.connectedRide ?? null;
    const connectedRideRequestId = metadata?.navigateAction?.rideRequest ?? null;

    const { connectedRideQuery, rideRequestQuery } = useNotificationRideData({
        notificationId: item.id,
        connectedRideId,
        rideRequestId: connectedRideRequestId,
        enabled: openModal,
    });

    const senderImageUri = useMemo(() => {
        const metaSender = metadata?.notificationSender?.image;
        return metaSender || item.user.image || null;
    }, [item.user.image, metadata?.notificationSender?.image]);

    const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);

    const handleNotificationItemActions = useCallback(() => {
        if (metadata?.modalAction) setOpenModal(true);
        // navigateAction is intentionally handled by the main action button for now.
    }, [metadata?.modalAction]);

    const notificationContext = useMemo(() => getNotificationContext(item.type), [item.type]);

    const actionButtonText = useMemo(() => {
        return getNotificationActionButtonText({
            type: item.type,
            connectedRideStatus: connectedRideQuery.data?.status ?? null,
            rideRequestStatus: rideRequestQuery.data?.status ?? null,
        });
    }, [connectedRideQuery.data?.status, item.type, rideRequestQuery.data?.status]);

    const handleActionPress = useCallback(() => {
        switch (item.type) {
            case 'SYSTEM_ALERT':
                if (user.role === 'DRIVER') router.push('/driver/section/profile');
                else router.push('/client/section/client-profile');
                break;
            case 'MESSAGE':
                // TODO: navigate to chat (needs route + sender id mapping)
                break;
            case 'RIDE_UPDATE':
                // TODO: navigate to ride details / request details when routes are implemented
                break;
            case 'PAYMENT':
            case 'PROMOTIONAL':
            default:
                break;
        }

        setOpenModal(false);
        setToggled(true);
    }, [item.type, router, setToggled, user.role]);

    return (
        <>
            <NotificationRow item={item} senderImageUri={senderImageUri} onPress={handleNotificationItemActions} onDelete={handleDelete} />

            <NotificationDetailsModal
                visible={openModal}
                onClose={() => setOpenModal(false)}
                item={item}
                senderImageUri={senderImageUri}
                notificationContext={notificationContext}
                actionButtonText={actionButtonText}
                onActionPress={handleActionPress}
                connectedRideId={connectedRideId}
                rideRequestId={connectedRideRequestId}
                connectedRide={{
                    data: connectedRideQuery.data,
                    isLoading: connectedRideQuery.isLoading,
                    isRefetching: connectedRideQuery.isRefetching,
                    error: connectedRideQuery.error,
                    refetch: connectedRideQuery.refetch,
                }}
                rideRequest={{
                    data: rideRequestQuery.data,
                    isLoading: rideRequestQuery.isLoading,
                    isRefetching: rideRequestQuery.isRefetching,
                    error: rideRequestQuery.error,
                    refetch: rideRequestQuery.refetch,
                }}
            />
        </>
    );
}

export default memo(NotificationItem);

