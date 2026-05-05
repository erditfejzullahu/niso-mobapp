import React, { memo } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { CarTaxiFront, DollarSign, MessageCircleMore, MessageSquare, Settings, Trophy, X } from 'lucide-react-native';
import type { Notification } from '@/types/app-types';
import RideInfoSection from '@/components/notifications/RideInfoSection';

type Props = {
    visible: boolean;
    onClose: () => void;

    item: Notification;
    senderImageUri: string | null;

    notificationContext: string;
    actionButtonText: string;

    onActionPress: () => void;

    /** Optional secondary action — usually rendered for opening a related conversation. */
    secondaryActionText?: string | null;
    onSecondaryActionPress?: () => void;

    connectedRideId?: string | null;
    rideRequestId?: string | null;
    connectedRide: React.ComponentProps<typeof RideInfoSection>['connectedRide'];
    rideRequest: React.ComponentProps<typeof RideInfoSection>['rideRequest'];
};

function NotificationDetailsModal(props: Props) {
    const {
        visible,
        onClose,
        item,
        senderImageUri,
        notificationContext,
        actionButtonText,
        onActionPress,
        secondaryActionText,
        onSecondaryActionPress,
        connectedRideId,
        rideRequestId,
        connectedRide,
        rideRequest,
    } = props;

    const showRideInfo = item.type === 'RIDE_UPDATE';

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-2xl p-5 shadow-lg shadow-black/30 max-h-[85%]">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-psemibold text-indigo-900">Detajet e njoftimit</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={22} color="#4338ca" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-3 mb-4">
                        <Image source={{ uri: senderImageUri ?? undefined }} className="w-12 h-12 rounded-full" />
                        <View className="flex-1">
                            <Text className="text-base font-pmedium text-indigo-950">{item.title}</Text>
                            <Text className="text-sm text-gray-600 font-plight">{item.message}</Text>
                        </View>
                    </View>

                    {showRideInfo && (
                        <RideInfoSection
                            item={item}
                            connectedRideId={connectedRideId}
                            rideRequestId={rideRequestId}
                            connectedRide={connectedRide}
                            rideRequest={rideRequest}
                        />
                    )}

                    <View className="p-3 shadow-lg shadow-black/10 bg-indigo-50 border border-gray-200 rounded-2xl mb-4">
                        <View className="flex-row items-center gap-1 mb-1">
                            <Text className="font-pmedium text-indigo-900 text-base">Konteksti i njoftimit</Text>
                            {item.type === 'SYSTEM_ALERT' && <Settings color="#4338ca" size={16} />}
                            {item.type === 'MESSAGE' && <MessageCircleMore color="#4338ca" size={16} />}
                            {item.type === 'RIDE_UPDATE' && <CarTaxiFront color="#4338ca" size={16} />}
                            {item.type === 'PAYMENT' && <DollarSign color="#4338ca" size={16} />}
                            {item.type === 'PROMOTIONAL' && <Trophy color="#4338ca" size={16} />}
                        </View>
                        <Text className="font-pregular text-sm text-indigo-600">{notificationContext}</Text>
                    </View>

                    <View className="flex-row justify-end gap-2 flex-wrap">
                        <TouchableOpacity onPress={onClose} className="px-4 py-2 rounded-xl bg-gray-200">
                            <Text className="text-indigo-900 font-pmedium">Mbyll</Text>
                        </TouchableOpacity>
                        {secondaryActionText && onSecondaryActionPress ? (
                            <TouchableOpacity
                                onPress={onSecondaryActionPress}
                                className="px-4 py-2 rounded-xl bg-white border border-indigo-200 flex-row items-center gap-1.5"
                                accessibilityRole="button"
                                accessibilityLabel={secondaryActionText}
                            >
                                <MessageSquare size={16} color="#4338ca" />
                                <Text className="text-indigo-700 font-pmedium">{secondaryActionText}</Text>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                            onPress={onActionPress}
                            className="px-4 py-2 rounded-xl bg-indigo-600"
                            accessibilityRole="button"
                            accessibilityLabel={actionButtonText}
                        >
                            <Text className="text-white font-pmedium">{actionButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default memo(NotificationDetailsModal);

