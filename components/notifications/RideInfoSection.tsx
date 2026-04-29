import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle, Car, DollarSign, MapPin } from 'lucide-react-native';
import type { Notification, NotificationConnectedRide, NotificationRideRequest } from '@/types/app-types';
import LoadingState from '@/components/system/LoadingState';
import { getStatusIcon, getStatusText } from '@/utils/notifications/notificationStatus';

type Props = {
    item: Notification;
    connectedRideId?: string | null;
    rideRequestId?: string | null;

    connectedRide: {
        data?: NotificationConnectedRide;
        isLoading: boolean;
        isRefetching: boolean;
        error: unknown;
        refetch: () => void;
    };
    rideRequest: {
        data?: NotificationRideRequest;
        isLoading: boolean;
        isRefetching: boolean;
        error: unknown;
        refetch: () => void;
    };
};

function RideInfoSection({ item, connectedRideId, rideRequestId, connectedRide, rideRequest }: Props) {
    const isRideUpdate = item.type === 'RIDE_UPDATE';
    const isLoading = useMemo(() => {
        if (!isRideUpdate) return false;
        if (rideRequestId && (rideRequest.isLoading || rideRequest.isRefetching)) return true;
        if (connectedRideId && (connectedRide.isLoading || connectedRide.isRefetching)) return true;
        return false;
    }, [
        connectedRide.isLoading,
        connectedRide.isRefetching,
        connectedRideId,
        isRideUpdate,
        rideRequest.isLoading,
        rideRequest.isRefetching,
        rideRequestId,
    ]);

    if (!isRideUpdate) return null;
    if (isLoading) return <LoadingState contStyle="!bg-white !mt-12" />;

    if (connectedRideId && !connectedRide.isLoading && connectedRide.error) {
        return (
            <View className="gap-2 bg-white shadow-lg shadow-black/10 rounded-2xl p-3 mb-3">
                <Text className="text-indigo-950 font-pmedium text-sm text-center">
                    Dicka shkoi gabim ne ngarkimin e te dhenave te udhetimit(Udhetim i lidhur).
                </Text>
                <TouchableOpacity onPress={connectedRide.refetch} className="bg-red-600 rounded-md py-3">
                    <Text className="text-white font-pmedium text-center">Provo perseri</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (rideRequestId && !rideRequest.isLoading && rideRequest.error) {
        return (
            <View className="gap-2 bg-white shadow-lg shadow-black/10 rounded-2xl p-3 mb-3">
                <Text className="text-indigo-950 font-pmedium text-sm text-center">
                    Dicka shkoi gabim ne ngarkimin e te dhenave te udhetimit(Kerkesa e udhetimit).
                </Text>
                <TouchableOpacity onPress={rideRequest.refetch} className="bg-red-600 rounded-md py-3">
                    <Text className="text-white font-pmedium text-center">Provo perseri</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (connectedRide.data) {
        const d = connectedRide.data;
        return (
            <View className="p-3 shadow-lg shadow-black/10 bg-white border border-gray-200 rounded-lg mb-4">
                <Text className="font-psemibold text-indigo-900 text-base mb-2">Informacione për udhëtimin</Text>

                <View className="flex-row items-center self-start mx-auto mb-2 bg-indigo-50 justify-center p-2 rounded-md">
                    {getStatusIcon(d.status)}
                    <Text className="ml-2 font-pregular text-gray-800 text-sm">
                        Statusi: <Text className="text-indigo-900 font-pbold">{getStatusText(d.status)}</Text>
                    </Text>
                </View>

                <View className="flex-row items-start mb-2">
                    <MapPin size={14} color="#4338ca" className="mt-1" />
                    <Text className="ml-2 text-gray-600 flex-1 font-pregular text-sm">Nga: {d.rideRequest.fromAddress}</Text>
                </View>

                <View className="flex-row items-start mb-2">
                    <MapPin size={14} color="#4338ca" className="mt-1" />
                    <Text className="ml-2 text-gray-600 flex-1 font-pregular text-sm">Deri: {d.rideRequest.toAddress}</Text>
                </View>

                <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                        <DollarSign size={14} color="#4338ca" />
                        <Text className="ml-2 text-gray-600 font-pregular text-sm">Çmimi:</Text>
                        <Text className="ml-1 font-pbold text-sm text-indigo-900 ">{d.rideRequest.price} €</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Car size={14} color="#4338ca" />
                        <Text className="ml-1 text-gray-600 font-pregular text-sm">Distanca:</Text>
                        <Text className="ml-1 font-pbold text-indigo-900 text-sm">{d.rideRequest.distanceKm} km</Text>
                    </View>
                </View>

                {d.rideRequest.isUrgent && (
                    <View className="mt-2 flex-row items-center bg-yellow-50 p-2 rounded-md">
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text className="ml-2 text-yellow-800 text-sm font-pregular ">Udhëtim urgent</Text>
                    </View>
                )}

                {d.status === 'CANCELLED_BY_DRIVER' && (
                    <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded-md">
                        <AlertCircle size={14} color="#ef4444" />
                        <Text className="ml-2 text-red-800 text-sm font-pregular">
                            Shoferi ka anuluar kërkesën tuaj për udhëtim
                        </Text>
                    </View>
                )}

                {d.status === 'CANCELLED_BY_PASSENGER' && (
                    <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded-md">
                        <AlertCircle size={14} color="#ef4444" />
                        <Text className="ml-2 text-red-800 text-sm font-pregular">Pasagjeri ka anuluar udhëtimin</Text>
                    </View>
                )}
            </View>
        );
    }

    if (rideRequest.data) {
        const d = rideRequest.data;
        return (
            <View className="p-3 shadow-lg shadow-black/10 bg-white border border-gray-200 rounded-lg mb-4">
                <Text className="font-psemibold text-indigo-900 text-base mb-2">
                    Informacione për kërkesën e udhëtimit
                </Text>

                <View className="flex-row items-center self-start mx-auto mb-2 bg-indigo-50 justify-center p-2 rounded-md">
                    {getStatusIcon(d.status)}
                    <Text className="ml-2 font-pmedium text-sm text-gray-800">
                        Statusi: <Text className="text-indigo-900 font-pbold">{getStatusText(d.status)}</Text>
                    </Text>
                </View>

                <View className="flex-row items-start mb-2">
                    <MapPin size={14} color="#4338ca" className="mt-1" />
                    <Text className="ml-2 text-gray-600 text-sm flex-1 font-pregular">Nga: {d.fromAddress}</Text>
                </View>

                <View className="flex-row items-start mb-2">
                    <MapPin size={14} color="#4338ca" className="mt-1" />
                    <Text className="ml-2 text-gray-600 text-sm flex-1 font-pregular">Deri: {d.toAddress}</Text>
                </View>

                <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                        <DollarSign size={14} color="#4338ca" />
                        <Text className="ml-1 text-gray-600 font-pregular">Çmimi:</Text>
                        <Text className="ml-1 font-pbold text-sm text-indigo-900">{d.price} €</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Car size={14} color="#4338ca" />
                        <Text className="ml-1 text-gray-600 font-pregular">Distanca:</Text>
                        <Text className="ml-1 font-pbold text-sm text-indigo-900">{d.distanceKm} km</Text>
                    </View>
                </View>

                {d.isUrgent && (
                    <View className="mt-2 flex-row items-center bg-yellow-50 p-2 rounded-md">
                        <AlertCircle size={14} color="#f59e0b" />
                        <Text className="ml-2 text-yellow-800 text-sm font-pregular">Udhëtim urgent</Text>
                    </View>
                )}

                {d.status === 'CANCELLED' && (
                    <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded-md">
                        <AlertCircle size={14} color="#ef4444" />
                        <Text className="ml-2 text-red-800 text-sm font-pregular">Kërkesa për udhëtim është anuluar</Text>
                    </View>
                )}
            </View>
        );
    }

    return null;
}

export default memo(RideInfoSection);

