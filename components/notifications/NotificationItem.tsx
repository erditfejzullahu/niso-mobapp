import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import type { Notification, User as UserType } from '@/types/app-types';
import { useRouter } from 'expo-router';
import { useToggleNotifications } from '@/store/useToggleNotifications';
import { useNotificationMetadata } from '@/hooks/notifications/useNotificationMetadata';
import { useNotificationRideData } from '@/hooks/notifications/useNotificationRideData';
import { getNotificationActionButtonText, getNotificationContext } from '@/utils/notifications/notificationCopy';
import {
    getConnectedRideIdFromMetadata,
    getConversationIdFromMetadata,
    getRideRequestIdFromMetadata,
} from '@/utils/notifications/navigateAction';
import NotificationRow from '@/components/notifications/NotificationRow';
import NotificationDetailsModal from '@/components/notifications/NotificationDetailsModal';
import NotificationConversationSheet from './NotificationConversationSheet';

type Props = {
    item: Notification;
    onDelete: (id: string) => void;
    user: UserType;
};

/** Slightly longer than RN `Modal` slide animation; keeps us safe from dual-Modal stacking. */
const MODAL_DISMISS_DELAY_MS = 320;

function NotificationItem({ item, onDelete, user }: Props) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [openConversationSheet, setOpenConversationSheet] = useState(false);
    const { setToggled } = useToggleNotifications();
    const pendingOpenSheetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const metadata = useNotificationMetadata(item);

    const connectedRideId = useMemo(() => getConnectedRideIdFromMetadata(metadata), [metadata]);
    const rideRequestId = useMemo(() => getRideRequestIdFromMetadata(metadata), [metadata]);
    const conversationId = useMemo(() => getConversationIdFromMetadata(metadata), [metadata]);

    const { connectedRideQuery, rideRequestQuery } = useNotificationRideData({
        notificationId: item.id,
        connectedRideId,
        rideRequestId,
        enabled: openModal,
    });

    const senderImageUri = useMemo(() => {
        const metaSender = metadata?.notificationSender?.image;
        return metaSender || item.user.image || null;
    }, [item.user.image, metadata?.notificationSender?.image]);

    const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);

    const handleNotificationItemActions = useCallback(() => {
        if (metadata?.modalAction) setOpenModal(true);
    }, [metadata?.modalAction]);

    const notificationContext = useMemo(() => getNotificationContext(item.type), [item.type]);

    const actionButtonText = useMemo(() => {
        return getNotificationActionButtonText({
            type: item.type,
            connectedRideStatus: connectedRideQuery.data?.status ?? null,
            rideRequestStatus: rideRequestQuery.data?.status ?? null,
        });
    }, [connectedRideQuery.data?.status, item.type, rideRequestQuery.data?.status]);

    /** Two action buttons render only when both a ride request AND a conversation exist. */
    const secondaryActionText = useMemo(() => {
        if (item.type !== 'RIDE_UPDATE') return null;
        if (!conversationId) return null;
        return 'Hap Bisedën';
    }, [conversationId, item.type]);

    const navigateToRideRequest = useCallback(() => {
        if (!rideRequestId) return;
        if (user.role === 'DRIVER') {
            router.push(`/driver/section/active-routes/${rideRequestId}`);
        } else {
            router.push(`/client/section/my-ride-requests/${rideRequestId}`);
        }
    }, [rideRequestId, router, user.role]);

    /**
     * Opens the conversation sheet AFTER the details modal has finished its slide-out
     * animation. Stacking two RN `Modal`s during a transition can leave the screen
     * with a transparent overlay that swallows touches.
     */
    const scheduleOpenConversationSheet = useCallback(() => {
        if (pendingOpenSheetTimerRef.current) {
            clearTimeout(pendingOpenSheetTimerRef.current);
        }
        pendingOpenSheetTimerRef.current = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                setOpenConversationSheet(true);
                pendingOpenSheetTimerRef.current = null;
            });
        }, MODAL_DISMISS_DELAY_MS);
    }, []);

    const handleActionPress = useCallback(() => {
        switch (item.type) {
            case 'SYSTEM_ALERT':
                if (user.role === 'DRIVER') router.push('/driver/section/profile');
                else router.push('/client/section/client-profile');
                break;
            case 'MESSAGE':
                if (conversationId) {
                    setOpenModal(false);
                    scheduleOpenConversationSheet();
                    return;
                }
                break;
            case 'RIDE_UPDATE':
                if (rideRequestId) {
                    setOpenModal(false);
                    navigateToRideRequest();
                    return;
                }
                break;
            case 'PAYMENT':
            case 'PROMOTIONAL':
            default:
                break;
        }

        setOpenModal(false);
        setToggled(true);
    }, [conversationId, item.type, navigateToRideRequest, rideRequestId, router, scheduleOpenConversationSheet, setToggled, user.role]);

    const handleSecondaryActionPress = useCallback(() => {
        if (!conversationId) return;
        setOpenModal(false);
        scheduleOpenConversationSheet();
    }, [conversationId, scheduleOpenConversationSheet]);

    const handleCloseConversationSheet = useCallback(() => {
        setOpenConversationSheet(false);
    }, []);

    /** Defensive: close the conversation sheet + clear pending timers on unmount. */
    useEffect(() => {
        return () => {
            if (pendingOpenSheetTimerRef.current) {
                clearTimeout(pendingOpenSheetTimerRef.current);
                pendingOpenSheetTimerRef.current = null;
            }
            setOpenConversationSheet(false);
        };
    }, []);

    return (
        <>
            <NotificationRow
                item={item}
                senderImageUri={senderImageUri}
                onPress={handleNotificationItemActions}
                onDelete={handleDelete}
            />

            <NotificationDetailsModal
                visible={openModal}
                onClose={() => setOpenModal(false)}
                item={item}
                senderImageUri={senderImageUri}
                notificationContext={notificationContext}
                actionButtonText={actionButtonText}
                onActionPress={handleActionPress}
                secondaryActionText={secondaryActionText}
                onSecondaryActionPress={secondaryActionText ? handleSecondaryActionPress : undefined}
                connectedRideId={connectedRideId}
                rideRequestId={rideRequestId}
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

            {conversationId ? (
                <NotificationConversationSheet
                    user={user}
                    conversationId={conversationId}
                    visible={openConversationSheet}
                    onClose={handleCloseConversationSheet}
                    /** Pre-fetch while the details modal is open so the sheet has data the moment we mount it. */
                    prefetch={openModal && Boolean(secondaryActionText)}
                />
            ) : null}
        </>
    );
}

export default memo(NotificationItem);
