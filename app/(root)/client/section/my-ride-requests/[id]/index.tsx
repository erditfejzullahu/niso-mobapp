import RideRequestInfoSection from '@/components/active-routes/RideRequestInfoSection';
import PassengerRideRequestHeader from '@/components/my-ride-requests/PassengerRideRequestHeader';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import {
    RideRequestForbiddenError,
    RideRequestNotFoundError,
    usePassengerRideRequestDetail,
} from '@/hooks/my-ride-requests/usePassengerRideRequestDetail';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
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

    const onBack = useCallback(() => {
        router.back();
    }, []);

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
        <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 28 }}
            className="flex-1 bg-gray-50"
        >
            <PassengerRideRequestHeader ride={ride} onBack={onBack} />
            <RideRequestInfoSection ride={ride} />
        </ScrollView>
    );
}
