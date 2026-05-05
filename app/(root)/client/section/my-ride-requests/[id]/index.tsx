import RideRequestInfoSection from '@/components/active-routes/RideRequestInfoSection';
import PassengerRideRequestHeader from '@/components/my-ride-requests/PassengerRideRequestHeader';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import ConfirmActionModal from '@/components/ui/ConfirmActionModal';
import {
    RideRequestForbiddenError,
    RideRequestNotFoundError,
    useDeletePassengerRideRequest,
    usePassengerRideRequestDetail,
} from '@/hooks/my-ride-requests/usePassengerRideRequestDetail';
import Toast from '@/utils/appToast';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function isMissingError(e: unknown): boolean {
    return e instanceof RideRequestNotFoundError;
}

function isForbiddenError(e: unknown): boolean {
    return e instanceof RideRequestForbiddenError;
}

export default function PassengerRideRequestDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const rideRequestId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;

    const { data: ride, status, error, refetch } = usePassengerRideRequestDetail(rideRequestId);
    const deleteMutation = useDeletePassengerRideRequest(rideRequestId);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const onBack = useCallback(() => {
        router.back();
    }, []);

    const handleDeletePress = useCallback(() => {
        setConfirmDeleteOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            await deleteMutation.mutateAsync();
            setConfirmDeleteOpen(false);
            Toast.show({
                type: 'success',
                text1: 'Sukses!',
                text2: 'Kërkesa u fshi me sukses.',
            });
            router.back();
        } catch (err: any) {
            setConfirmDeleteOpen(false);
            const message =
                typeof err?.response?.data?.message === 'string'
                    ? err.response.data.message
                    : 'Nuk u fshi kërkesa. Provoni përsëri.';
            Toast.show({ type: 'error', text1: 'Gabim!', text2: message });
        }
    }, [deleteMutation]);

    if (!rideRequestId) {
        return (
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-gray-50">
                <View className="px-4 pt-2 pb-6 flex-1">
                    <PassengerRideRequestHeader ride={undefined} onBack={onBack} />
                    <ErrorState
                        message="Mungon identifikuesi i kërkesës. Kthehuni tek lista e kërkesave."
                        retryButtonText="Mbrapa"
                        onRetry={onBack}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (status === 'pending') {
        return (
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-gray-50 justify-center">
                <LoadingState />
            </SafeAreaView>
        );
    }

    if (status === 'error' || !ride) {
        const message = isMissingError(error)
            ? 'Kjo kërkesë nuk është më e disponueshme.'
            : isForbiddenError(error)
              ? 'Ju nuk keni leje për të parë këtë kërkesë udhëtimi.'
              : 'Nuk mund të lexohet kërkesa. Provoni përsëri.';

        return (
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-gray-50">
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <PassengerRideRequestHeader ride={undefined} onBack={onBack} />
                    <ErrorState message={message} onRetry={refetch} retryButtonText="Rifërko përsëri" />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 28 }}
                className="flex-1 bg-gray-50"
            >
                <PassengerRideRequestHeader ride={ride} onBack={onBack} onDelete={handleDeletePress} />
                <RideRequestInfoSection ride={ride} />
            </ScrollView>

            <ConfirmActionModal
                visible={confirmDeleteOpen}
                title="Fshi kërkesën e udhëtimit?"
                message="Ky veprim nuk mund të kthehet mbrapsht. Kërkesa do të fshihet përfundimisht dhe bisedat e lidhura do të mbeten pa kërkesë aktive."
                confirmText="Fshi"
                cancelText="Anulo"
                confirmVariant="destructive"
                isConfirming={deleteMutation.isPending}
                dismissOnBackdropPress={!deleteMutation.isPending}
                onCancel={() => setConfirmDeleteOpen(false)}
                onConfirm={() => void handleDeleteConfirm()}
            />
        </>
    );
}
