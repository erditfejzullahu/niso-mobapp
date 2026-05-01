import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Animated, { BounceInRight, BounceInUp } from 'react-native-reanimated';
import { Check, CheckCheck, Clock, X } from 'lucide-react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sq';
import type { Conversations, Message, User } from '@/types/app-types';
import type { ConversationParticipantDisplay } from '@/utils/conversations/participantDisplay';
import EmptyState from '@/components/system/EmptyState';
import LoadingState from '@/components/system/LoadingState';
import ErrorState from '@/components/system/ErrorState';
import ConversationComposer from '@/components/conversations/ConversationComposer';
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
    fetchNextPage: () => void | Promise<unknown>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    nearTopLoadThresholdPx: number;
    draftMessage: string;
    isResolved: boolean;
    onDraftChange: (t: string) => void;
    onSend: () => void;
    onConversationReopened: () => void;
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    nearTopLoadThresholdPx: _nearTopLoadThresholdPx,
    draftMessage,
    isResolved,
    onDraftChange,
    onSend,
    onConversationReopened,
    onPressMessage,
}: Props) {
    void _nearTopLoadThresholdPx;

    /** Newest-first for `inverted` FlatList (parent passes oldest → newest). */
    const listData = useMemo(
        () => ((messages?.length ?? 0) > 0 ? [...(messages as Message[])].reverse() : []),
        [messages]
    );

    /** Ignore spurious `onEndReached` on mount; enable after user scrolls. */
    const allowOlderPageFromEndReachedRef = useRef(false);

    useLayoutEffect(() => {
        if (!visible) {
            allowOlderPageFromEndReachedRef.current = false;
        }
    }, [visible]);

    const handleScrollBeginDrag = useCallback(() => {
        allowOlderPageFromEndReachedRef.current = true;
    }, []);

    const handleEndReached = useCallback(() => {
        if (!allowOlderPageFromEndReachedRef.current) return;
        if (!hasNextPage || isFetchingNextPage || isRefetching) return;
        void fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, isRefetching, fetchNextPage]);

    const footer = useMemo(
        () =>
            isFetchingNextPage ? (
                <ActivityIndicator style={{ paddingVertical: 8 }} color="#4f46e5" />
            ) : null,
        [isFetchingNextPage]
    );

    return (
        <>
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

                            {isLoading ? (
                                <LoadingState />
                            ) : error ? (
                                <ErrorState onRetry={refetchMessages} />
                            ) : (
                                <FlatList
                                    inverted
                                    data={listData}
                                    keyExtractor={(msg) => msg.id}
                                    contentContainerStyle={{ padding: 12, flexGrow: 1 }}
                                    onEndReached={handleEndReached}
                                    onEndReachedThreshold={0.25}
                                    onScrollBeginDrag={handleScrollBeginDrag}
                                    ListFooterComponent={footer}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefetching}
                                            onRefresh={refetchMessages}
                                            colors={['#4f46e5']}
                                            tintColor="#4f46e5"
                                            progressBackgroundColor="#ffffff"
                                        />
                                    }
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

                            <ConversationComposer
                                conversation={item}
                                draftMessage={draftMessage}
                                isResolved={isResolved}
                                onDraftChange={onDraftChange}
                                onSend={onSend}
                                onConversationReopened={onConversationReopened}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>
    );
}
