import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Animated, { BounceInDown, BounceInRight, BounceInUp } from 'react-native-reanimated';
import { Check, CheckCheck, Clock, Send, X } from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';
import type { Conversations, Message, User } from '@/types/app-types';
import type { ConversationParticipantDisplay } from '@/utils/conversations/participantDisplay';
import EmptyState from '@/components/system/EmptyState';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import { badgeClassForConversationType, conversationTypeLabel } from '@/utils/conversations/conversationLabels';

dayjs.extend(relativeTime);
dayjs.locale('sq');

type Props = {
    visible: boolean;
    onClose: () => void;
    user: User;
    item: Conversations;
    participant: ConversationParticipantDisplay;
    messages: Message[] | undefined;
    isLoading: boolean;
    isRefetching: boolean;
    error?: unknown;
    refetchMessages: () => void;
    draftMessage: string;
    onDraftChange: (t: string) => void;
    onSend: () => void;
    onPressMessage?: (msg: Message) => void;
};

export default function ConversationSheetModal({
    visible,
    onClose,
    user,
    item,
    participant,
    messages,
    isLoading,
    isRefetching,
    error,
    refetchMessages,
    draftMessage,
    onDraftChange,
    onSend,
    onPressMessage,
}: Props) {
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
            <View className="flex-1 bg-black/30 justify-center">
                <Animated.View entering={BounceInRight.duration(800)}>
                    <TouchableOpacity onPress={onClose} className="ml-auto mr-4 mb-2 z-50">
                        <Image source={{ uri: participant.image }} className="w-20 h-20 rounded-full" />
                    </TouchableOpacity>
                </Animated.View>

                <KeyboardAvoidingView
                    className="bg-white rounded-2xl mx-3 h-[70%] shadow-lg shadow-black/30 overflow-hidden"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <Animated.View entering={BounceInUp.duration(800)} className="flex-row items-center gap-2">
                                <Image source={{ uri: participant.image }} className="w-14 h-14 rounded-full" />
                                <View>
                                    <Text className="font-psemibold text-lg text-indigo-950">{participant.fullName}</Text>
                                    <Text
                                        className={`text-xs font-pregular px-2 py-0.5 rounded-lg ${badgeClassForConversationType(item.type)} text-white`}
                                    >
                                        {conversationTypeLabel(item.type)}
                                    </Text>
                                </View>
                            </Animated.View>
                            <TouchableOpacity onPress={onClose}>
                                <X color="#4f46e5" />
                            </TouchableOpacity>
                        </View>

                        {isLoading || isRefetching ? (
                            <LoadingState />
                        ) : !isLoading && !isRefetching && error ? (
                            <ErrorState onRetry={refetchMessages} />
                        ) : (
                            <FlatList
                                data={messages}
                                keyExtractor={(msg) => msg.id}
                                contentContainerStyle={{ padding: 12 }}
                                renderItem={({ item: msg }) => {
                                    const isMine = msg.senderId === user.id;
                                    const isMessageRead = msg.isRead && msg.isRead === true;
                                    const isMessageNotSent = msg.isRead === null;
                                    return (
                                        <TouchableOpacity
                                            onPress={() => onPressMessage?.(msg)}
                                            className={`mb-3 max-w-[75%] ${isMine ? 'self-end' : 'self-start'}`}
                                        >
                                            <View
                                                className={`rounded-2xl px-3 py-2 shadow-sm ${isMine ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                            >
                                                <Text
                                                    className={`text-sm font-pregular ${isMine ? 'text-white' : 'text-indigo-950'}`}
                                                >
                                                    {msg.content}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center justify-between">
                                                <Text className="text-[10px] text-gray-400 mt-0.5">
                                                    {dayjs(msg.createdAt).fromNow()}
                                                </Text>
                                                <View>
                                                    {isMine && !isMessageRead && (
                                                        <Check size={16} color={'#4f46e5'} />
                                                    )}
                                                    {isMine && isMessageRead && (
                                                        <CheckCheck size={16} color={'#4f46e5'} />
                                                    )}
                                                    {isMine && isMessageNotSent && (
                                                        <Clock size={12} color={'#4f46e5'} />
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                ListEmptyComponent={() => (
                                    <EmptyState
                                        containerStyle="!bg-white"
                                        message="Nuk ka bisede ende. Filloni duke derguar nje mesazh nga kutia e meposhtme. Nese mendoni qe eshte gabim ju lutem provoni perseri."
                                        onRetry={refetchMessages}
                                        textStyle="!font-pregular !text-sm"
                                    />
                                )}
                            />
                        )}

                        <Animated.View
                            entering={BounceInDown.duration(800)}
                            className="flex-row items-center border-t border-gray-200 p-3 bg-white"
                        >
                            <TextInput
                                placeholder="Shkruaj një mesazh..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm font-pregular"
                                multiline
                                value={draftMessage}
                                onChangeText={onDraftChange}
                            />
                            <TouchableOpacity className="ml-2 bg-indigo-600 rounded-full p-2" onPress={onSend}>
                                <Send size={18} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
