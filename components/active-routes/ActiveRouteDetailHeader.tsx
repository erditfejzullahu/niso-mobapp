import { RideRequest } from '@/types/app-types';
import { AlertTriangle, ArrowLeft, Clock } from 'lucide-react-native';
import React, { memo, useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';

dayjs.extend(relativeTime);
dayjs.locale('sq');

type Props = {
    ride?: RideRequest | null;
    onBack: () => void;
};

const ActiveRouteDetailHeader = memo(function ActiveRouteDetailHeader({ ride, onBack }: Props) {
    const relativeCreated = useMemo(
        () => (ride?.createdAt ? dayjs(ride.createdAt).fromNow() : ''),
        [ride?.createdAt]
    );

    return (
        <View className="bg-white rounded-2xl mx-4 mb-2 px-4 py-3 mt-4 shadow shadow-black/5">
            <View className="flex-row items-center mb-3">
                <TouchableOpacity onPress={onBack} className="mr-3 p-1" accessibilityRole="button" accessibilityLabel="Kthehu mbrapa">
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="flex-1 text-lg font-psemibold text-indigo-950 pr-2">Detajet e kërkesës</Text>
            </View>

            <View className="flex-row items-center">
                {ride?.passenger?.image ? (
                    <Image source={{ uri: ride.passenger.image }} className="w-14 h-14 rounded-full mr-3" />
                ) : (
                    <View className="w-14 h-14 rounded-full mr-3 bg-indigo-100" />
                )}
                <View className="flex-1">
                    <Text className="text-base font-psemibold text-gray-900">{ride?.passenger?.fullName ?? '—'}</Text>
                    {!!relativeCreated && (
                        <View className="flex-row items-center mt-0.5">
                            <Clock size={14} color="#6B7280" />
                            <Text className="ml-1 text-gray-500 text-sm font-pregular">{relativeCreated}</Text>
                        </View>
                    )}
                </View>
                {ride?.isUrgent ? (
                    <View className="bg-red-100 px-2 py-1 rounded-full flex-row items-center">
                        <AlertTriangle size={14} color="#DC2626" />
                        <Text className="ml-1 text-red-600 text-xs font-semibold">Urgjente</Text>
                    </View>
                ) : null}
            </View>

            {ride ? (
                <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-xs text-gray-500 font-pregular mb-1">Nga → Deri</Text>
                    <Text className="text-sm text-gray-800 font-pmedium" numberOfLines={3}>
                        {ride.fromAddress}
                        {'  →  '}
                        {ride.toAddress}
                    </Text>
                </View>
            ) : null}
        </View>
    );
});

export default ActiveRouteDetailHeader;
