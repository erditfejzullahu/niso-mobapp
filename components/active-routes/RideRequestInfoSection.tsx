import { RideRequest } from '@/types/app-types';
import { formatRidePriceLabel, hasPassengerFixedPrice, rideRequestStatusLabel } from '@/utils/active-routes/rideRequestDisplay';
import { MapPin } from 'lucide-react-native';
import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/sq';

dayjs.locale('sq');

type RowProps = { label: string; value: string; last?: boolean };

const InfoRow = memo(function InfoRow({ label, value, last }: RowProps) {
    return (
        <View className={`flex-row justify-between items-start py-3 ${last ? '' : 'border-b border-gray-100'}`}>
            <Text className="text-xs text-gray-500 font-pregular shrink mr-3">{label}</Text>
            <Text className="text-xs font-pmedium text-indigo-950 flex-1 text-right">{value}</Text>
        </View>
    );
});

type Props = { ride: RideRequest };

const RideRequestInfoSection = memo(function RideRequestInfoSection({ ride }: Props) {
    const formattedCreated = useMemo(
        () => dayjs(ride.createdAt).format('D MMM YYYY, HH:mm'),
        [ride.createdAt]
    );
    const formattedUpdated = useMemo(
        () => dayjs(ride.updatedAt).format('D MMM YYYY, HH:mm'),
        [ride.updatedAt]
    );

    const distanceLabel = useMemo(() => {
        const d = ride.distanceKm;
        if (d === undefined || d === null || d === '') return '—';
        return `${d} km`;
    }, [ride.distanceKm]);

    const tariffNote = useMemo(() => {
        return ride.distanceCalculatedPriceRide ? 'Po (çmimi bazohet në distancë)' : 'Jo (çmim i përcaktuar nga pasagjeri)';
    }, [ride.distanceCalculatedPriceRide]);

    return (
        <View className="bg-white rounded-2xl mx-4 mb-3 p-4 shadow shadow-black/5">
            <View className="flex-row items-center gap-2 mb-2">
                <MapPin size={18} color="#4f46e5" />
                <Text className="text-base font-psemibold text-indigo-950">Informacioni i kërkesës</Text>
            </View>

            <Text className="text-[11px] text-gray-500 font-pregular mb-2">
                Bazuar në të dhënat e kësaj kërkese për udhëtim (sipas skemës së aplikacionit).
            </Text>

            <InfoRow label="Nga" value={ride.fromAddress} />
            <InfoRow label="Deri në" value={ride.toAddress} />
            <InfoRow label="Distanca (vlerësim)" value={distanceLabel} />
            <InfoRow label="Çmimi i shfaqur" value={formatRidePriceLabel(ride)} />
            <InfoRow
                label={
                    hasPassengerFixedPrice(ride)
                        ? 'Çmim i përcaktuar nga pasagjeri'
                        : 'Çmimi sipas distancës'
                }
                value={tariffNote}
            />
            <InfoRow label="Statusi i kërkesës" value={rideRequestStatusLabel(ride.status)} />
            <InfoRow label="Urgjente" value={ride.isUrgent ? 'Po' : 'Jo'} />
            <InfoRow label="Krijuar më" value={formattedCreated} />
            <InfoRow label="Përditësuar më" value={formattedUpdated} last />
        </View>
    );
});

export default RideRequestInfoSection;
