import React, { memo, useEffect, useMemo, useState } from 'react';
import type { Conversations, User } from '@/types/app-types';
import ConversationRowPreview from '@/components/conversations/ConversationRow';
import ConversationSheetModal from '@/components/conversations/ConversationSheetModal';
import { useConversationModalThread } from '@/hooks/conversations/useConversationModalThread';
import { getConversationParticipantDisplay } from '@/utils/conversations/participantDisplay';

type Props = {
    user: User;
    item: Conversations;
    onDelete: (id: string) => void;
    sheetSection?: boolean;
};

/** Single conversation preview row (+ optional composer modal). */
function ConversationItem({ user, item, onDelete, sheetSection = false }: Props) {
    const [currentItem, setCurrentItem] = useState(item);
    const [conversationModal, setConversationModal] = useState(false);
    const [draftMessage, setDraftMessage] = useState('');
    const participant = useMemo(() => getConversationParticipantDisplay(user, currentItem), [user, currentItem]);

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
    } = useConversationModalThread(currentItem, user, conversationModal);

    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    useEffect(() => {
        if (!conversationModal) setDraftMessage('');
    }, [conversationModal]);

    const handleSend = () => {
        if (sendOtherMessage(draftMessage)) setDraftMessage('');
    };

    const handleConversationClickAction = () => {
        if (sheetSection) setConversationModal(true);
    };

    return (
        <>
            <ConversationRowPreview
                user={user}
                item={currentItem}
                participant={participant}
                onDelete={onDelete}
                onOpen={handleConversationClickAction}
            />

            {sheetSection && (
                <ConversationSheetModal
                    visible={conversationModal}
                    onClose={() => setConversationModal(false)}
                    user={user}
                    item={currentItem}
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
                    isResolved={currentItem.isResolved}
                    onDraftChange={setDraftMessage}
                    onSend={handleSend}
                    onConversationReopened={() => setCurrentItem((prev) => ({ ...prev, isResolved: false }))}
                    onPressMessage={() => {}}
                />
            )}
        </>
    );
}

export default memo(ConversationItem);
