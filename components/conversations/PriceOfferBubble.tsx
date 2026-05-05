import { Check, CheckCheck, Clock, Tag } from 'lucide-react-native';
import React, { memo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import type { Message } from '@/types/app-types';

type Props = {
    message: Message;
    isMine: boolean;
    /** True only when this is the absolute last message in the thread. */
    isLastMessage: boolean;
    isActioning: boolean;
    onAccept: () => void;
    onDecline: () => void;
    onCounterOffer: () => void;
};

function formatPrice(raw: string | null | undefined): string {
    if (!raw) return '—';
    const n = parseFloat(raw);
    return isNaN(n) ? raw : `${n.toFixed(2)} €`;
}

const PriceOfferBubble = memo(function PriceOfferBubble({
    message,
    isMine,
    isLastMessage,
    isActioning,
    onAccept,
    onDecline,
    onCounterOffer,
}: Props) {
    const isMessageRead = message.isRead === true;
    const isMessageNotSent = message.isRead === null;
    const canInteract = !isMine && isLastMessage;

    if (isMine) {
        return (
            <View className="mb-3 max-w-[80%] self-end">
                <View className="rounded-2xl overflow-hidden shadow-sm border border-indigo-200">
                    {/* Header strip */}
                    <View className="bg-indigo-600 px-3 py-2 flex-row items-center gap-2">
                        <Tag size={14} color="#e0e7ff" />
                        <Text className="text-indigo-100 text-[11px] font-pmedium tracking-wide uppercase">
                            Oferta juaj e çmimit
                        </Text>
                    </View>
                    {/* Price row */}
                    <View className="bg-indigo-50 px-4 py-3">
                        <Text className="text-[28px] font-pbold text-indigo-700 leading-tight">
                            {formatPrice(message.priceOffer)}
                        </Text>
                        {!!message.content && (
                            <Text className="text-xs font-pregular text-indigo-500 mt-1">
                                {message.content}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center justify-end gap-1 mt-0.5">
                    <Text className="text-[10px] text-gray-400">
                        {dayjs(message.createdAt).fromNow()}
                    </Text>
                    {!isMessageRead && !isMessageNotSent && (
                        <Check size={14} color="#4f46e5" />
                    )}
                    {isMessageRead && <CheckCheck size={14} color="#4f46e5" />}
                    {isMessageNotSent && <Clock size={12} color="#4f46e5" />}
                </View>
            </View>
        );
    }

    // Received offer
    return (
        <View className="mb-3 max-w-[82%] self-start">
            <View className={`rounded-2xl overflow-hidden shadow-sm border ${canInteract ? 'border-emerald-200' : 'border-gray-200'}`}>
                {/* Header strip */}
                <View className={`px-3 py-2 flex-row items-center gap-2 ${canInteract ? 'bg-emerald-600' : 'bg-gray-400'}`}>
                    <Tag size={14} color="#fff" />
                    <Text className="text-white text-[11px] font-pmedium tracking-wide uppercase">
                        {canInteract ? 'Ofertë e re' : 'Ofertë e vjetër'}
                    </Text>
                </View>

                {/* Price row */}
                <View className={`px-4 py-3 ${canInteract ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                    <Text className={`text-[28px] font-pbold leading-tight ${canInteract ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {formatPrice(message.priceOffer)}
                    </Text>
                    {!!message.content && (
                        <Text className={`text-xs font-pregular mt-1 ${canInteract ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {message.content}
                        </Text>
                    )}
                </View>

                {/* Action buttons — only on the latest message */}
                {canInteract && (
                    <View className="flex-row border-t border-emerald-100 bg-white">
                        {/* Decline */}
                        <TouchableOpacity
                            onPress={onDecline}
                            disabled={isActioning}
                            className="flex-1 items-center py-2.5 border-r border-gray-100"
                        >
                            <Text className="text-xs font-pmedium text-gray-500">Refuzo</Text>
                        </TouchableOpacity>

                        {/* Counter-offer */}
                        <TouchableOpacity
                            onPress={onCounterOffer}
                            disabled={isActioning}
                            className="flex-1 items-center py-2.5 border-r border-gray-100"
                        >
                            <Text className="text-xs font-pmedium text-indigo-600">Kontraofertë</Text>
                        </TouchableOpacity>

                        {/* Accept */}
                        <TouchableOpacity
                            onPress={onAccept}
                            disabled={isActioning}
                            className="flex-1 items-center py-2.5 bg-emerald-50"
                        >
                            {isActioning ? (
                                <ActivityIndicator size="small" color="#059669" />
                            ) : (
                                <Text className="text-xs font-psemibold text-emerald-700">Prano</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Text className="text-[10px] text-gray-400 mt-0.5">
                {dayjs(message.createdAt).fromNow()}
            </Text>
        </View>
    );
});

export default PriceOfferBubble;
