import { ConversationType } from '@/types/app-types';

/** Label chip for conversation kind (mirror prior inline copy). */
export function conversationTypeLabel(type: ConversationType): string {
    switch (type) {
        case ConversationType.RIDE_RELATED:
            return 'Lidhur me Udhetimin';
        case ConversationType.SUPPORT:
            return 'Mbeshtetje Online';
        default:
            return 'Bisede me qellime te ndryshme';
    }
}

export function badgeClassForConversationType(type: ConversationType): string {
    switch (type) {
        case ConversationType.RIDE_RELATED:
            return 'bg-red-600';
        case ConversationType.SUPPORT:
            return 'bg-indigo-600';
        default:
            return 'bg-cyan-600';
    }
}
