import ConnectedRideActions from '@/components/connected-ride/ConnectedRideActions';
import ConnectedRideHeader from '@/components/connected-ride/ConnectedRideHeader';
import ConnectedRideNotificationsModal from '@/components/connected-ride/ConnectedRideNotificationsModal';
import ConnectedRidePartyCard from '@/components/connected-ride/ConnectedRidePartyCard';
import ConnectedRideReviewModal from '@/components/connected-ride/ConnectedRideReviewModal';
import ConnectedRideRouteCard from '@/components/connected-ride/ConnectedRideRouteCard';
import ConnectedRideStatusBanner from '@/components/connected-ride/ConnectedRideStatusBanner';
import NotificationConversationSheet from '@/components/notifications/NotificationConversationSheet';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import ConfirmActionModal from '@/components/ui/ConfirmActionModal';
import { useAuth } from '@/context/AuthContext';
import {
    ConnectedRideForbiddenError,
    ConnectedRideNotFoundError,
    useConnectedRideDetail,
} from '@/hooks/connected-ride/useConnectedRideDetail';
import {
    useCancelConnectedRide,
    useStartConnectedRide,
} from '@/hooks/connected-ride/useConnectedRideMutations';
import { useRideNotificationsCount } from '@/hooks/connected-ride/useRideNotifications';
import { ConnectedRideStatus } from '@/types/app-types';
import Toast from '@/utils/appToast';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function isMissingError(e: unknown): boolean {
    return e instanceof ConnectedRideNotFoundError;
}

function isForbiddenError(e: unknown): boolean {
    return e instanceof ConnectedRideForbiddenError;
}

export default function ConnectedRideDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const connectedRideId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;

    const { user } = useAuth();
    const { data: ride, status, error, refetch, isRefetching } = useConnectedRideDetail(connectedRideId);

    const startMutation = useStartConnectedRide(connectedRideId);
    const cancelMutation = useCancelConnectedRide(connectedRideId);

    const [confirmStartOpen, setConfirmStartOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const notificationsScope = useMemo(() => ({
        connectedRideId: connectedRideId,
        rideRequestId: ride?.rideRequest?.id,
    }), [connectedRideId, ride?.rideRequest?.id]);

    const notifCountQuery = useRideNotificationsCount(notificationsScope, !!ride);

    const onBack = useCallback(() => router.back(), []);

    const handleStartConfirm = useCallback(async () => {
        try {
            await startMutation.mutateAsync();
            setConfirmStartOpen(false);
            Toast.show({ type: 'success', text1: 'Sukses', text2: 'Udhëtimi sapo filloi.' });
        } catch (err: any) {
            setConfirmStartOpen(false);
            Toast.show({
                type: 'error',
                text1: 'Gabim',
                text2: err?.response?.data?.message || 'Nuk u nis udhëtimi.',
            });
        }
    }, [startMutation]);

    const handleCancelConfirm = useCallback(async () => {
        try {
            await cancelMutation.mutateAsync();
            setConfirmCancelOpen(false);
            Toast.show({ type: 'success', text1: 'Sukses', text2: 'Udhëtimi u anulua.' });
        } catch (err: any) {
            setConfirmCancelOpen(false);
            Toast.show({
                type: 'error',
                text1: 'Gabim',
                text2: err?.response?.data?.message || 'Nuk u anulua udhëtimi.',
            });
        }
    }, [cancelMutation]);

    const handleViewRideRequest = useCallback(() => {
        if (!ride) return;
        if (ride.viewerRole === 'PASSENGER') {
            router.push(`/(root)/client/section/my-ride-requests/${ride.rideRequest.id}` as any);
        } else {
            router.push(`/(root)/driver/section/active-routes/${ride.rideRequest.id}` as any);
        }
    }, [ride]);

    const handleOpenChat = useCallback(() => {
        if (!ride?.conversation) {
            Toast.show({
                type: 'info',
                text1: 'Biseda nuk ekziston',
                text2: 'Asnjë bisedë e lidhur me këtë udhëtim.',
            });
            return;
        }
        setChatOpen(true);
    }, [ride?.conversation]);

    // Guards ─────────────────────────────────────────────────────────────────
    if (!user) {
        return (
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                <ErrorState
                    message="Ju duhet të jeni i kyçur."
                    onRetry={() => router.replace('/sign-in' as any)}
                    retryButtonText="Kyçuni"
                />
            </SafeAreaView>
        );
    }

    if (!connectedRideId) {
        return (
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                <ConnectedRideHeader title="Udhëtimi" onBack={onBack} />
                <ErrorState
                    message="Mungon identifikuesi i udhëtimit."
                    onRetry={onBack}
                    retryButtonText="Mbrapa"
                />
            </SafeAreaView>
        );
    }

    if (status === 'pending') {
        return (
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                <ConnectedRideHeader title="Udhëtimi" onBack={onBack} />
                <LoadingState message="Duke ngarkuar udhëtimin..." />
            </SafeAreaView>
        );
    }

    if (status === 'error' || !ride) {
        const message = isMissingError(error)
            ? 'Ky udhëtim nuk është më i disponueshëm.'
            : isForbiddenError(error)
              ? 'Ju nuk keni leje për të parë këtë udhëtim.'
              : 'Nuk mund të ngarkohet udhëtimi. Provoni përsëri.';
        return (
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
                <ConnectedRideHeader title="Udhëtimi" onBack={onBack} />
                <ErrorState message={message} onRetry={refetch} retryButtonText="Rifërko" />
            </SafeAreaView>
        );
    }

    // Derive data ─────────────────────────────────────────────────────────────
    const viewerRole = ride.viewerRole;
    const isDriver = viewerRole === 'DRIVER';
    const counterParty = isDriver ? ride.passenger : ride.driver;
    const counterPartyRole: 'driver' | 'passenger' = isDriver ? 'passenger' : 'driver';

    const isCompleted = ride.status === ConnectedRideStatus.COMPLETED;
    const isActive =
        ride.status === ConnectedRideStatus.WAITING || ride.status === ConnectedRideStatus.DRIVING;

    // Review eligibility (passengers only, ride must be COMPLETED, no review yet)
    const canLeaveReview = !isDriver && isCompleted && !ride.review;
    const reviewLockedReason = isDriver
        ? 'Vlerësimet do jenë të disponueshme më vonë.'
        : ride.review
          ? 'Ju keni vlerësuar tashmë këtë udhëtim.'
          : !isCompleted
            ? 'Vlerësimi është i disponueshëm pas përfundimit.'
            : undefined;

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <ConnectedRideHeader
                title="Udhëtimi i lidhur"
                subtitle={isDriver ? `Me pasagjerin ${ride.passenger.fullName}` : `Me shoferin ${ride.driver.fullName}`}
                onBack={onBack}
                onRefresh={() => refetch()}
                isRefreshing={isRefetching}
            />

            <ConnectedRideStatusBanner status={ride.status} createdAt={ride.createdAt} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} colors={['#4f46e5']} tintColor="#4f46e5" />
                }
            >
                <ConnectedRidePartyCard
                    role={counterPartyRole}
                    fullName={counterParty.fullName}
                    image={counterParty.image}
                    onOpenChat={handleOpenChat}
                    chatDisabled={!ride.conversation}
                    chatDisabledReason={!ride.conversation ? 'Asnjë bisedë e lidhur.' : undefined}
                />

                <ConnectedRideRouteCard
                    fromAddress={ride.rideRequest.fromAddress}
                    toAddress={ride.rideRequest.toAddress}
                    price={ride.rideRequest.price}
                    distanceKm={ride.rideRequest.distanceKm}
                    isUrgent={ride.rideRequest.isUrgent}
                    onViewRideRequest={handleViewRideRequest}
                />

                <ConnectedRideActions
                    status={ride.status}
                    role={viewerRole}
                    notificationsCount={notifCountQuery.data?.total ?? 0}
                    notificationsUnread={notifCountQuery.data?.unread ?? 0}
                    onOpenNotifications={() => setNotificationsOpen(true)}
                    onStartRide={isDriver && isActive ? () => setConfirmStartOpen(true) : undefined}
                    onCancelRide={isActive ? () => setConfirmCancelOpen(true) : undefined}
                    onLeaveReview={canLeaveReview ? () => setReviewOpen(true) : undefined}
                    canLeaveReview={canLeaveReview}
                    reviewLockedReason={reviewLockedReason}
                    isStarting={startMutation.isPending}
                    isCancelling={cancelMutation.isPending}
                />

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Confirm: start ride */}
            <ConfirmActionModal
                visible={confirmStartOpen}
                title="Filloni udhëtimin?"
                message="Pasi ta nisni, statusi i udhëtimit do ndryshojë në 'Në rrugë' dhe do njoftohet pasagjeri."
                confirmText="Filloni tani"
                cancelText="Anulo"
                isConfirming={startMutation.isPending}
                dismissOnBackdropPress={!startMutation.isPending}
                onCancel={() => setConfirmStartOpen(false)}
                onConfirm={() => void handleStartConfirm()}
            />

            {/* Confirm: cancel ride */}
            <ConfirmActionModal
                visible={confirmCancelOpen}
                title="Anuloni udhëtimin?"
                message={
                    isDriver
                        ? 'Anulimi i udhëtimit nga ana e shoferit do njoftojë pasagjerin dhe do mbyllë udhëtimin.'
                        : 'Anulimi brenda periudhës kohore mund të rezultojë në kufizime të llogarisë suaj.'
                }
                confirmText="Anuloni udhëtimin"
                cancelText="Mbylle"
                confirmVariant="destructive"
                isConfirming={cancelMutation.isPending}
                dismissOnBackdropPress={!cancelMutation.isPending}
                onCancel={() => setConfirmCancelOpen(false)}
                onConfirm={() => void handleCancelConfirm()}
            />

            {/* Notifications modal */}
            <ConnectedRideNotificationsModal
                visible={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                user={user}
                connectedRideId={ride.id}
                rideRequestId={ride.rideRequest.id}
                totalCount={notifCountQuery.data?.total ?? 0}
                unreadCount={notifCountQuery.data?.unread ?? 0}
            />

            {/* Review modal (passenger only) */}
            {!isDriver && (
                <ConnectedRideReviewModal
                    visible={reviewOpen}
                    onClose={() => setReviewOpen(false)}
                    driverId={ride.driver.id}
                    driverFullName={ride.driver.fullName}
                    connectedRideId={ride.id}
                    onSuccess={() => refetch()}
                />
            )}

            {/* Chat sheet */}
            {ride.conversation && (
                <NotificationConversationSheet
                    visible={chatOpen}
                    onClose={() => setChatOpen(false)}
                    user={user}
                    conversationId={ride.conversation.id}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f9fafb' },
    scroll: { padding: 16, gap: 14, paddingBottom: 32 },
});
