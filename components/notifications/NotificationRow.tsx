import React, { memo, useCallback, useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { CarTaxiFront, DollarSign, MessageCircleMore, Settings, Trophy } from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';
import type { Notification } from '@/types/app-types';
import ConfirmActionModal from '@/components/ui/ConfirmActionModal';

dayjs.extend(relativeTime);
dayjs.locale('sq');

type Props = {
    item: Notification;
    senderImageUri: string | null;
    onPress: () => void;
    onDelete: () => void;
};

function NotificationRow({ item, senderImageUri, onPress, onDelete }: Props) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const opacity = useRef(new Animated.Value(1)).current;
    const longPressTriggered = useRef(false);

    const animateOpacity = useCallback(
        (toValue: number) => {
            Animated.timing(opacity, {
                toValue,
                duration: 120,
                useNativeDriver: true,
            }).start();
        },
        [opacity],
    );

    const handlePressIn = useCallback(() => {
        animateOpacity(0.6);
    }, [animateOpacity]);

    const handlePressOut = useCallback(() => {
        animateOpacity(1);
    }, [animateOpacity]);

    const handleLongPress = useCallback(() => {
        longPressTriggered.current = true;
        setDeleteModalOpen(true);
    }, []);

    const handlePress = useCallback(() => {
        if (longPressTriggered.current) {
            longPressTriggered.current = false;
            return;
        }
        onPress();
    }, [onPress]);

    const handleCancelDelete = useCallback(() => {
        setDeleteModalOpen(false);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        setDeleteModalOpen(false);
        onDelete();
    }, [onDelete]);

    return (
        <>
            <ConfirmActionModal
                visible={deleteModalOpen}
                title="Fshij njoftimin?"
                message="Ky veprim nuk mund të kthehet mbrapsht."
                cancelText="Anulo"
                confirmText="Fshij"
                confirmVariant="destructive"
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />

            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                onLongPress={handleLongPress}
                delayLongPress={350}
            >
                <Animated.View
                    key={item.id}
                    style={{ opacity }}
                    className={`w-[95%] mx-auto flex-row items-center gap-2 ${
                        item.read ? 'bg-white' : 'bg-indigo-100'
                    } shadow-lg shadow-black/10 rounded-lg p-3 relative`}
                >
                    <View className="absolute left-2 shadow-lg shadow-black/20 bg-gray-50 rounded-md p-0.5 top-2 z-50">
                        {item.type === 'SYSTEM_ALERT' && <Settings color="#4338ca" size={16} />}
                        {item.type === 'MESSAGE' && <MessageCircleMore color="#4338ca" size={16} />}
                        {item.type === 'RIDE_UPDATE' && <CarTaxiFront color="#4338ca" size={16} />}
                        {item.type === 'PAYMENT' && <DollarSign color="#4338ca" size={16} />}
                        {item.type === 'PROMOTIONAL' && <Trophy color="#4338ca" size={16} />}
                    </View>

                    <Image source={{ uri: senderImageUri ?? undefined }} className="w-14 h-14 rounded-full" />

                    <View className="pb-[14px] flex-1">
                        <Text className={`font-pmedium ${item.read ? 'text-indigo-900' : 'text-indigo-950'} text-base`}>
                            {item.title}
                        </Text>
                        <Text
                            numberOfLines={2}
                            className={`font-plight ${item.read ? 'text-indigo-800' : 'text-indigo-900'} text-xs`}
                        >
                            {item.message}
                        </Text>
                    </View>

                    <Text className="absolute bottom-1 right-1 text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20 border-gray-200">
                        {dayjs(item.createdAt ?? new Date()).fromNow()}
                    </Text>
                </Animated.View>
            </Pressable>
        </>
    );
}

export default memo(NotificationRow);

