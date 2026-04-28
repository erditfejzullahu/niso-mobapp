import type { Conversations, User } from '@/types/app-types';
import { useConversationCaches } from './useConversationCaches';
import { useConversationMessagesQuery } from './useConversationMessagesQuery';
import { useConversationSocketSync } from './useConversationSocketSync';
import { useSendOtherConversationMessage } from './useSendOtherConversationMessage';

/**
 * Data + socket + send pipeline for an open conversation sheet/modal.
 */
export function useConversationModalThread(conversation: Conversations, user: User, modalOpen: boolean) {
    const caches = useConversationCaches(conversation.id);
    useConversationSocketSync({
        conversationId: conversation.id,
        currentUserId: user.id,
        modalOpen,
        caches,
    });

    const query = useConversationMessagesQuery(conversation.id, modalOpen);
    const sendOtherMessage = useSendOtherConversationMessage(conversation, user, caches);

    return {
        ...query,
        sendOtherMessage,
    };
}
