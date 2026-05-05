import { X } from 'lucide-react-native';
import React, { memo, useCallback, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    isActioning: boolean;
    /** The price currently on the table (from the other party's offer). */
    currentOfferLabel?: string;
    onSubmit: (priceEuro: string, content?: string) => void;
};

const ConversationCounterOfferSheet = memo(function ConversationCounterOfferSheet({
    visible,
    onClose,
    isActioning,
    currentOfferLabel,
    onSubmit,
}: Props) {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = useCallback(() => {
        const trimmed = amount.trim();
        if (!trimmed) return;
        onSubmit(trimmed, message.trim() || undefined);
    }, [amount, message, onSubmit]);

    const canSubmit = amount.trim().length > 0 && !isActioning;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/40 justify-end"
            >
                <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-base font-psemibold text-indigo-950">
                            Dërgo kontraofertë
                        </Text>
                        <TouchableOpacity onPress={onClose} disabled={isActioning}>
                            <X size={22} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {!!currentOfferLabel && (
                        <View className="bg-gray-100 rounded-xl px-4 py-3 mb-4 flex-row items-center justify-between">
                            <Text className="text-xs font-pregular text-gray-500">Oferta aktuale</Text>
                            <Text className="text-sm font-psemibold text-gray-800">{currentOfferLabel}</Text>
                        </View>
                    )}

                    <Text className="text-xs text-gray-500 mb-1 font-pregular">
                        Çmimi juaj i propozuar (€)
                    </Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        placeholder="p.sh. 12.50"
                        placeholderTextColor="#9ca3af"
                        editable={!isActioning}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-base font-pregular text-gray-900 mb-4"
                    />

                    <Text className="text-xs text-gray-500 mb-1 font-pregular">
                        Mesazh (opsional)
                    </Text>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="p.sh. Mund të nisem brenda 5 minutash."
                        placeholderTextColor="#9ca3af"
                        multiline
                        editable={!isActioning}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-pregular text-gray-900 mb-5 min-h-[70px]"
                    />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                        className={`rounded-xl py-3.5 items-center ${canSubmit ? 'bg-indigo-600' : 'bg-indigo-300'}`}
                    >
                        {isActioning ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-psemibold text-sm">Dërgo kontraofertën</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default ConversationCounterOfferSheet;
