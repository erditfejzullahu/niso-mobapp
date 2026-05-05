import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { Conversations, User } from '@/types/app-types';
import { useConversationById } from '@/hooks/conversations/useConversationById';
import { useConversationModalThread } from '@/hooks/conversations/useConversationModalThread';
import { getConversationParticipantDisplay } from '@/utils/conversations/participantDisplay';
import ConversationSheetModal from '@/components/conversations/ConversationSheetModal';
import Toast from '@/utils/appToast';

type Props = {
    visible: boolean;
    onClose: () => void;
    user: User;
    conversationId: string;
    /**
     * Pre-fetch the conversation while a parent flow is preparing to open the sheet
     * (e.g. while the notification details modal is still showing). The query is
     * triggered when `prefetch || visible` is true so the data is ready by the time
     * the sheet actually mounts — avoiding a stacked-Modal "loading" overlay that
     * tends to lock screens on iOS/Android.
     */
    prefetch?: boolean;
};

/**
 * Adapter that opens a conversation thread directly from a notification:
 *  - resolves the conversation by id (lazy or pre-fetched),
 *  - then mounts the standard `ConversationSheetModal` only after the data is ready,
 *    so we never have two `Modal`s stacked.
 */
function NotificationConversationSheet({ visible, onClose, user, conversationId, prefetch = false }: Props) {
    const conversationQuery = useConversationById(conversationId, visible || prefetch);

    const [currentConversation, setCurrentConversation] = useState<Conversations | null>(null);
    const [draftMessage, setDraftMessage] = useState('');
    const errorToastShownRef = useRef(false);

    useEffect(() => {
        if (conversationQuery.data) setCurrentConversation(conversationQuery.data);
    }, [conversationQuery.data]);

    useEffect(() => {
        if (!visible) setDraftMessage('');
    }, [visible]);

    /** If the user requested the sheet but it failed to load, surface a toast and dismiss. */
    useEffect(() => {
        if (!visible) {
            errorToastShownRef.current = false;
            return;
        }
        if (conversationQuery.isError && !currentConversation && !errorToastShownRef.current) {
            errorToastShownRef.current = true;
            Toast.show({
                type: 'error',
                text1: 'Biseda nuk u hap',
                text2: 'Provoni përsëri pas një momenti.',
            });
            onClose();
        }
    }, [conversationQuery.isError, currentConversation, onClose, visible]);

    const participant = useMemo(
        () => (currentConversation ? getConversationParticipantDisplay(user, currentConversation) : null),
        [currentConversation, user],
    );

    /**
     * Keep hooks stable: always call `useConversationModalThread`, but only enable its
     * internal queries/socket bindings when the sheet is actually visible AND we have
     * a real conversation loaded.
     */
    const threadEnabled = visible && Boolean(currentConversation);
    const {
        messages,
        isLoading,
        error,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        nearTopLoadThresholdPx,
        sendOtherMessage,
    } = useConversationModalThread(
        currentConversation ?? ({ id: conversationId, messages: [] } as unknown as Conversations),
        user,
        threadEnabled,
    );

    const handleSend = () => {
        if (!currentConversation) return;
        if (sendOtherMessage(draftMessage)) setDraftMessage('');
    };

    /** Avoid mounting any Modal while we're still loading — the parent flow shows a spinner. */
    if (!visible || !currentConversation || !participant) return null;

    return (
        <ConversationSheetModal
            visible={visible}
            onClose={onClose}
            user={user}
            item={currentConversation}
            participant={participant}
            messages={messages}
            isLoading={isLoading}
            isRefetching={isRefetching}
            error={error}
            refetchMessages={refetch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            nearTopLoadThresholdPx={nearTopLoadThresholdPx}
            draftMessage={draftMessage}
            isResolved={currentConversation.isResolved}
            onDraftChange={setDraftMessage}
            onSend={handleSend}
            onConversationReopened={() =>
                setCurrentConversation((prev) => (prev ? { ...prev, isResolved: false } : prev))
            }
            onPressMessage={() => {}}
        />
    );
}

export default memo(NotificationConversationSheet);
