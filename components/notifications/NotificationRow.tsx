import React, { memo, useMemo } from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CarTaxiFront, DollarSign, MessageCircleMore, Settings, Trash2, Trophy } from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';
import type { Notification } from '@/types/app-types';

dayjs.extend(relativeTime);
dayjs.locale('sq');

type Props = {
    item: Notification;
    senderImageUri: string | null;
    onPress: () => void;
    onDelete: () => void;
};

function NotificationRow({ item, senderImageUri, onPress, onDelete }: Props) {
    const renderRightActions = useMemo(() => {
        return (
            <TouchableOpacity
                onPress={onDelete}
                className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
            >
                <Trash2 color="#fff" size={20} />
                <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
            </TouchableOpacity>
        );
    }, [onDelete]);

    return (
        <Swipeable renderRightActions={() => renderRightActions} containerStyle={{ width: '100%', overflow: 'visible' }}>
            <TouchableOpacity
                onPress={onPress}
                key={item.id}
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
            </TouchableOpacity>
        </Swipeable>
    );
}

export default memo(NotificationRow);

