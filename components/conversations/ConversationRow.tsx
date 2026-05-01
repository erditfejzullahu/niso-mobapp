import React, { memo, useCallback, useRef, useState } from 'react';
import { Animated, Pressable, View, Text, Image } from 'react-native';
import { CarTaxiFront, Check, CheckCheck, MessageCircleOff, Settings } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';

dayjs.extend(relativeTime);
dayjs.locale('sq');
import { ConversationType, type Conversations, type User } from '@/types/app-types';
import { badgeClassForConversationType, conversationTypeLabel } from '@/utils/conversations/conversationLabels';
import type { ConversationParticipantDisplay } from '@/utils/conversations/participantDisplay';
import ConfirmActionModal from '@/components/ui/ConfirmActionModal';

type Props = {
    user: User;
    item: Conversations;
    participant: ConversationParticipantDisplay;
    onDelete: (id: string) => void;
    onOpen: () => void;
};

const ConversationRowPreview = ({ user, item, participant, onDelete, onOpen }: Props) => {
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
        [opacity]
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
        onOpen();
    }, [onOpen]);

    const handleCancelDelete = useCallback(() => {
        setDeleteModalOpen(false);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        setDeleteModalOpen(false);
        onDelete(item.id);
    }, [item.id, onDelete]);

    const youMessagedLast = user.id === item.messages[0]?.senderId;
    const isRead = item.messages[0]?.isRead === true;
    const isUnread = item.messages[0]?.isRead === false;
    
    return (
        <>
            <ConfirmActionModal
                visible={deleteModalOpen}
                title="Fshij bisedën?"
                message="Ky veprim nuk mund të kthehet mbrapsht."
                cancelText="Anulo"
                confirmText="Fshij"
                confirmVariant="destructive"
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />

            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} onLongPress={handleLongPress} delayLongPress={350}>
                <Animated.View
                    style={{ opacity }}
                    className={`w-[95%] mx-auto flex-row items-center gap-2 ${
                        item.isResolved
                            ? 'bg-slate-100 border border-slate-200'
                            : isUnread && youMessagedLast
                              ? 'bg-white'
                              : isUnread && !youMessagedLast
                                ? 'bg-indigo-100'
                                : 'bg-white'
                    } shadow-lg shadow-black/10 rounded-lg p-3 relative`}
                >
            <View className="absolute left-2 shadow-lg shadow-black/20 bg-gray-50 rounded-md p-0.5 top-2 z-50">
                {item.type === ConversationType.RIDE_RELATED && <CarTaxiFront color={'#4338ca'} size={16} />}
                {item.type === ConversationType.SUPPORT && (
                    <MaterialIcons name="support-agent" color={'#4338ca'} size={16} />
                )}
                {item.type === ConversationType.OTHER && <Settings color={'#4338ca'} size={16} />}
            </View>

            <View className="absolute right-2 top-2 z-50">
                {item.isResolved ? (
                    <View className="bg-slate-700 rounded-full p-1 shadow-sm shadow-black/20">
                        <MessageCircleOff size={14} color={'#fff'} />
                    </View>
                ) : (
                    <>
                        {youMessagedLast && isUnread && <Check size={16} color={'#dc2626'} />}
                        {youMessagedLast && isRead && <CheckCheck size={16} color={'#dc2626'} />}
                    </>
                )}
            </View>

            <Image source={{ uri: participant.image }} className="w-14 h-14 rounded-full" />

            <View className="pb-[14px] flex-1">
                <Text
                    className={`font-pmedium ${
                        isUnread && youMessagedLast
                            ? 'text-indigo-900'
                            : isUnread && !youMessagedLast
                              ? 'text-indigo-950'
                              : 'text-indigo-900'
                    } text-base`}
                >
                    {participant.fullName}
                </Text>
                <Text
                    numberOfLines={2}
                    className={`font-plight ${
                        isUnread && youMessagedLast
                            ? 'text-indigo-800'
                            : isUnread && !youMessagedLast
                              ? 'text-indigo-900'
                              : 'text-indigo-800'
                    } text-xs`}
                >
                    {item.messages[0]?.content}
                </Text>
            </View>

            <View className="absolute right-1 bottom-1 flex-row items-center gap-2">
                <Text
                    className={`text-xs font-pregular px-2 py-0.5 rounded-md shadow-sm shadow-black/20 line-clamp-1 max-w-[120px] ${badgeClassForConversationType(
                        item.type
                    )} text-white`}
                >
                    {conversationTypeLabel(item.type)}
                </Text>
                <Text className="text-indigo-950 font-pregular text-xs bg-white rounded-md px-2 py-0.5 shadow-sm shadow-black/20">
                    {dayjs(item.lastMessageAt ?? new Date()).fromNow()}
                </Text>
            </View>
                </Animated.View>
            </Pressable>
        </>
    );
};

export default memo(ConversationRowPreview);
