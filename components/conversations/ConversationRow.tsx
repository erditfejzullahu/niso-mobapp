import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { CarTaxiFront, Check, CheckCheck, Settings, Trash2 } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';

dayjs.extend(relativeTime);
dayjs.locale('sq');
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ConversationType, type Conversations, type User } from '@/types/app-types';
import { badgeClassForConversationType, conversationTypeLabel } from '@/utils/conversations/conversationLabels';
import type { ConversationParticipantDisplay } from '@/utils/conversations/participantDisplay';

type Props = {
    user: User;
    item: Conversations;
    participant: ConversationParticipantDisplay;
    onDelete: (id: string) => void;
    onOpen: () => void;
};

const ConversationRowPreview = ({ user, item, participant, onDelete, onOpen }: Props) => {
    const renderRightActions = () => (
        <View>
            <TouchableOpacity
                onPress={() => onDelete(item.id)}
                className="bg-red-600 w-20 justify-center items-center rounded-lg mr-3"
            >
                <Trash2 color="#fff" size={20} />
                <Text className="text-white text-xs font-pmedium mt-1">Fshij</Text>
            </TouchableOpacity>
        </View>
    );

    const youMessagedLast = user.id === item.messages[0]?.senderId;
    const isRead = item.messages[0]?.isRead;

    return (
        <ReanimatedSwipeable
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={renderRightActions}
            containerStyle={{ width: '100%', overflow: 'visible' }}
        >
            <TouchableOpacity
                onPress={onOpen}
                className={`w-[95%] mx-auto flex-row items-center gap-2 ${
                    !isRead && youMessagedLast
                        ? 'bg-white'
                        : !isRead && !youMessagedLast
                          ? 'bg-indigo-100'
                          : 'bg-white'
                } shadow-lg shadow-black/10 rounded-lg p-3 relative`}
            >
                <View className="absolute left-2 shadow-lg shadow-black/20 bg-gray-50 rounded-md p-0.5 top-2 z-50">
                    {item.type === ConversationType.RIDE_RELATED && (
                        <CarTaxiFront color={'#4338ca'} size={16} />
                    )}
                    {item.type === ConversationType.SUPPORT && (
                        <MaterialIcons name="support-agent" color={'#4338ca'} size={16} />
                    )}
                    {item.type === ConversationType.OTHER && <Settings color={'#4338ca'} size={16} />}
                </View>

                <View className="absolute right-2 top-2 z-50">
                    {youMessagedLast && !isRead && <Check size={16} color={'#dc2626'} />}
                    {youMessagedLast && isRead && <CheckCheck size={16} color={'#dc2626'} />}
                </View>

                <Image source={{ uri: participant.image }} className="w-14 h-14 rounded-full" />

                <View className="pb-[14px] flex-1">
                    <Text
                        className={`font-pmedium ${!isRead && youMessagedLast ? 'text-indigo-900' : !isRead && !youMessagedLast ? 'text-indigo-950' : 'text-indigo-900'} text-base`}
                    >
                        {participant.fullName}
                    </Text>
                    <Text
                        numberOfLines={2}
                        className={`font-plight ${!isRead && youMessagedLast ? 'text-indigo-800' : !isRead && !youMessagedLast ? 'text-indigo-900' : 'text-indigo-800'} text-xs`}
                    >
                        {item.messages[0]?.content}
                    </Text>
                </View>

                <View className="absolute right-1 bottom-1 flex-row items-center gap-2">
                    <Text
                        className={`text-xs font-pregular px-2 py-0.5 rounded-md shadow-sm shadow-black/20 ${badgeClassForConversationType(item.type)} text-white`}
                    >
                        {conversationTypeLabel(item.type)}
                    </Text>
                    <Text className="text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20">
                        {dayjs(item.lastMessageAt ?? new Date()).fromNow()}
                    </Text>
                </View>
            </TouchableOpacity>
        </ReanimatedSwipeable>
    );
};

export default memo(ConversationRowPreview);
