import { RideRequest } from '@/types/app-types';
import { hasPassengerFixedPrice } from '@/utils/active-routes/rideRequestDisplay';
import { Euro, HandCoins, ShieldCheck } from 'lucide-react-native';
import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
    ride: RideRequest;
    onTakeRide: () => void;
    onCounterOrOffer: () => void;
};

const RideDetailActionBar = memo(function RideDetailActionBar({ ride, onTakeRide, onCounterOrOffer }: Props) {
    const hasFixed = useMemo(() => hasPassengerFixedPrice(ride), [ride]);

    const secondaryLabel = hasFixed ? 'Kontraofertë' : 'Bëj ofertë';

    const secondaryExplanation = useMemo(() => {
        if (hasFixed) {
            return 'Propozoni një çmim tjetër nëse nuk pajtoheni me çmimin e pasagjerit.';
        }
        return 'Pasagjeri nuk ka përcaktuar çmim të fiks; propozoni ju një çmim për miratim.';
    }, [hasFixed]);

    return (
        <View className="mx-4 mb-20">
            <Text className="text-xs text-gray-500 font-pregular mb-3">{secondaryExplanation}</Text>
            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={onTakeRide}
                    className="flex-1 bg-indigo-600 rounded-xl py-3.5 px-3 flex-row items-center justify-center gap-2 shadow shadow-indigo-500/20"
                    accessibilityRole="button"
                    accessibilityLabel="Prano udhëtimin"
                >
                    <ShieldCheck size={20} color="#fff" />
                    <Text className="text-white font-psemibold text-sm text-center">Prano udhëtimin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onCounterOrOffer}
                    className="flex-1 bg-white border border-indigo-200 rounded-xl py-3.5 px-3 flex-row items-center justify-center gap-2 shadow shadow-black/5"
                    accessibilityRole="button"
                    accessibilityLabel={secondaryLabel}
                >
                    {hasFixed ? <HandCoins size={20} color="#4f46e5" /> : <Euro size={20} color="#4f46e5" />}
                    <Text className="text-indigo-700 font-psemibold text-sm text-center">{secondaryLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default RideDetailActionBar;
