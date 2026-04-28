import type { Conversations, User } from '@/types/app-types';

export type ConversationParticipantDisplay = {
    image: string;
    fullName: string;
    id: string;
};

/**
 * Resolves avatar, name, and id for the non-current user in a conversation row.
 */
export function getConversationParticipantDisplay(
    user: User,
    item: Conversations
): ConversationParticipantDisplay {
    if (user.role === 'DRIVER') {
        return {
            image: item.passenger?.image || item.support?.image || '',
            fullName: item.passenger?.fullName || item.support?.fullName || '',
            id: item.passenger?.id || item.support?.id || '',
        };
    }
    if (user.role === 'PASSENGER') {
        return {
            image: item.driver?.image || item.support?.image || '',
            fullName: item.driver?.fullName || item.support?.fullName || '',
            id: item.driver?.id || item.support?.id || '',
        };
    }
    return {
        image: item.driver?.image || item.passenger?.image || '',
        fullName: item.driver?.fullName || item.passenger?.fullName || '',
        id: item.driver?.id || item.passenger?.id || '',
    };
}
