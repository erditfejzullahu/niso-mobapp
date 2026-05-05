import { useCallback, useState } from 'react';
import api from '@/hooks/useApi';
import { useSocketStore } from '@/store/useSocketStore';
import { CLIENT_SOCKET_EVENTS } from '@/types/socket-events';
import { Role, type Conversations, type Message, type User } from '@/types/app-types';
import Toast from '@/utils/appToast';

export function usePriceOfferActions(
    conversation: Conversations,
    user: User,
    refetchMessages: () => void
) {
    const [isActioning, setIsActioning] = useState(false);
    const [counterModalOpen, setCounterModalOpen] = useState(false);

    const acceptOffer = useCallback(
        async (message: Message) => {
            setIsActioning(true);
            try {
                const isPassenger = user.role === Role.PASSENGER;
                const endpoint = isPassenger
                    ? '/rides/connect-riderequest-passenger'
                    : '/rides/connect-riderequest-driver';
                await api.post(endpoint, {
                    passengerId: isPassenger ? user.id : conversation.passengerId,
                    driverId: isPassenger ? conversation.driverId : user.id,
                    messageId: message.id,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Sukses!',
                    text2: 'Oferta u pranua. Udhëtimi u konfirmua.',
                });
                refetchMessages();
            } catch (error: any) {
                const msg =
                    typeof error?.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Nuk u pranua oferta. Provoni përsëri.';
                Toast.show({ type: 'error', text1: 'Gabim!', text2: msg });
            } finally {
                setIsActioning(false);
            }
        },
        [user, conversation, refetchMessages]
    );

    /** Decline by sending a plain text message — makes the offer non-actionable server-side. */
    const declineOffer = useCallback(() => {
        const ok = useSocketStore.getState().emit(CLIENT_SOCKET_EVENTS.sendOtherMessage, {
            passengerId: conversation.passengerId,
            driverId: conversation.driverId,
            conversationId: conversation.id,
            content: 'Oferta u refuzua.',
            mediaUrls: [],
        });
        if (!ok) {
            Toast.show({
                type: 'error',
                text1: 'Jo e lidhur',
                text2: 'Provoni përsëri pas një momenti.',
            });
        }
    }, [conversation]);

    const sendCounterOffer = useCallback(
        async (priceEuro: string, content?: string) => {
            if (!conversation.rideRequestId) {
                Toast.show({
                    type: 'error',
                    text1: 'Gabim!',
                    text2: 'Nuk gjendet kërkesa e udhëtimit.',
                });
                return;
            }
            setIsActioning(true);
            try {
                if (user.role === Role.DRIVER) {
                    await api.post(`/rides/send-counter-offer-driver/${conversation.rideRequestId}`, {
                        priceOffer: priceEuro.replace(',', '.'),
                        content: content ?? undefined,
                    });
                } else {
                    await api.post('/rides/send-negotiate-price-passenger', {
                        passengerId: user.id,
                        driverId: conversation.driverId,
                        conversationId: conversation.id,
                        priceOffer: priceEuro.replace(',', '.'),
                        content: content ?? undefined,
                    });
                }
                setCounterModalOpen(false);
                Toast.show({
                    type: 'success',
                    text1: 'Sukses!',
                    text2: 'Kontraoferta u dërgua.',
                });
                refetchMessages();
            } catch (error: any) {
                const msg =
                    typeof error?.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Nuk u dërgua kontraoferta. Provoni përsëri.';
                Toast.show({ type: 'error', text1: 'Gabim!', text2: msg });
            } finally {
                setIsActioning(false);
            }
        },
        [user, conversation, refetchMessages]
    );

    return {
        isActioning,
        counterModalOpen,
        openCounterModal: () => setCounterModalOpen(true),
        closeCounterModal: () => setCounterModalOpen(false),
        acceptOffer,
        declineOffer,
        sendCounterOffer,
    };
}
