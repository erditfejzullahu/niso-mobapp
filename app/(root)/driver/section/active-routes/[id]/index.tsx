import ActiveRouteDetailHeader from '@/components/active-routes/ActiveRouteDetailHeader';
import RideDetailActionBar from '@/components/active-routes/RideDetailActionBar';
import RideRequestInfoSection from '@/components/active-routes/RideRequestInfoSection';
import ErrorState from '@/components/system/ErrorState';
import LoadingState from '@/components/system/LoadingState';
import {
    RideNotInAvailableListError,
    useAvailableRideDetail,
} from '@/hooks/active-routes/useAvailableRideDetail';
import api from '@/hooks/useApi';
import { RideRequestStatus } from '@/types/app-types';
import { formatRidePriceLabel, hasPassengerFixedPrice } from '@/utils/active-routes/rideRequestDisplay';
import Toast from '@/utils/appToast';
import { router, useLocalSearchParams } from 'expo-router';
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TakeRideConfirmModal = lazy(() => import('@/components/active-routes/TakeRideConfirmModal'));
const CounterOfferModal = lazy(() => import('@/components/active-routes/CounterOfferModal'));
const DriverOfferModal = lazy(() => import('@/components/active-routes/DriverOfferModal'));

function isRideMissingError(e: unknown): boolean {
    return (
        e instanceof RideNotInAvailableListError ||
        (e instanceof Error && e.message === 'RIDE_NOT_IN_AVAILABLE_LIST')
    );
}

export default function ActiveRouteRideRequestDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const rideRequestId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;

    const { data: ride, status, error, refetch } = useAvailableRideDetail(rideRequestId);

    const [takeModalOpen, setTakeModalOpen] = useState(false);
    const [counterModalOpen, setCounterModalOpen] = useState(false);
    const [offerModalOpen, setOfferModalOpen] = useState(false);

    useEffect(() => {
        setTakeModalOpen(false);
        setCounterModalOpen(false);
        setOfferModalOpen(false);
    }, [rideRequestId]);

    const onBack = useCallback(() => {
        router.back();
    }, []);

    const passengerPriceLabelForCounter = useMemo(() => {
        if (!ride) return '';
        return formatRidePriceLabel(ride);
    }, [ride]);

    const fixedPriceMode = ride ? hasPassengerFixedPrice(ride) : false;
    const canInteract = ride?.status === RideRequestStatus.WAITING;

    const openSecondaryModal = useCallback(() => {
        if (!ride) return;
        if (!canInteract) {
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: 'Kjo kërkesë udhëtimi nuk është më në pritje. Ju nuk mund te shprehni gadishmerine per udhetimin.',
            });
            return;
        }
        if (hasPassengerFixedPrice(ride)) {
            setCounterModalOpen(true);
        } else {
            setOfferModalOpen(true);
        }
    }, [ride, canInteract]);

    const stubNotifyPassengerReady = useCallback(async (_message?: string) => {
        if (!rideRequestId) return;
        if (!canInteract) {
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: 'Kjo kërkesë udhëtimi nuk është më në pritje. Ju nuk mund te shprehni gadishmerine per udhetimin.',
            });
            return;
        }
        try {
            const payload = _message ? { message: _message } : {};
            const response = await api.patch(`/rides/notify-passenger-that-driver-is-ready/${rideRequestId}`, {
                ...payload,
            });
            setTakeModalOpen(false);
            Toast.show({
                type: 'success',
                text1: 'Sukses!',
                text2: response.data.message ?? 'Pasagjeri u njoftua që jeni gati.',
            });
        } catch (error: any) {
            console.log(error?.response?.data);
            const message =
                typeof error?.response?.data?.message === 'string'
                    ? error.response.data.message
                    : 'Nuk u dërgua njoftimi. Provoni përsëri.';
            Toast.show({
                type: 'error',
                text1: 'Gabim!',
                text2: message,
            });
        }
    }, [rideRequestId, canInteract]);

    const stubCounterOffer = useCallback((_amountEuro: string, _message?: string) => {
        /** TODO: send counter-offer via API when provided */
    }, []);

    const stubDriverOffer = useCallback((_amountEuro: string) => {
        /** TODO: send driver price offer via API when provided */
    }, []);

    if (!rideRequestId) {
        return (
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-gray-50">
                <View className="px-4 pt-2 pb-6 flex-1">
                    <ActiveRouteDetailHeader ride={undefined} onBack={onBack} />
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
        const message = isRideMissingError(error)
            ? 'Kjo kërkesë nuk është më e disponueshme në udhëtimet aktive — mund të jetë përfunduar nga një shofer tjetër ose të ketë përfunduar afati.'
            : 'Nuk mund të lexohet kërkesa. Provoni përsëri.';

        return (
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-gray-50">
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <ActiveRouteDetailHeader ride={undefined} onBack={onBack} />
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
                className="flex-1"
            >
                <ActiveRouteDetailHeader ride={ride} onBack={onBack} />
                <RideRequestInfoSection ride={ride} />
                <RideDetailActionBar
                    ride={ride}
                    disabled={!canInteract}
                    onNotifyPassengerReady={() => setTakeModalOpen(true)}
                    onCounterOrOffer={openSecondaryModal}
                />
            </ScrollView>

            <Suspense fallback={null}>
                {/* kjo osht kur je gati me pranu e mu nisje */}
                {takeModalOpen ? (
                    <TakeRideConfirmModal
                        visible={takeModalOpen}
                        onClose={() => setTakeModalOpen(false)}
                        onConfirmNotifyPassengerReady={stubNotifyPassengerReady}
                    />
                ) : null}
                {/* kjo osht kur ka cmim fiks */}
                {counterModalOpen ? (
                    <CounterOfferModal
                        visible={counterModalOpen && fixedPriceMode}
                        onClose={() => setCounterModalOpen(false)}
                        passengerPriceLabel={passengerPriceLabelForCounter}
                        onSubmitCounterOffer={stubCounterOffer}
                    />
                ) : null}
                {/* kjo osht kur s'ka cmim fiks */}
                {offerModalOpen ? (
                    <DriverOfferModal
                        visible={offerModalOpen && !fixedPriceMode}
                        onClose={() => setOfferModalOpen(false)}
                        onSubmitDriverOffer={stubDriverOffer}
                    />
                ) : null}
            </Suspense>
        </>
    );
}
