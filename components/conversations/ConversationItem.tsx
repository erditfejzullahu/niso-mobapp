import React, { memo, useEffect, useMemo, useState } from 'react';
import type { Conversations, Message, User } from '@/types/app-types';
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
    const [conversationModal, setConversationModal] = useState(false);
    const [draftMessage, setDraftMessage] = useState('');
    const participant = useMemo(() => getConversationParticipantDisplay(user, item), [user, item]);

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
    } = useConversationModalThread(item, user, conversationModal);

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
                item={item}
                participant={participant}
                onDelete={onDelete}
                onOpen={handleConversationClickAction}
            />

            {sheetSection && (
                <ConversationSheetModal
                    visible={conversationModal}
                    onClose={() => setConversationModal(false)}
                    user={user}
                    item={item}
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
                    onDraftChange={setDraftMessage}
                    onSend={handleSend}
                    onPressMessage={() => {}}
                />
            )}
        </>
    );
}

export default memo(ConversationItem);
